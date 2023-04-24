import { Injectable, ElementRef } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class AnimateService {
	FADE_DURATION = 300;

	_yCurr = 0;
	_yPrev = 0;
	private _fadeIn = new Map<ElementRef, any>();
	private _fadeOut = new Map<ElementRef, any>();

	setScrollPos(yCurr: number, yPrev: number) {
		this._yCurr = yCurr;
		this._yPrev = yPrev;
	}

	posLinearFn(threshold: number, duration = this.FADE_DURATION) {
		const v = (this._yCurr - threshold) / duration;
		if (v < 0) {
			return 0;
		} else if (v > 1) {
			return 1;
		}
		return v;
	}

	negLinearFn(threshold: number, duration = this.FADE_DURATION) {
		return 1 - this.posLinearFn(threshold, duration);
	}

	setAt(elem: ElementRef, t: number, beforeFn: any, afterFn: any) {
		if (this._yCurr >= t && this._yPrev < t) {
			afterFn(elem.nativeElement);
		} else if (this._yCurr < t && this._yPrev >= t) {
			beforeFn(elem.nativeElement);
		}
	}

	fade(
		elem: ElementRef,
		isActive: boolean,
		t: number,
		d: number,
		fadeFn: any
	) {
		const set = () => {
			elem.nativeElement.style.opacity = fadeFn(t, d);
		};

		if (this._yCurr >= t && this._yCurr <= t + d) {
			/**
			 *yCurr is within anim range
			 */
			set();
			return true;
		} else if (this._yCurr < t) {
			/**
			 * yCurr is above anim range
			 * set to final value and stop animation
			 */
			if (isActive || this._yPrev > t + d) {
				set();
				return false;
			}
		} else if (this._yCurr > t + d && isActive) {
			/**
			 * yCurr is below anim range
			 * set to final value and stop animation
			 */
			if (isActive || this._yPrev < t) {
				set();
				return false;
			}
		}
		return isActive;
	}

	fadeIn(elem: ElementRef, t: number, d = this.FADE_DURATION) {
		let isActive = this._fadeIn.get(elem);
		isActive = this.fade(elem, isActive, t, d, (t: number, d: number) => {
			return this.posLinearFn(t, d);
		});
		this._fadeIn.set(elem, isActive);
	}

	fadeOut(elem: ElementRef, t: number, d = this.FADE_DURATION) {
		let isActive = this._fadeOut.get(elem);
		isActive = this.fade(elem, isActive, t, d, (t: number, d: number) => {
			return this.negLinearFn(t, d);
		});
		this._fadeOut.set(elem, isActive);
	}

	constructor() {}
}
