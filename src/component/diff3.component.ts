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
      <button *ngIf="!codeBlock" (click)="markdownClick()">{{showMarkdownText}}</button>
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
      <realmark-diff [content]="_content" [original]="_compare" [showDeleted]="_showDeleted" [showMarkdown]="_showMarkdown"></realmark-diff>
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

  _compare: string;
  _content: string;

  _showDeleted : boolean = false;
  showDeletedText: string = "Show Deleted";
  _showMarkdown : boolean = false;
  showMarkdownText: string = "Hide Markdown";

  editorControl = new FormControl();

  constructor( private realMarkService: RealMarkService) {}

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
  }
  /**
   * Compare selection update, change this.compare and re-evaluate compateMarkdown.
   */
  changeCompare($event: any){
    let selected = $event.target.selectedOptions[0].value;

    if(selected === "live") {
      this._compare = this.live ?  this.live.content : "";
    } else if(selected === "patch") {
      this._compare = this.patch ?  this.patch.content : "";
    } else {
      this._compare = this.original ?  this.original.content : "";
    }
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
    this._content = mergeMarkdown.content;
    this.editor = mergeMarkdown.content;
    this._compare = this.original ?  this.original.content : "";

    // only update diff table on right after 1 second of no changes
    this.editorControl.valueChanges
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe((newValue) => {
          this._content = newValue;
          this.merged.emit(this._content);

      }, (err: Error) => {
          console.log(err);
      });
  }

}
