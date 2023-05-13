import { Component, ViewChild, ElementRef } from "@angular/core";

import { MenuComponent } from "../menu/menu.component";

import { AnimateService } from "../animate.service";

@Component({
	selector: "app-toolbar",
	templateUrl: "./toolbar.component.html",
	styleUrls: ["./toolbar.component.scss"],
})
export class ToolbarComponent {
	@ViewChild("toolbar") toolbar!: ElementRef;
	@ViewChild("toolbarBg") toolbarBg!: ElementRef;
	@ViewChild("links") links!: ElementRef;
	@ViewChild("line") line!: ElementRef;
	@ViewChild("menu") menu!: MenuComponent;
	@ViewChild("path") path!: ElementRef;

	handleScroll(curtainHeight: number, ft: number) {
		/**
		 * fade in toolbar
		 */
		this.animate.fadeIn(this.links, ft);
		this.animate.fadeIn(this.line, ft);

		/**
		 * fade in menu bar
		 */
		this.animate.setAt(
			this.toolbar,
			curtainHeight,
			(e: any) => {
				e.setAttribute("mode", "dark");
			},
			(e: any) => {
				e.setAttribute("mode", "light");
			}
		);

		/**
		 * update the bg color of the toolbar
		 */
		this.animate.setAt(
			this.toolbarBg,
			ft,
			(e: any) => {
				e.style.opacity = 0;
			},
			(e: any) => {
				e.style.opacity = 1;
			}
		);
	}

	toggleMenu() {
		this.menu.toggle();
	}

	constructor(private animate: AnimateService) {}
}
