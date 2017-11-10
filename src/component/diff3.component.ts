import { Component, Input, Output, EventEmitter, ViewChild,  OnInit, ElementRef , ViewEncapsulation } from '@angular/core';
import { RealMarkService } from '../service/realmark.service';

import {ShowdownConfig, Revision} from '../config';

import {FormControl} from '@angular/forms';
import {Observable}  from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'realmark-diff3',
  template: `

    <header>
      <p><ng-content></ng-content></p>
      <button (click)="deletedClick()">{{showDeletedText}}</button>
      <button *ngIf="!codeBlock" (click)="rawClick()">{{showRawText}}</button>
      <div>Compare: 
        <select (change)="changeCompare($event)">
          <option value="original">Original</option>
          <option value="live">Live</option>
          <option value="patch">Patch</option>
        </select>
      </div>
    </header>
    <div class="diff-content">  

    <textarea name="input" [(ngModel)]="editor" id="editor" [formControl]="editorControl" ></textarea>
    <table [innerHTML]="output"></table>
    </div>
  `
})
export class Diff3Component {
  @Input() patch: Revision; 
  @Input() original: Revision; 
  @Input() live: Revision; 
  
  editor: string;

  @Input() codeBlock: string; 
  @Output() merged: EventEmitter<any> = new EventEmitter();
 
  compare: string;
  previousContent: string;
  output: string;

  showDeleted : boolean = false;
  showDeletedText: string = "Show Deleted";
  showRaw : boolean = true;
  showRawText: string = "Show Markdown";

  editorControl = new FormControl();

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
    this.updateDiff();

  }

  /**
   * Changes value of showDeleted and re-evaluate compateMarkdown. Also updates button text. 
   */
  changeCompare($event: any){
    let selected = $event.target.selectedOptions[0].value;

    if(selected === "live") {
      this.compare = this.live ?  this.live.content : "";
    } else if(selected === "patch") {
      this.compare = this.patch ?  this.patch.content : "";
    } else {
      this.compare = this.original ?  this.original.content : "";
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
   * set element to update and run compareMarkdown().  
   */
	ngOnInit () {
    let mergeMarkdown = this.realMarkService.mergeMarkdown(
      this.patch,
      this.original,
      this.live
    );
    this.editor = mergeMarkdown.content;
    this.compare = this.original ?  this.original.content : "";
    this.updateDiff();

    this.editorControl.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((newValue) => {
          this.editor = newValue;    
          this.updateDiff();
          this.merged.emit(this.editor);

      }, (err: Error) => {
          console.log(err);
      });  
  }

  updateDiff(){
    let html = this.realMarkService.compareMarkdown(this.editor, this.compare, this.showDeleted, this.showRaw, this.codeBlock)
    this.output = html ? html : "";
    this.previousContent = this.editor;
  }
}