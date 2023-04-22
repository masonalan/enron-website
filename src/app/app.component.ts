import {
	AfterViewInit,
	ElementRef,
	ViewChild,
	HostListener,
	Component,
} from "@angular/core";

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
	@ViewChild("tweet1") enTweet1!: ElementRef;
	@ViewChild("tweet2") enTweet2!: ElementRef;
	@ViewChild("tweet3") enTweet3!: ElementRef;
	@ViewChild("tweet4") enTweet4!: ElementRef;
	@ViewChild("tweet5") enTweet5!: ElementRef;
	@ViewChild("titleContainer") titleContainer!: ElementRef;

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

		let tweetElems = [
			this.enTweet1.nativeElement,
			this.enTweet2.nativeElement,
			this.enTweet3.nativeElement,
			this.enTweet4.nativeElement,
			this.enTweet5.nativeElement,
		];

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
		tweetElems.forEach(async (tweet, i) => {
			const t = tweet.offsetTop - window.innerHeight;
			const f = 2;
			const d = TWEET_ROTATIONS[i];
			const s = Math.abs(this.negLinearFn(t, FADE_DURATION * 2.5)) + 1;
			tweet.style.transform = `scale(${s > 5 ? 5 : s}) rotate(${
				d + this.negLinearFn(t, FADE_DURATION * 2.5) * 40
			}deg)`;
			tweet.style.opacity = this.posLinearFn(t, FADE_DURATION * 1.5);
		});

		this._saf = false;
	}

	ngAfterViewInit() {
		window.onpageshow = () => {
			(<any>window).twttr.widgets.load();
			this.refresh();
		};

		window.onresize = () => {
			this.refresh();
		};
	}
}
