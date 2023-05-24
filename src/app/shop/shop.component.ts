import { Component, AfterViewInit } from "@angular/core";

import { ThemeService, Theme } from "../theme.service";

@Component({
	selector: "app-shop",
	templateUrl: "./shop.component.html",
	styleUrls: ["./shop.component.scss"],
})
export class ShopComponent implements AfterViewInit {
	ngAfterViewInit() {
		this.theme.set(Theme.Light);
	}
	constructor(private theme: ThemeService) {}
}
