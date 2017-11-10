import { Component } from '@angular/core';

@Component({
  template: `

<article>
<h2>Install (Angular CLI project)</h2>
<h3>Step 1: Add module to project through npm</h3>
<realmark-previewer content="npm install ng-realmark --save" codeBlock="bash"></realmark-previewer>

<h3>Step 2: Reference in main NgModule</h3>
<realmark-previewer content='import { RealMarkModule } from "ng-realmark/ng-realmark";
 
@NgModule({
  imports: [ 
  	…
    RealMarkModule.forRoot({
    	flavor: "github",  // or original or vanilla
    	headerLinks: true
    }),
    …
  ]…' codeBlock="js"></realmark-previewer>

<h3>Step 3: Add stylesheet to <code class=" language-bash">angular.cli</code></h3>
<realmark-previewer content='
"styles": [
  ...
	"../node_modules/ng-realmark/realmark.css"
  ...
],' codeBlock="js"></realmark-previewer>
</article>

`,
})
export class HomeComponent {



}
