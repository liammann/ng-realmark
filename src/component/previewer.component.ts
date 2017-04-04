import { Component, Input,  OnInit, ElementRef } from '@angular/core';
import { RealMarkService } from '../service/realmark.service';



@Component({
  selector: 'realmark-previewer',
  template: '',
  styles: []
})
export class PreviewerComponent {
  private ele: any;
  @Input() content: any; 
  @Input() codeBlock: string; 
  previousHtml: string;

  constructor(private elRef: ElementRef, private realMarkService: RealMarkService) {
    // reference to the DOM element
    this.ele = this.elRef.nativeElement;
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
    // console.warn("UPDATING DOM", innerHTML);

    this.ele.innerHTML = this.realMarkService.fromInput(inputMarkdown);
    this.previousHtml = this.content;
  }
}