import { Component, Input,Injectable,  OnInit, ElementRef} from '@angular/core';
import { RealMarkService } from '../service/realmark.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'realmark-previewer',
  template: '<div [innerHTML]="output"></div>',
  styles: [],
})
export class PreviewerComponent {
  private ele: any;
  @Input() content: any; 
  @Input() codeBlock: string; 
  previousHtml: string;
  output: any;

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

    this.output =  this.sanitizer.bypassSecurityTrustHtml(this.realMarkService.fromInput(inputMarkdown));
    this.previousHtml = this.content;
  }
}