import { FormsModule } from '@angular/forms';
import { Component, OnInit, DebugElement, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { RealMarkModule, DiffComponent, RealMarkService} from "../ng-realmark";



/**
 * TestHostComponent
 */
@Component({
    template: `
    <realmark-diff [content]="markdown" [original]="markdownOriginal" [codeBlock]="codeBlock">Input Test</realmark-diff>
`
})
export class TestHostComponent {
  public markdownOriginal = "# Concipit iter";
  public markdown = "TEST_CASE_1";
  public codeBlock = "js"
}


export class MockService extends RealMarkService {
    compareMarkdown(content, original, showDeleted, showMarkdown, codeBlock){
      switch (content) {
        case "TEST_CASE_1":
          return [
            {type: "deleted", text: "This is a paragraph.", originalLine: 1, newLine: 1, format: "text"},
            {type: "added", text: "This is the first paragraph.", originalLine: 1, newLine: 1, format: "text"},
            {type: "line", text: "", originalLine: 2, newLine: 2, format: "text"},
            {type: "line", text: "this is the second paragraph", originalLine: 3, newLine: 3, format: "text"},
            {type: "line", text: "", originalLine: 4, newLine: 4, format: "text"},
            {type: "line", text: "this is the third paragraph", originalLine: 5, newLine: 5, format: "text"}
          ];
          break;

        case "TEST_CASE_2":
          return [
            {type: "added", text: "TEST 2 This is the first paragraph.", originalLine: 1, newLine: 1, format: "text"},
            {type: "line", text: "", originalLine: 2, newLine: 2, format: "text"},
            {type: "line", text: "this is the second paragraph", originalLine: 3, newLine: 3, format: "text"},
          ];
        break;

        case "TEST_CASE_3":
          return [
            {type: "line", text: "# Heading 1", originalLine: 1, newLine: 1, format: "text"},
            {type: "added", text: "This is the new paragraph.", originalLine: 2, newLine: 2, format: "text"},
            {type: "line", text: "this is the 1st paragraph", originalLine: 3, newLine: 2, format: "text"},
            {type: "line", text: "this is the 2nd paragraph", originalLine: 4, newLine: 3, format: "text"}
          ];
          break;
          case "TEST_CASE_4":
            return [
              {type: "line", text: "# Test case 4", originalLine: 1, newLine: 1, format: "markdon"},
              {type: "added", text: "This is the new paragraph.", originalLine: 2, newLine: 2, format: "markdon"},
              {type: "line", text: "this is the 1st paragraph", originalLine: 3, newLine: 2, format: "markdon"},
              {type: "line", text: "this is the 2nd paragraph", originalLine: 4, newLine: 3, format: "markdon"}
            ];
            break;

          case "TEST_CASE_5":
            return [
              {type: "line", text: "function getDate(){", originalLine: 1, newLine: 1, format: "code"},
              {type: "added", text: "	var test = 20;", originalLine: 2, newLine: 2, format: "code"},
              {type: "added", text: "	return test;", originalLine: 3, newLine: 3, format: "code"},
              {type: "added", text: "}", originalLine: 4, newLine: 4, format: "code"},
            ]
            break;
        }
    };
  }

///////////////////////////////////////////////////////////
describe("Diff", () => {

    let comp:TestHostComponent;
    let fixture:ComponentFixture<TestHostComponent>;
    let diff:DiffComponent;
    let diffElement:DebugElement;
    let spy: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [  FormsModule,  RealMarkModule.forRoot({flavor: 'github', headerLinks: true})],
            declarations: [TestHostComponent] // declare the test component
        }).overrideComponent(DiffComponent, {
          set: {
            providers: [
              {provide: RealMarkService, useClass: MockService}
            ]
          }
        });

        fixture = TestBed.createComponent(TestHostComponent);
        comp = fixture.componentInstance; // TestHostComponent test instance

        diffElement = fixture.debugElement.query(By.css("realmark-diff"));
        diff = diffElement.componentInstance;
    });

    it("should be created with default values", done => {
      expect(comp).toBeTruthy();
      expect(diff).toBeTruthy();

      expect(diffElement.nativeElement.innerHTML).toContain('Input Test');
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        let testSuccess = '<table><tbody><tr class="diff-deleted"><td class="diff-num1">1</td><td class="diff-num2">1</td><td width="100%"><p>This is a paragraph.</p></td></tr>\n<tr class="diff-added"><td class="diff-num1">1</td>';

        expect(diffElement.nativeElement.innerHTML).toContain(testSuccess);
      });
      done();
    });


    it("should display the correct comparison table - hide deletions", done => {

      comp.markdown = "TEST_CASE_2";

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        let testSuccess = '<table><tbody><tr class="diff-added"><td class="diff-num1">1</td><td class="diff-num2">1</td><td width="100%"><p>TEST 2 This is the first paragraph.</p></td></tr>';
        expect(diffElement.nativeElement.innerHTML).toContain(testSuccess);
      });
      done();
    });

    it("should display the correct comparison table - Markdown to HTML", done => {

      comp.markdown = "TEST_CASE_3";

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        let testSuccess = '<tr class="diff-line"><td class="diff-num1">1</td><td class="diff-num2">1</td><td width="100%"><h1><a class="anchor" ';
        expect(diffElement.nativeElement.innerHTML).toContain(testSuccess);
        let testSuccess2 = '#heading-1"></a>Heading 1</h1></td></tr>';
        expect(diffElement.nativeElement.innerHTML).toContain(testSuccess2);

      });
      done();
    });

    it("should display the correct comparison table - show markdown tags", done => {

      comp.markdown = "TEST_CASE_4";

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        let testSuccess = '<tbody><tr class="diff-line"><td class="diff-num1">1</td><td class="diff-num2">1</td><td width="100%"> # Test case 4</td></tr>\n<tr class="diff-added"><td class="diff-num1">2</td><td class="diff-num2">2</td><td width="100%"> This is the new paragraph.</td></tr>\n<tr class="diff-line"><td class="diff-num1">3</td><td class="diff-num2">2</td><td width="100%"> this is the 1st paragraph</td></tr>\n<tr class="diff-line"><td class="diff-num1">4</td><td class="diff-num2">3</td><td width="100%"> this is the 2nd paragraph</td></tr></tbody>';
        expect(diffElement.nativeElement.innerHTML).toContain(testSuccess);

      });
      done();
    });

    it("should display the correct comparison table - code", done => {

      comp.markdown = "TEST_CASE_5";

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        let testSuccess = '<tbody><tr class="diff-line"><td class="diff-num1">1</td><td class="diff-num2">1</td><td width="100%"><pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">getDate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></code></pre></td></tr>\n<tr class="diff-added"><td class="diff-num1">2</td><td class="diff-num2">2</td><td width="100%"><pre class="language-js"><code class="language-js">    <span class="token keyword">var</span> test <span class="token operator">=</span> <span class="token number">20</span><span class="token punctuation">;</span></code></pre></td></tr>';
        expect(diffElement.nativeElement.innerHTML).toContain(testSuccess);

      });
      done();
    });
});
