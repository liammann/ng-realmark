import { Injectable, Sanitizer, SecurityContext }    from '@angular/core';
import * as Showdown from 'showdown';
import 'rxjs/add/operator/toPromise';
import {showdownPrism} from './lib/showdownPrism';

import {ShowdownConfig, Revision} from '../config';

import {diff3Merge} from './lib/diff3';


export class ComparedLine {
  type: string;
  text: string;
  originalLine: number;
  newLine: number;
  format: string;
}

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
     * main function of class, converts markdown to html with showdown.
     */
    process(markdown: string): string {
      Showdown.extension('showdown-prism', showdownPrism);
      var extensions = ['showdown-prism'];

      let converter = new Showdown.Converter({extensions: extensions});
      converter.setFlavor(this.flavor);

      let unsafe = converter.makeHtml(markdown);

      let HTMLOutput : string = "" + this.sanitizer.sanitize(SecurityContext.HTML, unsafe);
      let HTMLOutputFinal = HTMLOutput;
      let tableOfContents = [];

      if(this.headerLinks){
        let linkIcon = '<svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>';
        let currentURL = "";
        if (typeof(window) !== 'undefined') {
          currentURL = window.location.href.split('#')[0]; // remove current hash
        }
        var checkNumber: any = {};
        let regex = new RegExp(/(<h([1-5]))>(.+?)(?=\<\/h\2>)(<\/h\2>)/, 'g');
        var match;
        while ((match = regex.exec(HTMLOutput)) != null) {
          let idName = match[3].replace(/<\/?[^>]+(>|$)/g, "").replace(/\s/g, '-').toLowerCase();
          let content = match[3].replace(/<\/?[^>]+(>|$)/g, "");
          let tableOfContentsCheck = tableOfContents.map(v => v.link);
          if (tableOfContentsCheck.indexOf(idName) !== -1){
            checkNumber[idName] !== undefined ? checkNumber[idName] = checkNumber[idName] + 1 : checkNumber[idName] = 2;
            idName += "-" + checkNumber[idName];
          }

          let linkBtn = '<a class="anchor" href="' + currentURL + '#' + idName + '" aria-hidden="true">' + linkIcon + '</a>';
          tableOfContents.push({value: content, depth: match[2], link: idName});
          HTMLOutputFinal = HTMLOutputFinal.replace(match[0], match[1] + ' id=\"' + idName + '\">'+ linkBtn + match[3] + match[4]);

        }
      }

      this.tableOfContents = tableOfContents;
      return HTMLOutputFinal;
    }



    mergeMarkdown( patchVersion: Revision, originalVersion: Revision, liveVersion: Revision ) : {content: string, conflicts: any } {

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
              + result[i].conflict.b.join("\n") + "\n"
              + "===========" + "\n"
              + result[i].conflict.a.join("\n") + "\n"
              + "<<<<<<<<<<<< LIVE: "+ liveVersion.revision);

          }else{
            rtn.push(result[i].ok);

          }
        }

        return {content: rtn.join('\n'), conflicts: conflict};
    }

    /**
     * public function to compare each line one by one for changes. Return resolved promise
     */
    compareMarkdown(content : string, compared: string, showDeleted: boolean, raw: boolean, codeBlock?: string): ComparedLine[] {
      var showLog = false;
      let returnOut: ComparedLine[] = [];
      // console.log("Called compareMarkdown()");

      this.codeBlock = codeBlock ? codeBlock : "";

      var conflict = []
      // if(compared !== content){
        if(!content && !compared){
          return [];
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

          if(s1Parts[i] === s2Parts[j]){
            if(s1Parts[i] !== undefined){
              if(showLog){console.log("KEEP", s1Parts[i]);}
              returnOut.push(this.buildReturnLine("line", s1Parts[i], i, j, raw));
            }
            j++;
            i++;
          }else if((s1Parts[i] === s2Parts[j+1] || s1Parts[i+1] === s2Parts[j+2]) && s2Parts[j] !== undefined){
            if(showLog){console.log("DELETED", s2Parts[j]);}
            if(showDeleted){
                returnOut.push(this.buildReturnLine("deleted", s2Parts[j], i, j, raw));
            }
            j++;
          }else if(s1Parts[i+1] === s2Parts[j+1] && s1Parts[i] !== undefined && s2Parts[j] !== undefined){
            if(showLog){console.log("REPLACED", s2Parts[j], "WITH", s1Parts[i] );}
            if(showDeleted){
                returnOut.push(this.buildReturnLine("deleted", s2Parts[j], i, j, raw));
            }
            returnOut.push(this.buildReturnLine("added", s1Parts[i], i, j, raw));
            j++;
            i++;
          }else if(s1Parts[i+1] === s2Parts[j] && s1Parts[i-1] === s2Parts[j-1] && s1Parts[i] !== undefined && s2Parts[j] !== undefined){
            if(showLog){console.log("INSERT BETWEEN", s2Parts[j], "AND", s2Parts[j-1] );}
            returnOut.push(this.buildReturnLine("added", s1Parts[i], i, j, raw));
            i++;
          }else{
            // console.warn("COULDNT MATCH LINE");
            if(s2Parts[j] === undefined){
              if(showLog){console.log("COMPLETE NEW LINE", s1Parts[i] );}
              returnOut.push(this.buildReturnLine("added", s1Parts[i], i, j, raw));
              j--;
            }else{
              if(s1Parts[i]!== undefined){
                if(showLog){console.log("MOST LIKLEY REPLACED", s2Parts[j], "WITH", s1Parts[i]);}
                if(showDeleted){
                  returnOut.push(this.buildReturnLine("deleted", s2Parts[j], i, j, raw));
                }
                returnOut.push(this.buildReturnLine("added", s1Parts[i], i, j, raw));
              }else{
                if(showDeleted){
                  if(showLog){console.log("DELETED LOW", s1Parts[i], s1Parts[i+1], s2Parts[j]);}
                  returnOut.push(this.buildReturnLine("deleted", s2Parts[j], i, j, raw));
                }
              }
            }
            j++;
            i++;
          }
        }
      // }

      return returnOut;
    }

    /**
     * builds return object for each line
     */
    private buildReturnLine(type: string, text: string, originalLine: number, newLine: number, raw: boolean): ComparedLine {
      return {
        "type": type,
        "text": text,
        "originalLine": originalLine+1,
        "newLine": newLine+1,
        "format": this.codeBlock ? "code" : raw ? "text" : "markdown"
      };
    }
}
