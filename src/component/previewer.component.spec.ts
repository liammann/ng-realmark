import { FormsModule } from '@angular/forms';
import { Component, OnInit, DebugElement, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { RealMarkModule, PreviewerComponent } from "../ng-realmark";



/**
 * TestHostComponent
 */
@Component({
    template: `
    <realmark-previewer [content]="markdown" (toc)="sidebarHeadings = $event" ></realmark-previewer>
`
})
export class TestHostComponent {
  public markdown = "# Concipit iter";;
  public sidebarHeadings: any;
}

///////////////////////////////////////////////////////////
describe("Previewer", () => {

    let comp:TestHostComponent;
    let fixture:ComponentFixture<TestHostComponent>;
    let previewer:PreviewerComponent;
    let previewerElement:DebugElement;


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [  FormsModule,  RealMarkModule.forRoot({flavor: 'github', headerLinks: true})],
            declarations: [TestHostComponent] // declare the test component
        });

        fixture = TestBed.createComponent(TestHostComponent);
        comp = fixture.componentInstance; // TestHostComponent test instance

        previewerElement = fixture.debugElement.query(By.css("realmark-previewer"));
        previewer = previewerElement.componentInstance;
    });

    it("should be created with default values", done => {
      expect(comp).toBeTruthy();
      expect(previewer).toBeTruthy();
      expect(comp.sidebarHeadings).toBeUndefined();

      fixture.detectChanges();
      expect(previewerElement.nativeElement.innerHTML).toBe('<div><h1 id="concipit-iter"><a class="anchor" href="http://localhost:9876/context.html#concipit-iter" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Concipit iter</h1></div>');
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(comp.sidebarHeadings).toEqual([ Object({ value: 'Concipit iter', depth: '1', link: 'concipit-iter' }) ]);
        done();
      })
    });
    it("update <realmark-previewer> with new content", done => {
        comp.markdown = '# Concipit new content';

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(previewerElement.nativeElement.innerHTML).toBe('<div><h1 id="concipit-new-content"><a class="anchor" href="http://localhost:9876/context.html#concipit-new-content" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Concipit new content</h1></div>');
          expect(comp.sidebarHeadings).toEqual([ Object({ value: 'Concipit new content', depth: '1', link: 'concipit-new-content' }) ]);
          done();
        });

    });

    it("Table of contents handles duplicate headings correctly", done => {
        comp.markdown = '# Concipit new content\n Blah djfsjsdf fsdjfsdj dfsbhfdsewruweru\n\n# Concipit new content\n Blah djfsjsdf fsdjfsdj dfsbhfdsewruweru\n\n Blah djfsjsdf fsdjfsdj dfsbhfdsewruweru\n\n\n# Concipit new content\n Blah djfsjsdf fsdjfsdj dfsbhfdsewruweru\n\n# Concipit new content\n Blah djfsjsdf fsdjfsdj dfsbhfdsewruweru\n ';

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          let result = [{value: "Concipit new content", depth: "1", link: "concipit-new-content"}, {value: "Concipit new content", depth: "1", link: "concipit-new-content-2"}, {value: "Concipit new content", depth: "1", link: "concipit-new-content-3"}, {value: "Concipit new content", depth: "1", link: "concipit-new-content-4"}];
          expect(comp.sidebarHeadings.length).toBe(4);
          expect(comp.sidebarHeadings).toEqual(result);
          done();
        });

    });

    it("<realmark-previewer> kitchen sink test", done => {
      comp.markdown = 'This is a paragraph.\n\n\# Header 1\n## Header 2\n### Header 3\n#### Header 4\n##### Header 5\n###### Header 6\n\n\n\n![Alt Text](http://placehold.it/200x50 "Image Title")\n';

      fixture.detectChanges();
      fixture.whenStable().then(() => {

        let result = '<div><p>This is a paragraph.</p>\n<h1 id="header-1"><a class="anchor" href="http://localhost:9876/context.html#header-1" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Header 1</h1>\n<h2 id="header-2"><a class="anchor" href="http://localhost:9876/context.html#header-2" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Header 2</h2>\n<h3 id="header-3"><a class="anchor" href="http://localhost:9876/context.html#header-3" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Header 3</h3>\n<h4 id="header-4"><a class="anchor" href="http://localhost:9876/context.html#header-4" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Header 4</h4>\n<h5 id="header-5"><a class="anchor" href="http://localhost:9876/context.html#header-5" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Header 5</h5>\n<h6>Header 6</h6>\n<p><img src="http://placehold.it/200x50" alt="Alt Text" title="Image Title"></p></div>';

        expect(previewerElement.nativeElement.innerHTML).toContain(result);

        let tableOfContents = [{value: "Header 1", depth: "1", link: "header-1"},{value: "Header 2", depth: "2", link: "header-2"},{value: "Header 3", depth: "3", link: "header-3"},{value: "Header 4", depth: "4", link: "header-4"},{value: "Header 5", depth: "5", link: "header-5"}];

        expect(comp.sidebarHeadings).toEqual(tableOfContents);
        done();
      });

    });

});
