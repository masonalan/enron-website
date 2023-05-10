import { Injectable, ElementRef } from "@angular/core";

export type AnimationContext = {
	yCurr: number;
	yPrev: number;
	initAnims: boolean;
};

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

	private _fadeIn = new Map<ElementRef, AnimationState>();
	private _fadeOut = new Map<ElementRef, AnimationState>();

	private _context!: AnimationContext;

	setContext(context: AnimationContext) {
		this._context = context;
	}

	posLinearFn(threshold: number, duration = this.FADE_DURATION) {
		const v = (this._context.yCurr - threshold) / duration;
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
		if (
			this._context.yCurr >= t &&
			(this._context.yPrev < t || this._context.initAnims)
		) {
			afterFn(elem.nativeElement);
		} else if (
			this._context.yCurr < t &&
			(this._context.yPrev >= t || this._context.initAnims)
		) {
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
			console.log(elem);
			console.log(fadeFn(t, d));
		};

		if (this._context.yCurr >= t && this._context.yCurr <= t + d) {
			/**
			 *yCurr is within anim range
			 */
			set();
			return AnimationState.Active;
		} else if (this._context.yCurr < t) {
			/**
			 * yCurr is above anim range
			 * set to final value and stop animation
			 */
			if (
				state === AnimationState.Active ||
				this._context.yPrev > t + d
			) {
				set();
			}
			return AnimationState.Pre;
		} else {
			/**
			 * yCurr is below anim range
			 * set to final value and stop animation
			 */
			if (state === AnimationState.Active || this._context.yPrev < t) {
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
			console.log("p:" + this.negLinearFn(t, d));
			return this.negLinearFn(t, d);
		});
		this._fadeOut.set(elem, state!);
	}

	constructor() {}
}
