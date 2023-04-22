import {
	AfterViewInit,
	ElementRef,
	ViewChild,
	HostListener,
	Component,
} from "@angular/core";

const TITLE_ANIM_THRESHOLD = 100;
const FADE_DURATION = 200; /* in px */
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

	set(elem: ElementRef, fn: any) {
		const clone = this._frozen.get(elem);
		if (clone && clone.visible) {
			fn(clone);
		} else {
			fn(elem.nativeElement);
		}
	}

	setAt(elem: ElementRef, t: number, beforeFn: any, afterFn: any) {
		if (this.yCurr >= t && this.yPrev < t) {
			this.set(elem, afterFn);
		} else if (this.yCurr < t && this.yPrev >= t) {
			this.set(elem, beforeFn);
		}
	}

	fade(
		elem: ElementRef,
		isActive: boolean,
		t: number,
		d: number,
		fadeFn: any
	) {
		// set fn
		const set = () => {
			this.set(elem, (e: any) => {
				e.style.opacity = fadeFn(t, d);
			});
		};

		if (this.yCurr >= t && this.yCurr <= t + d) {
			// yCurr is within anim range
			set();
			return true;
		} else if (this.yCurr < t) {
			// yCurr is above anim range
			// set to final value and stop animation
			if (isActive || this.yPrev > t + d) {
				set();
				return false;
			}
		} else if (this.yCurr > t + d && isActive) {
			// yCurr is below anim range
			// set to final value and stop animation
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

	_frozen = new Map();
	freeze(elem: ElementRef, y: number) {
		let clone = this._frozen.get(elem);

		// lazy init clone
		if (!clone) {
			clone = elem.nativeElement.cloneNode(true);
			clone.style.position = "fixed";
			clone.style.top = `${elem.nativeElement.offsetTop - y}px`;
			clone.style.marginTop = `0px`;
			clone.style.display = "none";
			elem.nativeElement.after(clone);
			clone["visible"] = false;
			this._frozen.set(elem, clone);
		}

		// show or hide fixed clone
		if (this.yCurr >= y && !clone.visible) {
			clone.style.display = "flex";
			clone.visible = true;
			elem.nativeElement.style.opacity = 0;
		} else if (this.yCurr < y && clone.visible) {
			clone.style.display = "none";
			clone.visible = false;
			elem.nativeElement.style.opacity = 1;
		}

		console.log(clone.visible);
	}

	@ViewChild("title") enTitle!: ElementRef;
	@ViewChild("subtitle") enSubTitle!: ElementRef;
	@ViewChild("block2") enBlock2!: ElementRef;
	@ViewChild("logo") logo!: ElementRef;
	@ViewChild("firstquote") enFirstQuote!: ElementRef;
	@ViewChild("toolbar") enToolbar!: ElementRef;
	@ViewChild("links") enLinks!: ElementRef;
	@ViewChild("line") enLine!: ElementRef;
	@ViewChild("tweet1") enTweet1!: ElementRef;
	@ViewChild("tweet2") enTweet2!: ElementRef;
	@ViewChild("tweet3") enTweet3!: ElementRef;
	@ViewChild("tweet4") enTweet4!: ElementRef;
	@ViewChild("tweet5") enTweet5!: ElementRef;

	@HostListener("window:scroll", ["$event"])
	onScroll(event: Event) {
		/**
		 * update scroll state
		 */
		this.yPrev = this.yCurr;
		this.yCurr = window.pageYOffset;

		let tweetElems = [
			this.enTweet1.nativeElement,
			this.enTweet2.nativeElement,
			this.enTweet3.nativeElement,
			this.enTweet4.nativeElement,
			this.enTweet5.nativeElement,
		];

		/**
		 * fade out title & fade in message 1
		 */
		this.fadeOut(this.enTitle, 0, 100);
		this.fadeIn(this.enSubTitle, 0);

		/**
		 * freeze logo at top of screen and fade it out
		 */
		const logoFt = this.logo.nativeElement.offsetTop - PADDING;
		this.freeze(this.logo, logoFt);
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
		 * fade in toolbar (combine to 1 component)
		 */
		this.fadeIn(this.enLinks, logoFt + FADE_DURATION);
		this.fadeIn(this.enLine, logoFt + FADE_DURATION);

		/**
		 * freeze message 1 halfway up window & fade out
		 */
		const subTitleFt =
			this.enSubTitle.nativeElement.offsetTop - window.innerHeight / 2;
		this.freeze(this.enSubTitle, subTitleFt);
		this.fadeOut(this.enSubTitle, subTitleFt);

		/**
		 * fade in message 2
		 */
		this.fadeIn(this.enBlock2, subTitleFt + FADE_DURATION);

		/**
		 * tweet animations
		 */
		tweetElems.forEach(async (tweet, i) => {
			const t = tweet.offsetTop - window.innerHeight / 2;
			const f = 2;
			const d = TWEET_ROTATIONS[i];
			const s = Math.abs(this.negLinearFn(t) * f) + 1;
			tweet.style.transform = `scale(${s > 2 ? 2 : s}) rotate(${
				d + this.negLinearFn(t) * 20
			}deg)`;
			tweet.style.opacity = this.posLinearFn(t - FADE_DURATION / 1.5);
		});
	}

	ngAfterViewInit() {
		window.onpageshow = () => {
			(<any>window).twttr.widgets.load();
		};

		window.onresize = () => {
			// handle resize
		};
	}
}
