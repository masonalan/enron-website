import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TweetsComponent } from "./tweets/tweets.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { LandingComponent } from "./landing/landing.component";
import { MenuComponent } from "./menu/menu.component";
import { CareersComponent } from "./careers/careers.component";
import { ShopComponent } from "./shop/shop.component";
import { FooterComponent } from "./footer/footer.component";
import { ApplyComponent } from "./apply/apply.component";

@NgModule({
	declarations: [
		AppComponent,
		TweetsComponent,
		ToolbarComponent,
		LandingComponent,
		MenuComponent,
		CareersComponent,
		ShopComponent,
		FooterComponent,
		ApplyComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		RouterModule.forRoot([
			{ path: "", component: LandingComponent },
			{ path: "careers", component: CareersComponent },
			{ path: "shop", component: ShopComponent },
			{ path: "apply", component: ApplyComponent },
		]),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
