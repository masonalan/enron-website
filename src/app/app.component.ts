import { Component, HostListener, AfterViewInit } from "@angular/core";

import { AnimateService } from "./animate.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewInit {
	private _scheduledAnimationFrame = false;

	ngAfterViewInit() {
		this.animate.notifyScroll(window.pageYOffset);
		this.animate.notifyResize(window.innerWidth);
	}

	@HostListener("window:resize", ["$event"])
	onResize(event: Event) {
		this.animate.notifyResize(window.innerWidth);
	}

	@HostListener("window:scroll", ["$event"])
	onScroll(event: Event) {
		if (this._scheduledAnimationFrame) return;

		this._scheduledAnimationFrame = true;

		requestAnimationFrame(() => {
			this.animate.notifyScroll(window.pageYOffset);
			this._scheduledAnimationFrame = false;
		});
	}

	constructor(private animate: AnimateService) {}
}
