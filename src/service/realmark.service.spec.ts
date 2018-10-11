import { Component, OnInit, DebugElement, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import {inject,fakeAsync} from '@angular/core/testing';
import { RealMarkModule, RealMarkService } from "../ng-realmark";


///////////////////////////////////////////////////////////
describe("RealMarkService", () => {

  beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [RealMarkModule.forRoot({flavor: 'github', headerLinks: true})],
          declarations: [] // declare the test component
      });
  });

  it("process markdown to HTML", inject(
    [RealMarkService],
    fakeAsync((service: RealMarkService) => {
      let markdown = '# Concipit iter\n\nthis is the second paragraph\n\nthis is the third paragraph';

      let out = service.process(markdown);

      expect(out).toContain('<h1 id="concipit-iter">');
      expect(out).toContain('<svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Concipit iter</h1>');
      expect(out).toContain('<p>this is the second paragraph</p>');
      expect(out).toContain('<p>this is the third paragraph</p>');
    }))
  );
  it("process JavaScript to highlighted HTML", inject(
    [RealMarkService],
    fakeAsync((service: RealMarkService) => {
      let markdown = '```js\nfunction multiply(num1,num2) {\n  var result = num1 * num2;\n  return result;\n}\n```';

      let out = service.process(markdown);

      expect(out).toContain('<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">multiply</span><span class="token punctuation">(</span>num1<span class="token punctuation">,</span>num2<span class="token punctuation">)</span> <span class="token punctuation">{</span>&#10;  <span class="token keyword">var</span> result <span class="token operator">=</span> num1 <span class="token operator">*</span> num2<span class="token punctuation">;</span>&#10;  <span class="token keyword">return</span> result<span class="token punctuation">;</span>&#10;<span class="token punctuation">}</span></code></pre>');
    }))
  );
  it("process PHP to highlighted HTML", inject(
    [RealMarkService],
    fakeAsync((service: RealMarkService) => {
      let markdown = '```php\n<?php\nclass SimpleClass\n{\n    // property declaration\n    public $var = \'a default value\';\n\n    // method declaration\n    public function displayVar() {\n        echo $this->var;\n    }\n}\n?>\n```';

      let out = service.process(markdown);

      expect(out).toContain('<pre class="language-php"><code class="language-php"><span class="token php language-php"><span class="token delimiter important">&lt;?php</span>&#10;<span class="token keyword">class</span> <span class="token class-name">SimpleClass</span>&#10;<span class="token punctuation">{</span>&#10;    <span class="token comment">// property declaration</span>&#10;    <span class="token keyword">public</span> <span class="token variable">$var</span> <span class="token operator">=</span> <span class="token single-quoted-string string">\'a default value\'</span><span class="token punctuation">;</span>&#10;&#10;    <span class="token comment">// method declaration</span>&#10;    <span class="token keyword">public</span> <span class="token keyword">function</span> <span class="token function">displayVar</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>&#10;        <span class="token keyword">echo</span> <span class="token variable">$this</span><span class="token operator">-</span><span class="token operator">&gt;</span><span class="token keyword">var</span><span class="token punctuation">;</span>&#10;    <span class="token punctuation">}</span>&#10;<span class="token punctuation">}</span>&#10;<span class="token delimiter important">?&gt;</span></span></code></pre>');
    }))
  );


  it("compare markdown - first line edit", inject(
    [RealMarkService],
    fakeAsync((service: RealMarkService) => {
      let original = 'This is a paragraph.\n\nthis is the second paragraph\n\nthis is the third paragraph';
      let content = 'This is the first paragraph.\n\nthis is the second paragraph\n\nthis is the third paragraph';

      let out = service.compareMarkdown(content, original, true, true);

      let testSuccess = [
        {type: "deleted", text: "This is a paragraph.", originalLine: 1, newLine: 1, format: "text"},
        {type: "added", text: "This is the first paragraph.", originalLine: 1, newLine: 1, format: "text"},
        {type: "line", text: "", originalLine: 2, newLine: 2, format: "text"},
        {type: "line", text: "this is the second paragraph", originalLine: 3, newLine: 3, format: "text"},
        {type: "line", text: "", originalLine: 4, newLine: 4, format: "text"},
        {type: "line", text: "this is the third paragraph", originalLine: 5, newLine: 5, format: "text"}
      ];

      expect(out).toEqual(testSuccess);
    }))
  );
  it("compare markdown - added paragraph inbetween", inject(
    [RealMarkService],
    fakeAsync((service: RealMarkService) => {
      let original = '# Heading 1\nthis is the second paragraph\nthis is the third paragraph';
      let content =  '# Heading 1\nThis is the first paragraph.\nthis is the second paragraph\nthis is the third paragraph';

      let out = service.compareMarkdown(content, original, true, false);

      let testSuccess = [
        {type: "line", text: "# Heading 1", originalLine: 1, newLine: 1, format: "markdown"},
        {type: "added", text: "This is the first paragraph.", originalLine: 2, newLine: 2, format: "markdown"},
        {type: "line", text: "this is the second paragraph", originalLine: 3, newLine: 2, format: "markdown"},
        {type: "line", text: "this is the third paragraph", originalLine: 4, newLine: 3, format: "markdown"}
      ];

      expect(out).toEqual(testSuccess);
    }))
  );
  it("compare markdown - mutiple line change", inject(
    [RealMarkService],
    fakeAsync((service: RealMarkService) => {
      let original = 'This is a paragraph.\n\n\# Header 1\n## Header 2\n##### Header 5';
      let content = '##### Header 5\n###### Header 6\n![Alt Text](http://placehold.it/200x50 "Image Title")';

      let out = service.compareMarkdown(content, original, true, true);

      let testSuccess = [
        {type: "deleted", text: "This is a paragraph.", originalLine: 1, newLine: 1, format: "text"},
        {type: "added", text: "##### Header 5", originalLine: 1, newLine: 1, format: "text"},
        {type: "deleted", text: "", originalLine: 2, newLine: 2, format: "text"},
        {type: "added", text: "###### Header 6", originalLine: 2, newLine: 2, format: "text"},
        {type: "deleted", text: "# Header 1", originalLine: 3, newLine: 3, format: "text"},
        {type: "added", text: "![Alt Text](http://placehold.it/200x50 \"Image Title\")", originalLine: 3, newLine: 3, format: "text"},
        {type: "deleted", text: "## Header 2", originalLine: 4, newLine: 4, format: "text"},
        {type: "deleted", text: "##### Header 5", originalLine: 4, newLine: 5, format: "text"}
      ];

      expect(out).toEqual(testSuccess);
    }))
  );
});
