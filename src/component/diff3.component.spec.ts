import { Component, OnInit, DebugElement, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { RealMarkModule, Diff3Component } from "../ng-realmark";



/**
 * TestHostComponent
 */
@Component({
    template: `
	<realmark-diff3  [patch]="diff3patch" [original]="diff3original" [live]="diff3live" (merged)="_merged($event)">Input Name</realmark-diff3>
`
})
export class TestHostComponent {
	public diff3original = {content: "# Concipit iter", 
		revision: 1};
	public diff3live = {content: "# Concipit iter", 
		revision: 2};
	public diff3patch = {content: "# Concipit iter", 
		revision: 3}; 

	public output: any;
	public _merged (txt: string){
		this.output = txt;
	}
}

///////////////////////////////////////////////////////////
describe("Diff3", () => {

    let comp:TestHostComponent;
    let fixture:ComponentFixture<TestHostComponent>;
    let diff3:Diff3Component;
    let diffElement:DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [    RealMarkModule.forRoot({flavor: 'github', headerLinks: true})],
            declarations: [TestHostComponent] // declare the test component
        });

        fixture = TestBed.createComponent(TestHostComponent);
        comp = fixture.componentInstance; // TestHostComponent test instance

        diffElement = fixture.debugElement.query(By.css("realmark-diff3"));
        diff3 = diffElement.componentInstance;
    });

    it("should be created with default values", done => {
        expect(comp).toBeTruthy();
        expect(diff3).toBeTruthy();
        expect(diff3.merged).toBeDefined();

        fixture.detectChanges();
        diff3.merged.subscribe((out:string) =>{
           expect(out).toBe('# Concipit iter');
           done();
        });       
    });
    it("update <textarea> with new content", async((done:any) => {
        fixture.whenStable().then(() => {
            let input = fixture.debugElement.query(By.css('#editor'));
            let el = input.nativeElement;

            expect(el.value).toBe('');

            el.value = '# Concipit new content';
            el.dispatchEvent(new Event('input'));

            diff3.merged.subscribe((out:string) =>{
               expect(out).toBe('# Concipit new content');
               done();
            });  
        });
    }));

    it("3 way merge - no conflict ", (done:any) => {
        comp.diff3original.content = '# Concipit old';
        comp.diff3live.content = '# Concipit new';
        comp.diff3patch.content = '# Concipit new';
        fixture.detectChanges();

        diff3.merged.subscribe((out:string) =>{
           expect(out).toBe('# Concipit new');
           done();
        });  
    });

    it("3 way merge - conflict ", (done:any) => {
        comp.diff3original.content = '# Concipit 1';
        comp.diff3live.content = '# Concipit 2';
        comp.diff3patch.content = '# Concipit 3';
        fixture.detectChanges();

        diff3.merged.subscribe((out:string) =>{
           expect(out).toBe('|>>>>>>>>>>> PATCH: 3\n# Concipit 3\n===========\n# Concipit 2\n<<<<<<<<<<<< LIVE: 2');
           done();
        });  
    });

}); 