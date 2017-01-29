import { OnInit, ElementRef } from '@angular/core';
import { RealMarkService } from '../service/realmark.service';
export declare class RealMarkDirective implements OnInit {
    private elRef;
    private realMarkService;
    private ele;
    markdowninput: any;
    code: any;
    previousHtml: string;
    constructor(elRef: ElementRef, realMarkService: RealMarkService);
    ngOnInit(): void;
    ngDoCheck(): void;
}
