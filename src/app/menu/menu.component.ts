import { Component, ViewChild, ElementRef } from "@angular/core";

@Component({
	selector: "app-menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.scss"],
})
export class MenuComponent {
	@ViewChild("menu") menu!: ElementRef;
	@ViewChild("menuContainer") menuContainer!: ElementRef;

	toggle(showing: boolean) {
		this.menu.nativeElement.style.top = showing
			? 0
			: `${-window.innerHeight}px`;
		this.menuContainer.nativeElement.style.opacity = showing ? 1 : 0;
		// this.menuContainer.nativeElement.style.transform = `scale(${
		// 	showing ? 1 : 0.5
		// })`;
	}

	toggleMode(mode: string) {
		this.menu.nativeElement.setAttribute("mode", mode);
	}
}
