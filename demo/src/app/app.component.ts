import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

	original = "# Concipit iter\n\n## Aetas invenio\n\nLorem markdownum: amas, paviunt. Evolvit ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus.";
	input = "# Concipit iter\n\n## New Aetas invenio\n\nLorem markdownum: amas, paviunt. Evolvit ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus.";
	markdown = "# Concipit iter\n\n## Aetas invenio\n\nLorem markdownum: amas, paviunt. Evolvit ipso.";
	code = "function getDate(){\n\t var test = 0;\n}";
	code1 = "function getDate(){\n\t var test = 0;\n}";
	code2 = "function getDate(){\n\t var test = 20;\n\treturn test;\n}";



	diff3original = {content: "# Concipit iter\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aeth3ere, resolvit fortibus."+ "# Concipit\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus."+"# Concipit\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus."+ "# Concipit\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus.", 
		revision: 1};
	diff3live = {content: "# Concipit\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Fro3ndes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit2 fortibus."+ "# Concipit\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus."+"# Concipit\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus."+ "# Concipit\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus.", 
		revision: 2};
	diff3patch = {content: "# iter\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Fro2ndes cum velamina conscia traxere? Diesque nec pectora aether3e, resolvit fortibus."+ "# Concipit\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus."+"# Concipit\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus."+ "# Concipit\n\n## Aetas invenio\nhello!1\nLorem markdownum: amas, paviunt. ipso. Frondes cum velamina conscia traxere? Diesque nec pectora aethere, resolvit fortibus.", 
		revision: 3}; 

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
