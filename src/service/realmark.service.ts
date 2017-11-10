import { Injectable, Sanitizer, SecurityContext }    from '@angular/core';
import * as Showdown from 'showdown';
import 'rxjs/add/operator/toPromise';
import {showdownPrism} from './lib/showdownPrism';

import {ShowdownConfig, Revision} from '../config';

import {diff3Merge} from './lib/diff3';
    


@Injectable()
export class RealMarkService {
    
    // used to automatically wrap markdown with ```codeBlock/n  /n```
    private codeBlock: string; 
    private flavor: string; 
    private headerLinks: any; 
    private tableOfContents: any; 
 
    constructor(config: ShowdownConfig, private sanitizer: Sanitizer) {
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
    getTableOfContents() {
      return this.tableOfContents;
    }
    /**
     * main function of class. converts markdown to html with showdown. 
     */
    process(markdown: string): string {
      Showdown.extension('showdown-prism', showdownPrism);
      var extensions = ['showdown-prism']

      let converter = new Showdown.Converter({extensions: extensions});

      converter.setFlavor(this.flavor);

      let unsafe = converter.makeHtml(markdown);

      let HTMLOutput : string = ""+this.sanitizer.sanitize(SecurityContext.HTML, unsafe);
      let HTMLOutputFinal = HTMLOutput;
      let tableOfContents = [];

      if(this.headerLinks){
        let linkIcon = '<svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>';
        let currentURL = "";
        if (typeof(window) !== 'undefined') {
          currentURL = window.location.href.split('#')[0]; // remove current hash 
        }

        let regex = new RegExp(/(<h([1-5]))>(.+?)(?=\<\/h\2>)(<\/h\2>)/, 'g');
        var match;
        while ((match = regex.exec(HTMLOutput)) != null) {
          let idName = match[3].replace(/<\/?[^>]+(>|$)/g, "").replace(/\s/g, '-').toLowerCase();
          let content = match[3].replace(/<\/?[^>]+(>|$)/g, "");
          let linkBtn = '<a class="anchor" href="' + currentURL + '#' + idName + '" aria-hidden="true">' + linkIcon + '</a>';
          tableOfContents.push({value: content, depth: match[2], link: idName});
          HTMLOutputFinal = HTMLOutputFinal.replace(match[0], match[1] + ' id=\"' + idName + '\">'+ linkBtn + match[3] + match[4]);
        }
      }
      this.tableOfContents = tableOfContents;
      return HTMLOutputFinal;
    }



    mergeMarkdown(
      patchVersion: Revision,
      originalVersion: Revision,
      liveVersion: Revision
      ): {content: string, conflicts: any}{


        var s1Parts:string[] = [""];
        var s2Parts:string[] = [""];
        var s3Parts:string[] = [""];
        
        if(liveVersion && liveVersion.content && liveVersion.content.split("\n")){
          s1Parts = liveVersion.content.split("\n");
        }
        if(originalVersion && originalVersion.content && originalVersion.content.split("\n")){
          s2Parts = originalVersion.content.split("\n");
        }
        if(patchVersion && patchVersion.content && patchVersion.content.split("\n")){
          s3Parts = patchVersion.content.split("\n");
        }

        let result = diff3Merge(s1Parts, s2Parts, s3Parts);
        var rtn = [], conflict;

        for (var i = 0; i < result.length; i++) {
          if(result[i].ok === undefined){
            
            rtn.push("|>>>>>>>>>>> PATCH: "+ patchVersion.revision + "\n" 
              + result[i].conflict.b + "\n"  
              + "===========" + "\n" 
              + result[i].conflict.a + "\n" 
              + "<<<<<<<<<<<< LIVE: "+ liveVersion.revision);

          }else{
            rtn.push(result[i].ok);

          }
        }
         
        return {content: [].concat.apply([], rtn).join('\n'), conflicts: conflict};
    }

    /**
     * public function to compare each line one by one for changes. Return resolved promise
     */
    compareMarkdown(content : string, compared: string, showDeleted: boolean, raw: boolean, codeBlock?: string): string | null{
      var showLog = false;
      let returnOut = [];
      // console.log("Called compareMarkdown()");
   
      this.codeBlock = codeBlock ? codeBlock : "";

      var conflict = []
      // if(compared !== content){
        if(!content && !compared){
          console.error("undefined");
          return null;
        }
        var s1Parts:string[] = [""];
        var s2Parts:string[] = [""];
        
        if(content && content.split("\n")){
          s1Parts = content.split("\n");
        }
        if(compared && compared.split("\n")){
          s2Parts = compared.split("\n");
        }

        var count = s2Parts.length > s1Parts.length ? s2Parts.length : s1Parts.length,
        j=0;

        for(var i = 0; i<count;){
          if(showLog){console.warn(count, "=", s1Parts[i],i, "::", s2Parts[j], j);}
          
          conflict[i] = null;

          if(s1Parts[i] === s2Parts[j]){
            if(s1Parts[i] !== undefined){
              if(showLog){console.log("KEEP", s1Parts[i]);}
              returnOut.push(this.wrapLine("line", s1Parts[i], i, j, raw, conflict[i]));
            }
            j++;
            i++;
          }else if((s1Parts[i] === s2Parts[j+1] || s1Parts[i+1] === s2Parts[j+2]) && s2Parts[j] !== undefined){
            if(showLog){console.log("DELETED", s2Parts[j]);}
            if(showDeleted){
                returnOut.push(this.wrapLine("deleted", s2Parts[j], i, j, raw, conflict[i]));
            }
            j++;
          }else if(s1Parts[i+1] === s2Parts[j+1] && s1Parts[i] !== undefined && s2Parts[j] !== undefined){
            if(showLog){console.log("REPLACED", s2Parts[j], "WITH", s1Parts[i] );}
            if(showDeleted){
                returnOut.push(this.wrapLine("deleted", s2Parts[j], i, j, raw, conflict[i]));
            }
              returnOut.push(this.wrapLine("added", s1Parts[i], i, j, raw, conflict[i]));
            j++;
            i++;
          }else if(s1Parts[i+1] === s2Parts[j] && s1Parts[i-1] === s2Parts[j-1] && s1Parts[i] !== undefined && s2Parts[j] !== undefined){
            if(showLog){console.log("INSERT BETWEEN", s2Parts[j], "AND", s2Parts[j-1] );}
            returnOut.push(this.wrapLine("added", s1Parts[i], i, j, raw, conflict[i]));
            i++;
          }else{
            // console.warn("COULDNT MATCH LINE");
            if(s2Parts[j] === undefined){
              if(showLog){console.log("COMPLETE NEW LINE", s1Parts[i] );}
              returnOut.push(this.wrapLine("added", s1Parts[i], i, j, raw, conflict[i]));
              j--;
            }else{
              if(s1Parts[i]!== undefined){
                if(showLog){console.log("MOST LIKLEY REPLACED", s2Parts[j], "WITH", s1Parts[i] );}
                if(showDeleted){
                  returnOut.push(this.wrapLine("deleted", s2Parts[j], i, j, raw, conflict[i]));
                }
                returnOut.push(this.wrapLine("added", s1Parts[i], i, j, raw, conflict[i]));
              }else{
                if(showDeleted){
                  if(showLog){console.log("DELETED LOW", s1Parts[i], s1Parts[i+1], s2Parts[j]);}
                  returnOut.push(this.wrapLine("deleted", s2Parts[j], i, j, raw, conflict[i]));
                }
              }
            }
            j++;
            i++;
          }
        }
      // }

      return returnOut.join('\n');
    }

    /**
     * returns each line as DIV, with line numbers. DIV.innerHTML is either raw content, code highlighted or markdown converted to HTML
     */
    private wrapLine(type: string, text: string, line: number, preLine: number, raw: boolean, conflict: any): string{
      let num1 = line+1;
      let num2 = preLine+1;
      let sidebarNums = "<td class='diff-num1'>"+num1+"</td><td class='diff-num2'>"+num2+"</td>";
      let infoDetails = "";

      // if (conflict){
      //   console.log("LINE CONFLICT", conflict.o)
      //   type = type +" diff-conflict2";
      //   infoDetails = "<td>C</td>";
      // }


      if(!text){
        return  "<tr class='diff-"+type+"'>"+sidebarNums+"<td width='100%'></td>"+infoDetails+"</tr>";
      }
      if(!raw && !this.codeBlock){  // if line contains markdown which needs to be converted to html 
        return  "<tr class='diff-"+type+"'>"+sidebarNums+"<td width='100%'>"+ this.sanitizer.sanitize(SecurityContext.HTML,this.markdownRegex(text))+"</td>"+infoDetails+"</tr>";
      }
      else if(this.codeBlock){  // automatically wrap in codeBlock
        return  "<tr class='diff-"+type+"'>"+sidebarNums+"<td width='100%'>"+ this.sanitizer.sanitize(SecurityContext.HTML,this.process("```"+this.codeBlock+"\n"+text+"\n```"))+"</td>"+infoDetails+"</tr>";
      }
      return  "<tr class='diff-"+type+"'>"+sidebarNums+"<td width='100%'> "+this.sanitizer.sanitize(SecurityContext.HTML,text)+"</td>"+infoDetails+"</tr>";
    }

    /**
     * Convert the following markdown tokens to HTML. Return the raw text if no RegExp matches.
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