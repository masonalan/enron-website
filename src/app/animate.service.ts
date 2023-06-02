import { Injectable, ElementRef } from "@angular/core";
export enum AnimationState {
	Pre,
	Active,
	Post,
}

@Injectable({
	providedIn: "root",
})
export class AnimateService {
	FADE_DURATION = 300;

	private _isInit = false;
	private _width = 0;
	private _yCurr = 0;
	private _yPrev = 0;

	private _callbacks: any[] = [];

	private _fadeIn = new Map<ElementRef, AnimationState>();
	private _fadeOut = new Map<ElementRef, AnimationState>();

	notifyResize(width: number) {
		this._width = width;
	}

	notifyScroll(yCurr: number) {
		this._yPrev = this._yCurr;
		this._yCurr = yCurr;

		this._callbacks.forEach((fn) => fn());

		this._isInit = true;
	}

	registerScrollCallback(callback: any) {
		this._callbacks.push(callback);
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
		if (this._yCurr >= t && (this._yPrev < t || !this._isInit)) {
			afterFn(elem.nativeElement);
		} else if (this._yCurr < t && (this._yPrev >= t || !this._isInit)) {
			beforeFn(elem.nativeElement);
		}
	}

	fade(
		elem: ElementRef,
		state: AnimationState | undefined,
		t: number,
		d: number,
		fadeFn: any
	) {
		const set = () => {
			elem.nativeElement.style.opacity = fadeFn(t, d);
		};

		if (!this._isInit) {
			set();
		}

		if (this._yCurr >= t && this._yCurr <= t + d) {
			/**
			 *yCurr is within anim range
			 */
			set();
			return AnimationState.Active;
		} else if (this._yCurr < t) {
			/**
			 * yCurr is above anim range
			 * set to final value and stop animation
			 */
			if (state === AnimationState.Active || this._yPrev > t + d) {
				set();
			}
			return AnimationState.Pre;
		} else {
			/**
			 * yCurr is below anim range
			 * set to final value and stop animation
			 */
			if (state === AnimationState.Active || this._yPrev < t) {
				set();
			}
			return AnimationState.Post;
		}
		return state;
	}

	fadeIn(
		elem: ElementRef,
		t: number,
		after: any = () => {},
		d = this.FADE_DURATION
	) {
		let state = this._fadeIn.get(elem);
		state = this.fade(elem, state, t, d, (t: number, d: number) => {
			return this.posLinearFn(t, d);
		});
		this._fadeIn.set(elem, state!);
	}

	fadeOut(elem: ElementRef, t: number, d = this.FADE_DURATION) {
		let state = this._fadeOut.get(elem);
		state = this.fade(elem, state, t, d, (t: number, d: number) => {
			return this.negLinearFn(t, d);
		});
		this._fadeOut.set(elem, state!);
	}

	constructor() {}
}
