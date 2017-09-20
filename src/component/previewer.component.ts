import { Component, Input, Output, Injectable,  OnInit, ElementRef, EventEmitter} from '@angular/core';
import { RealMarkService } from '../service/realmark.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'realmark-previewer',
  template: '<div [innerHTML]="outputHTML"></div>',
  styles: [],
})
export class PreviewerComponent {
  private ele: any;
  @Input() content: any; 
  @Input() codeBlock: string; 
  previousHtml: string;
  outputHTML: any;
  @Output() toc = new EventEmitter();

  constructor(private realMarkService: RealMarkService, private sanitizer: DomSanitizer) {
  }
	ngOnInit () {
	  this.updateDom(this.content);
	}

  ngDoCheck() {
    if(!(this.content === this.previousHtml)) {
      this.updateDom(this.content);
    }
  }
  updateDom(innerHTML: string){
    let inputMarkdown = innerHTML;
   	if(this.codeBlock){
      inputMarkdown = "```"+this.codeBlock+"\n"+inputMarkdown+"\n```";
    }

    this.outputHTML =  this.sanitizer.bypassSecurityTrustHtml(this.realMarkService.fromInput(inputMarkdown));
    this.toc.emit(this.realMarkService.getTableOfContents());
    this.previousHtml = this.content;
  }
}