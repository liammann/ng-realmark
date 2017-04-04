export * from './src/service/realmark.service';
export *  from './src/directive/realmark.directive';

export * from './src/component/previewer.component';
export * from './src/component/diff.component';



import {RealMarkDirective} from './src/directive/realmark.directive';
import {RealMarkService} from './src/service/realmark.service';

import {PreviewerComponent} from './src/component/previewer.component';
import {DiffComponent} from './src/component/diff.component';

import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';



@NgModule({
    imports: [CommonModule],
    declarations: [RealMarkDirective, PreviewerComponent, DiffComponent],
    exports: [RealMarkDirective, PreviewerComponent, DiffComponent],
    providers: [RealMarkService]
})
export class RealMarkModule {}