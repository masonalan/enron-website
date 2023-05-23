import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TweetsComponent } from "./tweets/tweets.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { LandingComponent } from "./landing/landing.component";
import { MenuComponent } from "./menu/menu.component";

@NgModule({
	declarations: [
		AppComponent,
		TweetsComponent,
		ToolbarComponent,
		LandingComponent,
		MenuComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		RouterModule.forRoot([
			{ path: "", component: LandingComponent },
			{ path: "shop", component: ToolbarComponent },
		]),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
