# ng2-realmark
Markdown module for angular2 with real-time code highlighting provided by prismjs and showdown. 

## Usage
Step 1: Add module to project through npm
`npm install ng2-realmark --save`

Step 2: Reference in main NgModule
```
import {RealMarkModule} from "ng2-realmark/ng2-realmark";

@NgModule({
  imports: [
    BrowserModule,
    RealMarkModule ...
```

Step 3: Add to element w/ automatic code block wrapping ```js 
```
<div RealMark [code]="'js'" [markdowninput]="input.text"></div>
```

Step 4: Add prismjs stylesheet to style.css
`@import url('https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/themes/prism.min.css');`
