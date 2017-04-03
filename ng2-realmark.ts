export * from './src/service/realmark.service';

import {RealMarkDirective} from './src/directive/realmark.directive';
import {RealMarkService} from './src/service/realmark.service';

import {PreviewerComponent} from './src/component/previewer.component';
import {DiffComponent} from './src/component/diff.component';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ModuleWithProviders} from '@angular/core';



@NgModule({
    imports: [BrowserModule],
    declarations: [RealMarkDirective, PreviewerComponent, DiffComponent],
    exports: [RealMarkDirective, PreviewerComponent, DiffComponent],
    providers: [RealMarkService]
})
export class RealMarkModule {
  /**
   * Use this method in your root module to provide
   * @param {databaseData} config
   * @returns {ModuleWithProviders}
   */
  static forRoot(databaseData: any): ModuleWithProviders {
    return {
      ngModule: RealMarkModule,
      providers: [
        {
          provide: RealMarkService,
          useFactory: () => {
            const service = new RealMarkService();
            service.addDatabaseData(databaseData)
            return service;
          }
        }
      ]
    };
  }
 }