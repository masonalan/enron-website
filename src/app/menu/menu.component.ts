import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";

import { ThemeService } from "../theme.service";

@Component({
	selector: "app-menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements AfterViewInit {
	@ViewChild("menu") menu!: ElementRef;
	@ViewChild("menuContainer") menuContainer!: ElementRef;

	ngAfterViewInit() {
		this.theme.registerThemedElement(this.menu);
	}

	toggle(showing: boolean) {
		this.menu.nativeElement.style.top = showing
			? 0
			: `${-window.innerHeight}px`;
		this.menuContainer.nativeElement.style.opacity = showing ? 1 : 0;
	}

	toggleMode(mode: string) {
		this.menu.nativeElement.setAttribute("mode", mode);
	}

	constructor(private theme: ThemeService) {}
}
