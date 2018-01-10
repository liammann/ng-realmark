import { Component, Input,ViewChild,  OnInit, ElementRef , ViewEncapsulation } from '@angular/core';
import { RealMarkService } from '../service/realmark.service';

@Component({
  selector: 'realmark-diff',
  template: `
    <header>
      <button (click)="deletedClick()">{{showDeletedText}}</button>
      <button *ngIf="!codeBlock" (click)="rawClick()">{{showRawText}}</button>
      <p><ng-content></ng-content></p>
    </header>
    <table [innerHTML]="output"></table>
  `
})
export class DiffComponent {
  @Input() content: any; 
  @Input() original: any; 
  @Input() codeBlock: string; 

  showDeleted : boolean = true;
  showRaw : boolean = false;
  showDeletedText:string = "Hide Deleted";
  showRawText:string = "Show Markdown";
  previousContent: string;

  output: string;

  constructor(private realMarkService: RealMarkService) {}

  /**
   * Changes value of showDeleted and re-evaluate compateMarkdown. Also updates button text. 
   */
  deletedClick (){
    if(this.showDeleted){
      this.showDeleted = false;
      this.showDeletedText = "Show Deleted";
    }else{
      this.showDeleted = true;
      this.showDeletedText = "Hide Deleted";
    }
    this.updateDiff();
  }

  /**
   * Changes value of showRaw and re-evaluate compateMarkdown. Also updates button text. 
   */
  rawClick (){
    if(this.showRaw){
      this.showRaw = false;
      this.showRawText = "Show Markdown";
    }else{
      this.showRaw = true;
      this.showRawText = "Hide Markdown";
    }
    this.updateDiff();
  }

  /**
   * set element to update and run updateDiff().  
   */
  ngOnInit () {
    this.updateDiff();
  }

  /**
   * set element to update and run updateDiff().  
   */
  ngDoCheck() {
    if(this.content !== this.previousContent){
      this.updateDiff();
    }
  }

  updateDiff(){
    let html = this.realMarkService.compareMarkdown(this.content, this.original, this.showDeleted, this.showRaw, this.codeBlock)
    this.output = html ? html : "";
    this.previousContent = this.content;
  }
}