import { Injectable, ElementRef } from "@angular/core";

export enum Theme {
	Light,
	Dark,
}

@Injectable({
	providedIn: "root",
})
export class ThemeService {
	private _isInit = false;
	private _currTheme = Theme.Light;
	private _themedElements: any[] = [];

	set(t: Theme) {
		if (this._currTheme === t && this._isInit) {
			return;
		}
		this._currTheme = t;
		this._isInit = true;

		console.log("set theme" + t);
		this._themedElements.forEach((e) =>
			e.nativeElement.setAttribute(
				"mode",
				t == Theme.Light ? "light" : "dark"
			)
		);
	}

	registerThemedElement(e: ElementRef) {
		this._themedElements.push(e);
	}

	constructor() {}
}
