import { Injectable }    from '@angular/core';
import * as Showdown from 'showdown';
import 'rxjs/add/operator/toPromise';
import {showdownPrism} from './lib/showdownPrism';

import {ShowdownConfig} from '../config';



@Injectable()
export class RealMarkService {
    
    // used to automatically wrap markdown with ```codeBlock/n  /n```
    private codeBlock: string; 
    private flavor: string; 
    private headerLinks: boolean; 
 
    constructor(config: ShowdownConfig) {
      if (config) { 
        this.flavor = config.flavor; 
        this.headerLinks = config.headerLinks; 
      }
    }
    /**
     * legacy entry point used for the directive
     */
    fromInput(raw: string): string {
      let html = this.process(raw);
      return html;
    }

    /**
     * legacy Promise entry point
     */
    fromInputPromise(raw: string): Promise<string> {
      let html = this.process(raw);
      return Promise.resolve(html);
    }

    /**
     * main function of class. converts markdown to html with showdown. 
     */
    process(markdown: string): string {
      Showdown.extension('showdown-prism', showdownPrism);
      var extensions = ['showdown-prism']
      if(this.headerLinks){
      // Extension
      Showdown.extension('header-anchors', function() {
        // https://github.com/showdownjs/showdown/issues/344
        var ancTpl = '$1<a id="user-content-$3" class="anchor" href="#$3" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>$4';

        return [{
          type: 'html',
          regex: /(<h([1-3]) id="([^"]+?)">)(.*<\/h\2>)/g,
          replace: ancTpl
        }];
      });
      extensions.push('header-anchors');
    }
      let converter = new Showdown.Converter({extensions: extensions});

