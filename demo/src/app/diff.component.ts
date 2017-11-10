import { Component } from '@angular/core';

@Component({
  template: `
<section class="overview">
	<h1>Diff</h1>
	<p>Features include;</p>
	<ul>
		<li>Realtime additions and deletions</li>
		<li>supports markdown previews</li>
	</ul>
</section>

<section class="example">
	<h2>Example 1 - Standard Diff</h2>

	<div class="container">
		<realmark-diff [content]="input" [original]="original">Input Name</realmark-diff>

		<div class="content">
			<label for="input">New Content (updates in real-time)</label>
			<textarea name="input" [(ngModel)]="input" id="input" placeholder="input"></textarea>

			<label for="original">Original</label>	
			<textarea name="input" [(ngModel)]="original" id="original" placeholder="input"></textarea>
		</div>
	</div>

	<div class="code">
		<h3>Code</h3>
		<realmark-previewer codeBlock="html" content='<realmark-diff [content]="input" [original]="original">Input Name</realmark-diff>	'></realmark-previewer>
	</div>
</section>
<section class="example">
	<h2>Example 2 - Code Diff</h2>

	<div class="container">
		<realmark-diff [content]="code2" [original]="code1" codeBlock="js">CodeBlock Diff.js</realmark-diff>

		<div class="content">
			<label for="code2">New Content (updates in real-time)</label>
			<textarea name="input" [(ngModel)]="code2" id="code2" placeholder="input"></textarea>

			<label for="code1">Original</label>	
			<textarea name="input" [(ngModel)]="code1" id="code1" placeholder="input"></textarea>
		</div>
	</div>
	<div class="code">
		<h3>Code</h3>
		<realmark-previewer codeBlock="html" content='<realmark-diff [content]="code2" [original]="code1" codeBlock="js">CodeBlock Diff.js</realmark-diff>'></realmark-previewer>
	</div>
</section>
`,
})
export class DiffComponent {

	original = "# Concipit iter\n\n## Aetas invenio\n\nLorem markdownum: amas, paviunt. Evolvit ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus.";
	input = "# Concipit iter\n\n## New Aetas invenio\n\nLorem markdownum: amas, paviunt. Evolvit ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus.";
	markdown = "# Concipit iter\n\n## Aetas invenio\n\nLorem markdownum: amas, paviunt. Evolvit ipso.";
	code = "function getDate(){\n\t var test = 0;\n}";
	code1 = "function getDate(){\n\t var test = 0;\n}";
	code2 = "function getDate(){\n\t var test = 20;\n\treturn test;\n}";





}
