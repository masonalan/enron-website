import { Component, AfterViewInit } from "@angular/core";

import { ThemeService, Theme } from "../theme.service";

@Component({
	selector: "app-careers",
	templateUrl: "./careers.component.html",
	styleUrls: ["./careers.component.scss"],
})
export class CareersComponent implements AfterViewInit {
	ngAfterViewInit() {
		this.theme.set(Theme.Light);
	}

	constructor(private theme: ThemeService) {}
}