      converter.setFlavor(this.flavor);
      return converter.makeHtml(markdown);
    }
 
    /**
     * public function to compare each line one by one for changes. Return resolved promise
     */
    compareMarkdown(content : string, original: string, showDeleted: boolean, raw: boolean, codeBlock: string ): Promise<any>{
      let returnOut = [];
      this.codeBlock = codeBlock;
      if(original !== content){
        if(!content && !original){
          console.error("undefined");
          return Promise.reject("Error");
        }
        var s1Parts = content.split("\n"),
         s2Parts = original.split("\n"),
         showLog = false,
         count = s2Parts.length > s1Parts.length ? s2Parts.length : s1Parts.length,
         j=0;

        for(var i = 0; i<count;){
          if(showLog){console.warn(count, "=", s1Parts[i],i, "::", s2Parts[j], j);}

          if(s1Parts[i] === s2Parts[j]){
            if(s1Parts[i] !== undefined){
              if(showLog){console.log("KEEP", s1Parts[i]);}
              returnOut.push(this.wrapLine("line", s1Parts[i], i, j, raw));
            }
            j++;
            i++;
          }else if((s1Parts[i] === s2Parts[j+1] || s1Parts[i+1] === s2Parts[j+2]) && s2Parts[j] !== undefined){
            if(showLog){console.log("DELETED", s2Parts[j]);}
            if(showDeleted){
                returnOut.push(this.wrapLine("deleted", s2Parts[j], i, j, raw));
            }
            j++;
          }else if(s1Parts[i+1] === s2Parts[j+1] && s1Parts[i] !== undefined && s2Parts[j] !== undefined){
            if(showLog){console.log("REPLACED", s2Parts[j], "WITH", s1Parts[i] );}
            if(showDeleted){
                returnOut.push(this.wrapLine("deleted", s2Parts[j], i, j, raw));
            }
              returnOut.push(this.wrapLine("added", s1Parts[i], i, j, raw));
            j++;
            i++;
          }else if(s1Parts[i+1] === s2Parts[j] && s1Parts[i-1] === s2Parts[j-1] && s1Parts[i] !== undefined && s2Parts[j] !== undefined){
            if(showLog){console.log("INSERT BETWEEN", s2Parts[j], "AND", s2Parts[j-1] );}
            returnOut.push(this.wrapLine("added", s1Parts[i], i, j, raw));
            i++;
          }else{
            // console.warn("COULDNT MATCH LINE");
            if(s2Parts[j] === undefined){
              if(showLog){console.log("COMPLETE NEW LINE", s1Parts[i] );}
              returnOut.push(this.wrapLine("added", s1Parts[i], i, j, raw));
              j--;
            }else{
              if(s1Parts[i]!== undefined){
                if(showLog){console.log("MOST LIKLEY REPLACED", s2Parts[j], "WITH", s1Parts[i] );}
                if(showDeleted){
                  returnOut.push(this.wrapLine("deleted", s2Parts[j], i, j, raw));
                }
                returnOut.push(this.wrapLine("added", s1Parts[i], i, j, raw)); 
              }else{
                if(showDeleted){
                  if(showLog){console.log("DELETED LOW", s1Parts[i], s1Parts[i+1], s2Parts[j]);}
                  returnOut.push(this.wrapLine("deleted", s2Parts[j], i, j, raw));
                }
              }
            }
            j++;
            i++;
          }
        }
       return Promise.resolve(returnOut.join('\n'));
      }else{
        var textLines = [];
        var s1Parts = content.split("\n");
        for(var i = 0; i<s1Parts.length;){
          textLines.push(this.wrapLine("line", s1Parts[i], i, i, raw));
          i++;
        }
        return Promise.resolve(textLines.join('\n'));
      }
    }

    /**
     * returns each line as DIV, with data attributes for line numbers. DIV.innerHTML is either raw content, code highlighted or markdown converted to HTML
     */
    private wrapLine(type: string, text: string, line: number, preLine: number, raw: boolean): string{
      let num1 = line+1;
      let num2 = preLine+1;
      
      if(!text){
        return  "<div data-lineNum1='"+num1+"' data-lineNum2='"+num2+"'   class='diff-"+type+"'></div>";
      }
      if(!raw && !this.codeBlock){  // if line contains markdown which needs to be converted to html 
        return  "<div data-lineNum1='"+num1+"' data-lineNum2='"+num2+"' class='diff-"+type+"'>"+this.markdownRegex(text)+" </div>";
      }
      else if(this.codeBlock){  // automatically wrap in codeBlock
        return  "<div data-lineNum1='"+num1+"' data-lineNum2='"+num2+"' class='diff-"+type+"'>"+this.process("```"+this.codeBlock+"\n"+text+"\n```")+"</div>";
      }
      return  "<div data-lineNum1='"+num1+"' data-lineNum2='"+num2+"'   class='diff-"+type+"'>"+text+" </div>";
    }

    /**
     * all convert the following markdown tokens to HTML. Return the raw text if no RegExp matches.
     */
    private markdownRegex(text: string): any{
      if(!text){ // return straight away if text is undefined
        return "";
      }
      var regExpressions : [RegExp] = [
        new RegExp(/(#+\s?)(.*)/, 'i'),                   // headers
        new RegExp(/\[([^\[]+)\]\(([^\)]+)\)/, 'i'),      // links
        new RegExp(/(\*\*|__)(.*?)\1/, 'i'),              // bold
        new RegExp(/(\*|_)(.*?)\1/, 'i'),                 // emphasis
        new RegExp(/\~\~(.*?)\~\~/, 'i'),                 // del
        new RegExp(/\:\"(.*?)\"\:/, 'i'),                 // quote
        new RegExp(/`(.*?)`/, 'i'),                       // inline code
        new RegExp(/(\-+\s)(.*)/, 'i'),                   // ul lists
        new RegExp(/[0-9]+\.(.*)/, 'i'),                  // ol lists
        new RegExp(/(&gt;|\>)(.*)/, 'i'),                 // blockquotes
      ];
      // var  regHelpText = ["header", "bold", "emphasis", "del", "quote", "inline code", "ul lists", "ol lists", "blockquotes", "horizontal rule", "add paragraphs", "fix extra ul", "fix extra ol", "fix extra blockquote"];
      var typeResult = null;
      for (var i = 0; i < regExpressions.length; ) {
         var typeMatch = regExpressions[i];
          typeResult = typeMatch.exec(text);
          if(typeResult){
            // return "["+regHelpText[i]+"] "+this.process(text);
            return this.process(text);
          }else{
            i++;
          }
      }
      return text;
    }

}