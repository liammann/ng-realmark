import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders, NgModule,
  Optional, SkipSelf }       from '@angular/core';


import {RealMarkDirective} from './src/directive/realmark.directive';
import {RealMarkService} from './src/service/realmark.service';

import {PreviewerComponent} from './src/component/previewer.component';
import {DiffComponent} from './src/component/diff.component';


export {RealMarkService} from './src/service/realmark.service';
export {RealMarkDirective}   from './src/directive/realmark.directive';

export {PreviewerComponent} from './src/component/previewer.component';
export {DiffComponent} from './src/component/diff.component';

import {ShowdownConfig} from './src/config';


@NgModule({
  imports: [CommonModule],
  declarations: [RealMarkDirective, PreviewerComponent, DiffComponent],
  exports: [RealMarkDirective, PreviewerComponent, DiffComponent],
  providers: [RealMarkService]
})
export class RealMarkModule {
  constructor (@Optional() @SkipSelf() parentModule: RealMarkModule) {
    if (parentModule) {
      throw new Error(
        'RealMarkModule is already loaded. Import it in the AppModule only');
    }
  }
	static forRoot(config: ShowdownConfig): ModuleWithProviders {
    return {
      ngModule: RealMarkModule,
      providers: [
        {provide: ShowdownConfig, useValue: config }
      ]
    };
  }
}