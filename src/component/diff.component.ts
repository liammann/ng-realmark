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

  constructor( private realMarkService: RealMarkService) {}

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
    this.realMarkService.compareMarkdown(this.content, this.original, this.showDeleted, this.showRaw, this.codeBlock).then(resp => this.updateDom(resp));
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
    this.realMarkService.compareMarkdown(this.content, this.original, this.showDeleted, this.showRaw, this.codeBlock).then(resp => this.updateDom(resp));
  }

  /**
   * set element to update and run compareMarkdown().  
   */
	ngOnInit () {
    this.realMarkService.compareMarkdown(this.content, this.original, this.showDeleted,this.showRaw, this.codeBlock).then(resp => this.updateDom(resp));
	}

  /**
   * set element to update and run compareMarkdown().  
   */
  ngDoCheck() {
    if(this.content !== this.previousContent){
      this.realMarkService.compareMarkdown(this.content, this.original, this.showDeleted, this.showRaw, this.codeBlock).then(resp => this.updateDom(resp));
    }
  }

  updateDom(innerHTML: string){
    this.output = innerHTML;
    this.previousContent = this.content;
  }
}