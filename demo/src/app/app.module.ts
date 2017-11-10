import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { HomeComponent } from './home.component';
import { PreviewerComponent } from './previewer.component';
import { DiffComponent } from './diff.component';
import { Diff3Component } from './diff3.component';

import {RealMarkModule} from "ng-realmark";

const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'previewer', component: PreviewerComponent},
  { path: 'diff', component: DiffComponent},
  { path: 'diff3', component: Diff3Component}
];

@NgModule({ 
  declarations: [
    AppComponent,
    HomeComponent,
    PreviewerComponent,
    DiffComponent,
    Diff3Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    RealMarkModule.forRoot({flavor: 'github', headerLinks: true}),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
