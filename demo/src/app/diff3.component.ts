import { Component } from '@angular/core';

@Component({
  template: `
<section class="overview">
	<h1>Diff3</h1>
	<p>Features include;</p>
	<ul>
		<li>Three way merge</li>
		<li>Realtime additions and deletions diff against each version</li>
		<li>Supports markdown previews</li>
	</ul>
</section>

<section class="example">
	<h2>Example 1 - Diff3</h2>

	<div class="container">
		<realmark-diff3  [patch]="diff3patch" [original]="diff3original" [live]="diff3live" (merged)="_merged($event)">Input Name</realmark-diff3>
	</div>

	<div class="code">
		<h3>Code</h3>
		<realmark-previewer codeBlock="html" content='<realmark-diff3  [patch]="diff3patch" [original]="diff3original" [live]="diff3live" (merged)="_merged($event)">Input Name</realmark-diff3>'></realmark-previewer>

		<h3>_merged():</h3>
		<realmark-previewer codeBlock="js" content='_merged (txt: string){\n		this.merged = txt;\n}\n'></realmark-previewer>


		<realmark-previewer codeBlock="json" [content]='merged | json'></realmark-previewer>

		<h3>diff3original:</h3>
		<realmark-previewer codeBlock="json" [content]='diff3original | json'></realmark-previewer>
		<h3>diff3live:</h3>
		<realmark-previewer codeBlock="json" [content]='diff3live | json'></realmark-previewer>
		<h3>diff3patch:</h3>
		<realmark-previewer codeBlock="json" [content]='diff3patch | json'></realmark-previewer>
	</div>
</section>
`,
})
export class Diff3Component {

	diff3original = {content: "# Concipit iter\n\n## Aetas invenio\n\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aeth3ere, resolvit fortibus."+ "# Concipit\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus."
		, revision: 1};
	diff3live = {content: "# Concipit\n\n## Aetas invenio\n\nLorem markdownum: amas, paviunt. ipso. Fro3ndes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit2 fortibus."+ "# Concipit\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus."
		, revision: 2};
	diff3patch = {content: "# iter\n\n## Aetas invenio\n\nLorem markdownum: amas, paviunt. ipso. Fro2ndes cum velamina conscia traxere? Diesque nec pectora aether3e, resolvit fortibus."+ "# Concipit\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus."
		, revision: 3}; 

	merged;
	_merged (txt: string){
		this.merged = txt;
		console.log(this.merged)
	} 


	diff3originalCode = {content: "function getDate1(){\n\t var test = 0;\n}",
		revision: 76432167};
	diff3liveCode = {content: "function getDate2(){\n\t var test = 0;\n}",
		revision: 21004532};
	diff3inputCode = {content: "function getDate3(){\n\t var test = 0;\n}",
		revision: 98672167};

	merged2;
	_merged2 (txt: string){
		this.merged2 = txt;
		console.log(this.merged2)
	} 

}
