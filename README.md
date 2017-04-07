# NG-RealMark
Real-time Markdown module for Angular.io. Code highlighting is provided by [Prismjs](http://prismjs.com/) and [ShowDown](https://github.com/showdownjs/showdown).

> Live example [here](https://liammann.github.io/ng-realmark/)

[![dependencies Status](https://david-dm.org/liammann/ng-realmark/status.svg)](https://david-dm.org/liammann/ng-realmark)
[![devDependencies Status](https://david-dm.org/liammann/ng-realmark/dev-status.svg)](https://david-dm.org/liammann/ng-realmark?type=dev)



## Install (Angular CLI project) 
Step 1: Add module to project through npm `npm install ng-realmark --save`

Step 2: Reference in main NgModule
```
import {RealMarkModule} from "ng-realmark/ng-realmark";
 
@NgModule({
  imports: [ …
    RealMarkModule …
	]…
```
Step 3: Add stylesheet to `angular.cli`

## Usage 
### Component 1 - Previewer
```
<realmark-previewer [content]="markdownContentVar" > </realmark-previewer>
```
Automatic code block wrapping can be achieve be adding the `[codeBlock]=“‘js’”` attribute. E.g. 
```
<realmark-previewer [content]="codeContentVar" [codeBlock]="'js'" > </realmark-previewer>
```


### Component 2 - Diff
```
<realmark-diff [content]="MarkDownNewContent" [original]="MarkDownOriginalContent">
	Title to be displayed
</realmark-diff>
```
Automatic code block wrapping can be achieve be adding the `[codeBlock]=“‘js’”` attribute. E.g. 
```
<realmark-diff [content]="CodeNewContent" [original]="CodeOriginalContent" [codeBlock]="'js'" >
	Title to be displayed
</realmark-diff>
```

## Prerequisites

Please install Node.js and npm if they are not already installed on your computer.

> Verify that you are running at least node v6.x.x and npm 3.x.x by running node -v and npm -v in a terminal / console window. Older versions may produce errors.
