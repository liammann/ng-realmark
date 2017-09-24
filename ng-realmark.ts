import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders, NgModule,
  Optional, SkipSelf, Inject, InjectionToken }       from '@angular/core';


import {RealMarkDirective} from './src/directive/realmark.directive';
import {RealMarkService} from './src/service/realmark.service';

import {PreviewerComponent} from './src/component/previewer.component';
import {DiffComponent} from './src/component/diff.component';


export {RealMarkService} from './src/service/realmark.service';
export {RealMarkDirective}   from './src/directive/realmark.directive';

export {PreviewerComponent} from './src/component/previewer.component';
export {DiffComponent} from './src/component/diff.component';

import {ShowdownConfig} from './src/config';



export const REALMARKMODULE_FORROOT_GUARD = new InjectionToken('REALMARKMODULE_FORROOT_GUARD');
export function provideForRootGuard(realMarkModule: RealMarkModule): any {
  if (realMarkModule) {
    throw new Error(
      `RealMarkModule.forRoot() called twice. Lazy loaded modules should use RealMarkModule.forChild() instead.`);
  }

  return 'guarded';
}


@NgModule({
  imports: [CommonModule],
  declarations: [RealMarkDirective, PreviewerComponent, DiffComponent],
  exports: [RealMarkDirective, PreviewerComponent, DiffComponent],
  providers: [RealMarkService]
})
export class RealMarkModule {
  constructor(@Optional() @Inject(REALMARKMODULE_FORROOT_GUARD) guard: any) {}


	static forRoot(config: ShowdownConfig): ModuleWithProviders {
    return {
      ngModule: RealMarkModule,
      providers: [
        {provide: ShowdownConfig, useValue: config }
      ]
    };
  }
 static forChild(): ModuleWithProviders {
    return {
      ngModule: RealMarkModule,
      providers: []
    };
  }
}