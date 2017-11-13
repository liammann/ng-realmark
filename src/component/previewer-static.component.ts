import { Component, Input, Output, Injectable,  OnInit, ElementRef, EventEmitter} from '@angular/core';
import { RealMarkService } from '../service/realmark.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'realmark-previewer-static',
  template: '<div [innerHTML]="outputHTML"></div>',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewerStaticComponent {
  @Input() content: any; 
  @Input() codeBlock: string; 
  outputHTML: any;
  @Output() toc = new EventEmitter(true);

  constructor(private realMarkService: RealMarkService, private sanitizer: DomSanitizer) {
  }
	ngOnInit () {
	  this.updateDom(this.content);
	}

  updateDom(innerHTML: string){
    let inputMarkdown = innerHTML;
   	if(this.codeBlock){
      inputMarkdown = "```"+this.codeBlock+"\n"+inputMarkdown+"\n```";
    }

    this.outputHTML =  this.sanitizer.bypassSecurityTrustHtml(this.realMarkService.fromInput(inputMarkdown));
    this.toc.emit(this.realMarkService.getTableOfContents());
  }
}