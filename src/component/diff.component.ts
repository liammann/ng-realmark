import { Component, Input,ViewChild,  Output,  OnInit, EventEmitter, ElementRef , ViewEncapsulation } from '@angular/core';
import { RealMarkService, ComparedLine } from '../service/realmark.service';
import { Sanitizer, SecurityContext }    from '@angular/core';



@Component({
  selector: 'realmark-diff',
  template: `
    <header>
      <button *ngIf="contentRef.innerHTML.trim()" (click)="deletedClick()">{{showDeletedText}}</button>
      <button *ngIf="!codeBlock  && contentRef.innerHTML.trim()" (click)="markdownClick()">{{showMarkdownText}}</button>
      <p #contentRef><ng-content></ng-content></p>
    </header>
    <table [innerHTML]="output"></table>
  `
})
export class DiffComponent {
  @Input() codeBlock: string;

  _showMarkdown : boolean = true;
  _showDeleted : boolean = false;
  showDeletedText:string = "Hide Deleted";
  showMarkdownText: string = "Show Markdown";

  _content: string = "";
  _original: string = "";

  output: string;

  constructor(private realMarkService: RealMarkService, private sanitizer: Sanitizer) {}

  @Input()
  public set showDeleted(value:boolean) {
    this._showDeleted = value;
    this.updateDiff();
  }

  @Input()
  public set showMarkdown(value:boolean) {
    this._showMarkdown = value;
    this.updateDiff();
  }

  @Input()
  public set content (value:string) {
    this._content = value;
    this.updateDiff();
  }

  @Input()
  public set original (value:string) {
    this._original = value;
    this.updateDiff();
  }

  /**
   * Changes value of showDeleted and re-evaluate compateMarkdown. Also updates button text.
   */
  deletedClick (){
    if(this._showDeleted){
      this._showDeleted = false;
      this.showDeletedText = "Show Deleted";
    }else{
      this._showDeleted = true;
      this.showDeletedText = "Hide Deleted";
    }
    this.updateDiff();
  }

  /**
   * Changes value of showMarkdown and re-evaluate compateMarkdown. Also updates button text.
   */
  markdownClick (){
    if(this._showMarkdown){
      this._showMarkdown = false;
      this.showMarkdownText = "Hide Markdown";
    }else{
      this._showMarkdown = true;
      this.showMarkdownText = "Show Markdown";
    }
    this.updateDiff();
  }

  /**
   * set element to update and run updateDiff().
   */
  ngOnInit () {
    this.updateDiff();
  }

  updateDiff(){
    let html = this.realMarkService.compareMarkdown(this._content, this._original, this._showDeleted, this._showMarkdown, this.codeBlock);

    let builtRows = html.map( (r: ComparedLine) => {

      let num1 = r.originalLine;
      let num2 = r.newLine;
      let sidebarNums = "<td class='diff-num1'>" + num1 + "</td><td class='diff-num2'>" + num2 + "</td>";

      if (!r.text){
        return "<tr class='diff-" + r.type + "'>" + sidebarNums + "<td width='100%'></td></tr>";
      }
      else if (r.format === "text"){  // if line contains markdown which needs to be converted to html
        return "<tr class='diff-" + r.type + "'>" + sidebarNums + "<td width='100%'>"+ this.sanitizer.sanitize( SecurityContext.HTML, this.realMarkService.process( r.text ) ) + "</td></tr>";
      }
      else if(r.format === "code"){  // automatically wrap in codeBlock
        return "<tr class='diff-" + r.type + "'>" + sidebarNums + "<td width='100%'>"+ this.sanitizer.sanitize( SecurityContext.HTML, this.realMarkService.process( "```"+this.codeBlock+"\n"+r.text+"\n```" ) ) + "</td></tr>";
      }
      return "<tr class='diff-" + r.type + "'>" + sidebarNums + "<td width='100%'> "+ this.sanitizer.sanitize( SecurityContext.HTML, r.text ) + "</td></tr>";
    }).join("\n");

    this.output = builtRows ? builtRows : "";
  }
}
