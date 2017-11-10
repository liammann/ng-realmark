import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template:`
<header>
	<div class="wrapper">
	  <h1><a [routerLink]="['/']">NG-RealMark</a></h1>
		<nav>
		<a [routerLink]="['previewer']">Previewer</a>
		<a [routerLink]="['diff']">Diff</a>
		<a [routerLink]="['diff3']">Diff3</a>
		</nav>
	</div>

</header>
<div class="wrapper">
	<router-outlet></router-outlet>
</div>
`
})
export class AppComponent {}
