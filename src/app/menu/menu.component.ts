import { Component, ViewChild, ElementRef } from "@angular/core";

@Component({
	selector: "app-menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.scss"],
})
export class MenuComponent {
	_showing = false;

	@ViewChild("menu") menu!: ElementRef;

	toggle() {
		this.menu.nativeElement.style.left = this._showing
			? `${window.innerWidth}px`
			: 0;
		this._showing = !this._showing;
	}
}
