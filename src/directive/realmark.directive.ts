import { Directive, Input,  OnInit, ElementRef, Injectable} from '@angular/core';
import { RealMarkService } from '../service/realmark.service';

@Directive({
  selector: '[RealMark]',

})
export class RealMarkDirective implements OnInit {
  private ele: any;
  @Input() markdowninput: any; 
  @Input() code: any; 
  previousHtml: string;

  constructor(private elRef: ElementRef, private realMarkService: RealMarkService) {
    // reference to the DOM element
    this.ele = this.elRef.nativeElement;
  }

  ngOnInit () {
      let inputMarkdown = this.markdowninput;
      if(this.code){
        inputMarkdown = "```"+this.code+"\n"+inputMarkdown+"\n```";
      }
      this.ele.innerHTML = this.realMarkService.fromInput(inputMarkdown);
      this.previousHtml = this.markdowninput;
  }

  ngDoCheck() {
    if(!(this.markdowninput === this.previousHtml)) {
      let inputMarkdown = this.markdowninput;
      if(this.code){
        inputMarkdown = "```"+this.code+"\n"+inputMarkdown+"\n```";
      }
      this.ele.innerHTML = this.realMarkService.fromInput(inputMarkdown);
      this.previousHtml = this.markdowninput;
    }
  }
}


