import { Injectable }    from '@angular/core';
import * as Showdown from 'showdown';
import 'rxjs/add/operator/toPromise';
import {showdownPrism} from './lib/showdownPrism';




@Injectable()
export class RealMarkService {
    count=0;
    constructor() {
    }
    addDatabaseData(test:any){
      console.log(test);
    }

    fromInput(raw: string): string {
      let html = this.process(raw);

      return html;
    }
    fromInputPromise(raw: string): Promise<string> {
      let html = this.process(raw);
      return Promise.resolve(html);
    }
    process(markdown: string) {
      Showdown.extension('showdown-prism', showdownPrism);

      let converter = new Showdown.Converter({extensions: ['showdown-prism']});

      return converter.makeHtml(markdown);
    }
 


  compareMarkdown(content : string, original: string, showDeleted: boolean, raw: boolean): Promise<any>{
    let returnOut = [];

    if(original !== content){
      if(!content && !original){
        console.error("undefined");
        return Promise.reject("Error");
      }
      var s1Parts = content.split("\n");
      var s2Parts = original.split("\n");
      var showLog = false;

      if(showLog){
        // console.warn(s1Parts);
        // console.warn(s2Parts);
      }
      var count = s2Parts.length > s1Parts.length ? s2Parts.length : s1Parts.length;
      var j=0;

      for(var i = 0; i<count;){
        if(showLog){console.warn(count, "=", s1Parts[i],i, "::", s2Parts[j], j);}

        if(s1Parts[i] === s2Parts[j]){
          if(s1Parts[i] !== undefined){
            if(showLog){console.log("KEEP", s1Parts[i]);}
            returnOut.push(this.wrapSpan("line", s1Parts[i], i, j, raw));
          }
          j++;
          i++;
        }else if((s1Parts[i] === s2Parts[j+1] || s1Parts[i+1] === s2Parts[j+2]) && s2Parts[j] !== undefined){
          if(showLog){console.log("DELETED", s2Parts[j]);}
          if(showDeleted){
              returnOut.push(this.wrapSpan("deleted", s2Parts[j], i, j, raw));
          }
          j++;
        }else if(s1Parts[i+1] === s2Parts[j+1] && s1Parts[i] !== undefined && s2Parts[j] !== undefined){
          if(showLog){console.log("REPLACED", s2Parts[j], "WITH", s1Parts[i] );}
          if(showDeleted){
              returnOut.push(this.wrapSpan("deleted", s2Parts[j], i, j, raw));
          }
            returnOut.push(this.wrapSpan("added", s1Parts[i], i, j, raw));
          j++;
          i++;
        }else if(s1Parts[i+1] === s2Parts[j] && s1Parts[i-1] === s2Parts[j-1] && s1Parts[i] !== undefined && s2Parts[j] !== undefined){
          if(showLog){console.log("INSERT BETWEEN", s2Parts[j], "AND", s2Parts[j-1] );}
          returnOut.push(this.wrapSpan("added", s1Parts[i], i, j, raw));
          i++;
        }else{
          // console.warn("COULDNT MATCH LINE");
          if(s2Parts[j] === undefined){
            if(showLog){console.log("COMPLETE NEW LINE", s1Parts[i] );}
            returnOut.push(this.wrapSpan("added", s1Parts[i], i, j, raw));
            j--;
          }else{
            if(s1Parts[i]!== undefined){
              if(showLog){console.log("MOST LIKLEY REPLACED", s2Parts[j], "WITH", s1Parts[i] );}
              if(showDeleted){
                returnOut.push(this.wrapSpan("deleted", s2Parts[j], i, j, raw));
              }
              returnOut.push(this.wrapSpan("added", s1Parts[i], i, j, raw)); 
            }else{
              if(showDeleted){
                if(showLog){console.log("DELETED LOW", s1Parts[i], s1Parts[i+1], s2Parts[j]);}
                returnOut.push(this.wrapSpan("deleted", s2Parts[j], i, j, raw));
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
        textLines.push(this.wrapSpan("line", s1Parts[i], i, i, raw));
        i++;
      }
      return Promise.resolve(textLines.join('\n'));
    }
  }
  private wrapSpan(type: string, text: string, line: number, preLine: number, raw: boolean): string{
    let num1 = line+1;
    let num2 = preLine+1;
    if(!text){
    return  "<div data-lineNum1='"+num1+"' data-lineNum2='"+num2+"'   class='diff-"+type+"'></div>";
    }
    if(!raw){
      return  "<div data-lineNum1='"+num1+"' data-lineNum2='"+num2+"' class='diff-"+type+"'>"+this.markdownRegex(text)+" </div>";
    }
    return  "<div data-lineNum1='"+num1+"' data-lineNum2='"+num2+"'   class='diff-"+type+"'>"+text+" </div>";

  }
  private markdownRegex(text: string): any{
    if(!text){
      return "";
    }
    var regExpressions : [RegExp] = [
    new RegExp(/(#+\s?)(.*)/, 'i'),                                                       // headers
    new RegExp(/\[([^\[]+)\]\(([^\)]+)\)/, 'i'),                                          // links
    new RegExp(/(\*\*|__)(.*?)\1/, 'i'),                                                  // bold
    new RegExp(/(\*|_)(.*?)\1/, 'i'),                                                     // emphasis
    new RegExp(/\~\~(.*?)\~\~/, 'i'),                                                     // del
    new RegExp(/\:\"(.*?)\"\:/, 'i'),                                                     // quote
    new RegExp(/`(.*?)`/, 'i'),                                                           // inline code
    new RegExp(/(\-+\s)(.*)/, 'i'),                                                       // ul lists
    new RegExp(/[0-9]+\.(.*)/, 'i'),                                                      // ol lists
    new RegExp(/(&gt;|\>)(.*)/, 'i'),                                                     // blockquotes
    ];

    var  regHelpText = ["header", "bold", "emphasis", "del", "quote", "inline code", "ul lists", "ol lists", "blockquotes", "horizontal rule", "add paragraphs", "fix extra ul", "fix extra ol", "fix extra blockquote"];
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