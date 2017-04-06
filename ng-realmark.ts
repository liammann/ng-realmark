import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';


import {RealMarkDirective} from './src/directive/realmark.directive';
import {RealMarkService} from './src/service/realmark.service';

import {PreviewerComponent} from './src/component/previewer.component';
import {DiffComponent} from './src/component/diff.component';


export {RealMarkService} from './src/service/realmark.service';
export {RealMarkDirective}   from './src/directive/realmark.directive';

export {PreviewerComponent} from './src/component/previewer.component';
export {DiffComponent} from './src/component/diff.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RealMarkDirective, PreviewerComponent, DiffComponent],
  exports: [RealMarkDirective, PreviewerComponent, DiffComponent],
  providers: [RealMarkService]
})
export class RealMarkModule {}