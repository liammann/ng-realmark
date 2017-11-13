import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf, Inject, InjectionToken }       from '@angular/core';

import { RealMarkDirective } from './directive/realmark.directive';
import { RealMarkService } from './service/realmark.service';

import { PreviewerComponent } from './component/previewer.component';
import { PreviewerStaticComponent } from './component/previewer-static.component';
import { DiffComponent } from './component/diff.component';
import { Diff3Component } from './component/diff3.component';


export { RealMarkService } from './service/realmark.service';
export { RealMarkDirective }   from './directive/realmark.directive';

export { PreviewerComponent } from './component/previewer.component';
export { PreviewerStaticComponent } from './component/previewer-static.component';
export { DiffComponent } from './component/diff.component';
export { Diff3Component } from './component/diff3.component';

import { ShowdownConfig } from './config';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



export const REALMARKMODULE_FORROOT_GUARD = new InjectionToken('REALMARKMODULE_FORROOT_GUARD');
export function provideForRootGuard(realMarkModule: RealMarkModule): any {
  if (realMarkModule) {
    throw new Error(
      `RealMarkModule.forRoot() called twice. Lazy loaded modules should use RealMarkModule.forChild() instead.`);
  }

  return 'guarded';
}


@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [RealMarkDirective, PreviewerComponent, PreviewerStaticComponent, DiffComponent, Diff3Component],
  exports: [RealMarkDirective, PreviewerComponent, PreviewerStaticComponent, DiffComponent, Diff3Component],
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