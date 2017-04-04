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
    <div #contentWrapper></div>
  `

})
export class DiffComponent {
  private ele: any;
  @Input() content: any; 
  @Input() original: any; 
  @Input() codeBlock: string; 

  showDeleted : boolean = true;
  showRaw : boolean = false;
  showDeletedText:string = "Hide Deleted";
  showRawText:string = "Show Raw";
  previousContent: string;

  @ViewChild('contentWrapper') contentWrapper: ElementRef;

  constructor(private elRef: ElementRef, private realMarkService: RealMarkService) {
    // reference to the DOM element
  }
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
	ngOnInit () {
      this.ele = this.contentWrapper.nativeElement;
      this.realMarkService.compareMarkdown(this.content, this.original, this.showDeleted,this.showRaw, this.codeBlock).then(resp => this.updateDom(resp));
    console.log(this.codeBlock);
	}

  ngDoCheck() {
    if(this.content !== this.previousContent){
        this.realMarkService.compareMarkdown(this.content, this.original, this.showDeleted, this.showRaw, this.codeBlock).then(resp => this.updateDom(resp));
    }
  }
  updateDom(innerHTML: string){
    this.ele.innerHTML = innerHTML;
    this.previousContent = this.content;
  }



}