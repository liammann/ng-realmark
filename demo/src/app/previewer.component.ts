import { Component } from '@angular/core';

@Component({
  template: `

<section class="overview">
	<h1>Previewer</h1>
	<p>Features include;</p>
	<ul>
		<li>Realtime code highlighting</li>
		<li>Automatic table of content based on Markdown headings</li>
	</ul>
</section>

<section class="example">
	<h2>Example 1 - Standard Markdown w/ Table of Contents</h2>
	<div class="container">
		<realmark-previewer (toc)="sidebarHeadings = $event" [content]="markdown"></realmark-previewer>

		<div class="content">
			<textarea name="input" [(ngModel)]="markdown" id="markdown" placeholder="input"></textarea>
			<realmark-previewer codeBlock="js" [content]='sidebarHeadings | json'></realmark-previewer>
		</div>
	</div>

	<div class="code">
		<h3>Code</h3>
		<realmark-previewer codeBlock="html" content='<realmark-previewer [content]="markdown" (toc)="sidebarHeadings = $event" ></realmark-previewer>'></realmark-previewer>
	</div>
</section>


<section class="example">
	<h2>Example 1 - Static Markdown (No realtime updates)</h2>
	<div class="container">
		<realmark-previewer-static [content]="markdown2"></realmark-previewer-static>

		<div class="content">
			<textarea name="input" [(ngModel)]="markdown2" id="markdown2" placeholder="input"></textarea>
		</div>
	</div>

	<div class="code">
		<h3>Code</h3>
		<realmark-previewer codeBlock="html" content='	<realmark-previewer-static [content]="markdown2"></realmark-previewer-static>'></realmark-previewer>
	</div>
</section>

<section class="example">
	<h2>Example 2 - JavaScript Code Block</h2>
	<div class="container">
		<realmark-previewer [content]="code" codeBlock="js"></realmark-previewer>

		<div class="content">
			<textarea name="input" [(ngModel)]="code" id="code" placeholder="input"></textarea>
		</div>
	</div>

	<div class="code">
		<h3>Code</h3>
		<realmark-previewer codeBlock="html" content='<realmark-previewer [content]="code" codeBlock="js"></realmark-previewer>'></realmark-previewer>
	</div>

</section>`,
})
export class PreviewerComponent {
	sidebarHeadings= {};

	markdown = "# Main Heading 1\n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dignissim eu leo in venenatis. Ut fringilla eros sit amet tortor vehicula viverra. Aliquam at est ac arcu aliquet sodales. Donec bibendum sapien eros, sed ultrices arcu interdum quis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nibh ante, ullamcorper sit amet ante a, dictum ultricies dolor. Donec in feugiat metus, id finibus nulla. Praesent arcu lectus, elementum in scelerisque sit amet, auctor quis augue. Integer ut fringilla velit, non feugiat erat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus eu eros sed tortor vestibulum ultricies.\n\nVestibulum tincidunt, odio vitae tempor egestas, tellus eros euismod augue, non aliquam magna mauris sit amet libero. Morbi molestie massa id eros gravida, vitae scelerisque nisi venenatis. Nulla facilisis sollicitudin tincidunt. Sed ornare eu mauris vel viverra. Duis pretium, mi ut aliquet vehicula, orci ex aliquam felis, ut tristique purus orci eget diam. Proin luctus pharetra mauris nec rutrum. mi, nec aliquam felis.\n\n## Sub Heading 2\n\nLorem amas, paviunt. Evolvit amas, paviunt. Evolvit Aliquam pulvinar quam eget est accumsan convallis. Nam feugiat aliquam mi ut dignissim. Pellentesque ac aliquam magna, vel euismod purus. Cras nisi augue, imperdiet quis volutpat commodo, vestibulum eget nibh. Donec sed sollicitudin.\n\n## Sub Heading 2\n\nLorem markdownum: amas, paviunt. Evolvit ipso, markdownum: amas, paviunt. Evolvit ipso, markdownum: amas, paviunt. Evolvit ipso.";
	markdown2 = "# Main Heading 1\n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dignissim eu leo in venenatis. Ut fringilla eros sit amet tortor vehicula viverra. Aliquam at est ac arcu aliquet sodales. Donec bibendum sapien eros, sed ultrices arcu interdum quis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nibh ante, ullamcorper sit amet ante a, dictum ultricies dolor. Donec in feugiat metus, id finibus nulla. Praesent arcu lectus, elementum in scelerisque sit amet, auctor quis augue. Integer ut fringilla velit, non feugiat erat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus eu eros sed tortor vestibulum ultricies.\n\nVestibulum tincidunt, odio vitae tempor egestas, tellus eros euismod augue, non aliquam magna mauris sit amet libero. Morbi molestie massa id eros gravida, vitae scelerisque nisi venenatis. Nulla facilisis sollicitudin tincidunt. Sed ornare eu mauris vel viverra. Duis pretium, mi ut aliquet vehicula, orci ex aliquam felis, ut tristique purus orci eget diam. Proin luctus pharetra mauris nec rutrum. mi, nec aliquam felis.\n\n## Sub Heading 2\n\nLorem amas, paviunt. Evolvit amas, paviunt. Evolvit Aliquam pulvinar quam eget est accumsan convallis. Nam feugiat aliquam mi ut dignissim. Pellentesque ac aliquam magna, vel euismod purus. Cras nisi augue, imperdiet quis volutpat commodo, vestibulum eget nibh. Donec sed sollicitudin.\n\n## Sub Heading 2\n\nLorem markdownum: amas, paviunt. Evolvit ipso, markdownum: amas, paviunt. Evolvit ipso, markdownum: amas, paviunt. Evolvit ipso.";
	code = "function multiply(num1,num2) {\n  var result = num1 * num2;\n  return result;\n}";




}
