export * from './src/service/realmark.service';

import {RealMarkDirective} from './src/directive/realmark.directive';
import {RealMarkService} from './src/service/realmark.service';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

@NgModule({
    imports: [BrowserModule],
    declarations: [RealMarkDirective],
    exports: [RealMarkDirective],
    providers: [RealMarkService]
})
export class RealMarkModule {}