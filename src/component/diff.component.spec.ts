import { FormsModule } from '@angular/forms';
import { Component, OnInit, DebugElement, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { RealMarkModule, DiffComponent } from "../ng-realmark";



/**
 * TestHostComponent
 */
@Component({
    template: `
    <realmark-diff [content]="markdown"  [original]="markdownOriginal">Input Test</realmark-diff>
`
})
export class TestHostComponent {
  public markdownOriginal = "# Concipit iter";
  public markdown = "# Concipit new word iter";
}

///////////////////////////////////////////////////////////
describe("Diff", () => {

    let comp:TestHostComponent;
    let fixture:ComponentFixture<TestHostComponent>;
    let diff:DiffComponent;
    let diffElement:DebugElement;


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [  FormsModule,  RealMarkModule.forRoot({flavor: 'github', headerLinks: true})],
            declarations: [TestHostComponent] // declare the test component
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
        // let result = '<tr class="diff-deleted"><td class="diff-num1">1</td><td class="diff-num2">1</td><td width="100%"><h1><a class="anchor" href="http://localhost:9876/context.html#concipit-iter"></a>Concipit iter</h1></td></tr>';
        // expect(diffElement.nativeElement.innerHTML).toContain(result);
        //
        // let result = '<tr class="diff-added"><td class="diff-num1">1</td><td class="diff-num2">2</td><td width="100%"><h1><a class="anchor" href="http://localhost:9876/context.html#concipit-new-word-iter"></a>Concipit new word iter</h1></td></tr></tbody></table>';
        // expect(diffElement.nativeElement.innerHTML).toContain(result);
      });
      done();
    });
});
