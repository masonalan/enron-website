import {
	AfterViewInit,
	Component,
	ElementRef,
	HostListener,
	QueryList,
	ViewChild,
	ViewChildren,
} from "@angular/core";

import { TweetsComponent } from "./tweets/tweets.component";

const TITLE_ANIM_THRESHOLD = 100;
const FADE_DURATION = 300; /* in px */
const TOOLBAR_HEIGHT = 125;
const LOGO_MARGIN = 70;
const PADDING = 30;
const TWEET_ROTATIONS = [20, -20, 4, -20, 20];

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewInit {
	title = "enron-website";

	yCurr = 0;
	yPrev = 0;

	/**
	 * put into json file
	 */

	posLinearFn(threshold: number, duration = FADE_DURATION) {
		const v = (this.yCurr - threshold) / duration;
		if (v < 0) {
			return 0;
		} else if (v > 1) {
			return 1;
		}
		return v;
	}

	negLinearFn(threshold: number, duration = FADE_DURATION) {
		return 1 - this.posLinearFn(threshold, duration);
	}

	setAt(elem: ElementRef, t: number, beforeFn: any, afterFn: any) {
		if (this.yCurr >= t && this.yPrev < t) {
			afterFn(elem.nativeElement);
		} else if (this.yCurr < t && this.yPrev >= t) {
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

		if (this.yCurr >= t && this.yCurr <= t + d) {
			/**
			 *yCurr is within anim range
			 */
			set();
			return true;
		} else if (this.yCurr < t) {
			/**
			 * yCurr is above anim range
			 * set to final value and stop animation
			 */
			if (isActive || this.yPrev > t + d) {
				set();
				return false;
			}
		} else if (this.yCurr > t + d && isActive) {
			/**
			 * yCurr is below anim range
			 * set to final value and stop animation
			 */
			if (isActive || this.yPrev < t) {
				set();
				return false;
			}
		}
		return isActive;
	}

	_fadeIn = new Map();
	fadeIn(elem: ElementRef, t: number, d = FADE_DURATION) {
		let isActive = this._fadeIn.get(elem);
		isActive = this.fade(elem, isActive, t, d, (t: number, d: number) => {
			return this.posLinearFn(t, d);
		});
		this._fadeIn.set(elem, isActive);
	}

	_fadeOut = new Map();
	fadeOut(elem: ElementRef, t: number, d = FADE_DURATION) {
		let isActive = this._fadeOut.get(elem);
		isActive = this.fade(elem, isActive, t, d, (t: number, d: number) => {
			return this.negLinearFn(t, d);
		});
		this._fadeOut.set(elem, isActive);
	}

	@ViewChild("title") enTitle!: ElementRef;
	@ViewChild("subtitle") enSubTitle!: ElementRef;
	@ViewChild("tweetHeader") enBlock2!: ElementRef;
	@ViewChild("logo") logo!: ElementRef;
	@ViewChild("firstquote") enFirstQuote!: ElementRef;
	@ViewChild("toolbar") enToolbar!: ElementRef;
	@ViewChild("links") enLinks!: ElementRef;
	@ViewChild("line") enLine!: ElementRef;
	@ViewChild("titleContainer") titleContainer!: ElementRef;
	@ViewChild("tweets") tweets!: TweetsComponent;

	/*
	 * whether or not there is a scheduled animation frame
	 */
	_saf = false;

	@HostListener("window:scroll", ["$event"])
	onScroll(event: Event) {
		if (this._saf) return;

		this._saf = true;
		requestAnimationFrame(() => {
			this.refresh();
		});
	}

	refresh() {
		/**
		 * update scroll state
		 */
		this.yPrev = this.yCurr;
		this.yCurr = window.pageYOffset;

		/**
		 * fade out title & fade in subtitle
		 */
		this.fadeOut(this.enTitle, 0, 100);
		this.fadeIn(this.enSubTitle, 0);

		/**
		 * fade out logo
		 */
		const logoFt =
			this.titleContainer.nativeElement.offsetTop +
			this.titleContainer.nativeElement.offsetHeight -
			PADDING;
		this.fadeOut(this.logo, logoFt);

		/**
		 * update the bg color of the toolbar
		 */
		this.setAt(
			this.enToolbar,
			logoFt + FADE_DURATION,
			(e: any) => {
				e.style.backgroundColor = "transparent";
			},
			(e: any) => {
				e.style.backgroundColor = "black";
			}
		);

		/**
		 * fade in toolbar
		 */
		this.fadeIn(this.enLinks, logoFt + FADE_DURATION);
		this.fadeIn(this.enLine, logoFt + FADE_DURATION);

		/**
		 * fade out subtitle
		 */
		const subTitleFt =
			logoFt +
			this.logo.nativeElement.offsetHeight -
			window.innerHeight / 2 +
			FADE_DURATION;
		this.fadeOut(this.enSubTitle, subTitleFt);

		/**
		 * fade in tweet header
		 */
		this.fadeIn(this.enBlock2, subTitleFt + FADE_DURATION);

		/**
		 * tweet animations
		 */
		this.tweets.elementRefs.forEach(async (tweet, i) => {
			const ti = this.tweets.index(i);

			/**
			 * dest rotation in degrees
			 *
			 * -20 = left
			 * 3 = center
			 * 20 = right
			 */
			const destRot =
				(ti.col + 1) * 2 - 1 == ti.rowSize
					? 3
					: ti.col + 1 > ti.rowSize / 2
					? 30
					: -70;

			/**
			 * calculate current rotation
			 */
			const thresh = tweet.nativeElement.offsetTop - window.innerHeight;
			const dur = FADE_DURATION * 2.5;
			const currRot =
				destRot +
				(destRot < 0
					? this.posLinearFn(thresh, dur)
					: this.negLinearFn(thresh, dur)) *
					40;

			/**
			 * calculate current scale
			 */
			let scale =
				Math.abs(this.negLinearFn(thresh, dur) * 2) + 1 + ti.row / 2.0;
			scale = scale > 5 ? 5 : scale;

			/**
			 * apply styles
			 */
			tweet.nativeElement.style.transform = `scale(${scale}) rotate(${currRot}deg)`;
			tweet.nativeElement.style.opacity = this.posLinearFn(thresh);
		});

		this._saf = false;
	}

	// MAKE CUSTOM TWEET BOXES
	structureTweets() {}

	ngAfterViewInit() {
		window.onpageshow = () => {
			this.refresh();
		};

		window.onresize = () => {
			this.structureTweets();
			this.refresh();
		};

		this.structureTweets();
	}
}
