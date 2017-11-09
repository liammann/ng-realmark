import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import {RealMarkModule} from "ng-realmark";


@NgModule({ 
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RealMarkModule.forRoot({flavor: 'github', headerLinks: true}),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
