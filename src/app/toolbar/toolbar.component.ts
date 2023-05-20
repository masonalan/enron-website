import { Component, ViewChild, ElementRef, Renderer2 } from "@angular/core";

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

	_showingMenu = false;
	_lineOpacity = 0;

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
				this.menu.toggleMode("dark");
			},
			(e: any) => {
				e.setAttribute("mode", "light");
				this.menu.toggleMode("light");
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
		this._showingMenu = !this._showingMenu;

		/**
		 * Disable scrolling when menu is showing
		 */
		if (this._showingMenu) {
			this.renderer.addClass(document.body, "no-scroll");

			/**
			 * Save the line opacity so we can restore it after menu is closed
			 */
			this._lineOpacity = this.line.nativeElement.style.opacity;
			this.line.nativeElement.style.transition = "opacity 0.25s ease-in";
			this.line.nativeElement.style.opacity = 1;
			this.toolbar.nativeElement.style.background = "black";
			this.renderer.addClass(this.toolbar.nativeElement, "showing-menu");
		} else {
			this.renderer.removeClass(document.body, "no-scroll");
			this.line.nativeElement.style.opacity = this._lineOpacity;
			this.line.nativeElement.style.transition = "";
			this.toolbar.nativeElement.style.background = "transparent";
			this.renderer.removeClass(
				this.toolbar.nativeElement,
				"showing-menu"
			);
		}

		this.menu.toggle(this._showingMenu);
	}

	constructor(private animate: AnimateService, private renderer: Renderer2) {}
}
