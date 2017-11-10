// Prism Syntax Highlighter
//
// Uses the Prism syntax highlighter to highlight code blocks.

import * as Prism from 'prismjs';

import 'prismjs/components/prism-c';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-diff';


export function showdownPrism(){
    'use strict';

    return {
        type: 'html',
        filter: function (text : any, converter : any, options : any) {
            // find code blocks with a class
            var regex = /<pre><code class="([a-zA-Z0-9]+) language\-(.*?)">([\s\S]*?)<\/code><\/pre>/g;
            var html = text;
            var results = text.match(regex);
            var regex2 = new RegExp(/<pre><code class="([a-zA-Z0-9]+) language\-(.*?)">([\s\S]*?)<\/code><\/pre>/g, 'i');
            if(results && results[0]){
                for (var i = 0; i < results.length; i++) {
                    var fresult = regex2.exec(results[i]);

                    // get the extracted language and code
                    if(fresult && fresult[3]){
                        var language : any = fresult[1];
                        var code : any     = fresult[3];

                         // lower case the language so case does not matter
                        language = language.toLowerCase();

                        // decode HTML entities encoded by showdown
                        // the opposite of replacements taken from showdown's _EncodeCode
                        code = code.replace(/&lt;/g,"<");
                        code = code.replace(/&gt;/g,">");
                        code = code.replace(/&amp;/g,"&");
                        
                        // make sure to decode ampersands last otherwise you will double decode < and >
                        // original      : &lt; makes the '<' symbol
                        // encoded       : &amp;lt; makes the '&lt;' symbol
                        //
                        // Wrong:
                        // replace &amp; : &lt; makes the '&lth;' symbol
                        // replace &lt;  : < makes the < symbol
                        //
                        // Correct:
                        // replace &lt;  : &amp;lt; makes the '<' symbol
                        // replace &amp; : &lt; makes the '<' symbol
                        
                        // highlight the code with prism
                        // get the grammar (language supported by prism)
                        var grammar : any = Prism.languages[language];

                        if (!grammar) {
                            // the given class name is not a language supported by prism
                            // skip to the next code block
                            console.log("NO PrismJS Language",Prism.languages);
                            continue;
                        }
                        
                        // do the highlighting
                        var highlightedCode = Prism.highlight(code, grammar, language);

                        // create the new HTML with the highlighted code and language class
                        // Prism moves the language class from the <code> element to the <pre> element
                        //  so we will set the class on the <pre> element
                        var newHTML : String = '<pre class="language-' + language + '"><code class="language-' + language + '">' + highlightedCode + '</code></pre>';

                        html = html.replace(fresult.input, newHTML);
                    }
                }
            }
            return html;
        }
    };
};