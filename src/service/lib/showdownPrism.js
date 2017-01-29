// Prism Syntax Highlighter
//
// Uses the Prism syntax highlighter to highlight code blocks.
"use strict";
require("prismjs");
function showdownPrism() {
    'use strict';
    return {
        type: 'html',
        filter: function (text, converter, options) {
            // find code blocks with a class
            // <pre><code class=" : start of a code block with a class
            // ([a-z0-9]+)        : extract language name (result[1])
            // (.*?)              : extract class name (result[2])
            // ">                 : end of code tag
            // ([\s\S]*?)         : extract code (result[3])
            // </code></pre>      : end of code block
            var regex = /<pre><code class="([a-z0-9]+) language\-(.*?)">([\s\S]*?)<\/code><\/pre>/g;
            var result;
            var html = text;
            while ((result = regex.exec(text)) !== null) {
                // get the extracted language and code
                var language = result[1];
                var code = result[3];
                // lower case the language so case does not matter
                language = language.toLowerCase();
                // decode HTML entities encoded by showdown
                // the opposite of replacements taken from showdown's _EncodeCode
                code = code.replace(/&lt;/g, "<");
                code = code.replace(/&gt;/g, ">");
                code = code.replace(/&amp;/g, "&");
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
                var grammar = Prism.languages[language];
                if (!grammar) {
                    // the given class name is not a language supported by prism
                    // skip to the next code block
                    continue;
                }
                // do the highlighting
                var highlightedCode = Prism.highlight(code, grammar, language);
                // create the new HTML with the highlighted code and language class
                // Prism moves the language class from the <code> element to the <pre> element
                //  so we will set the class on the <pre> element
                var newHTML = '<pre class="language-' + language + '"><code>' + highlightedCode + '</code></pre>';
                // replace the old HTML with the new HTML
                var oldHTML = result[0];
                var oldHTMLIndex = result.index;
                var beforeOldHTML = html.substring(0, oldHTMLIndex);
                var afterOldHTML = html.substring(oldHTMLIndex + oldHTML.length);
                html = beforeOldHTML + newHTML + afterOldHTML;
                // the next regex search should start after the end of the new HTML
                var newHTMLIndex = oldHTMLIndex;
                regex.lastIndex = newHTMLIndex + newHTML.length;
            }
            return html;
        }
    };
}
exports.showdownPrism = showdownPrism;
;
//# sourceMappingURL=showdownPrism.js.map