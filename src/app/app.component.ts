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

	logoInfo = {
		top: 0,
		bottom: 0,
		fadeOutY: Number.MAX_SAFE_INTEGER,
	};

	subTitle = {
		fixedY: Number.MAX_SAFE_INTEGER,
		fadeInY: 0,
	};

	quote1 = {
		fadeInY: 0,
		fixedY: 0,
	};

	posLinearSeq(threshold: number, duration = FADE_DURATION) {
		const v = (this.yCurr - threshold) / duration;
		if (v < 0) {
			return 0;
		} else if (v > 1) {
			return 1;
		}
		return v;
	}

	negLinearSeq(threshold: number, duration = FADE_DURATION) {
		const v = (threshold - this.yCurr) / duration;
		if (v < 0) {
			return 0;
		} else if (v > 1) {
			return 1;
		}
		return v;
	}

	set(elem: ElementRef, fn: any) {
		const clone = this._frozen.get(elem);
		if (clone && clone.visible) {
			fn(clone);
		} else {
			fn(elem.nativeElement);
		}
	}

	_fadeIn = new Map();
	fadeIn(elem: ElementRef, t: number, duration = FADE_DURATION) {
		const isActive = this._fadeIn.get(elem);

		if (this.yCurr >= t && this.yCurr <= t + duration) {
			/**
			 * yCurr is within anim range
			 */
			if (!isActive) {
				this._fadeIn.set(elem, true);
			}
			this.set(elem, (e: any) => {
				e.style.opacity = this.posLinearSeq(t, duration);
			});
		} else if (this.yCurr < t) {
			/**
			 * yCurr is above anim range
			 */
			if (isActive || this.yPrev > t + duration) {
				this.set(elem, (e: any) => {
					e.style.opacity = 0;
				});
				this._fadeIn.set(elem, false);
			}
		} else if (this.yCurr > t + duration && isActive) {
			/**
			 * yCurr is below anim range
			 */
			if (isActive || this.yPrev < t) {
				this.set(elem, (e: any) => {
					e.style.opacity = 1;
				});
				this._fadeIn.set(elem, false);
			}
		}
	}

	_fadeOut = new Map();
	fadeOut(elem: ElementRef, t: number, duration = FADE_DURATION) {
		const isActive = this._fadeOut.get(elem);

		if (this.yCurr >= t - duration && this.yCurr <= t) {
			/**
			 * yCurr is within anim range
			 */
			if (!isActive) {
				this._fadeOut.set(elem, true);
			}
			this.set(elem, (e: any) => {
				e.style.opacity = this.negLinearSeq(t, duration);
			});
		} else if (this.yCurr < t - duration) {
			/**
			 * yCurr is above anim range
			 */
			if (isActive || this.yPrev > t) {
				this.set(elem, (e: any) => {
					e.style.opacity = 1;
				});
				this._fadeOut.set(elem, false);
			}
		} else if (this.yCurr > t && isActive) {
			/**
			 * yCurr is below anim range
			 */
			if (isActive || this.yPrev < t - duration) {
				this.set(elem, (e: any) => {
					e.style.opacity = 0;
				});
				this._fadeOut.set(elem, false);
			}
		}
	}

	_frozen = new Map();
	freeze(elem: ElementRef, y: number) {
		let clone = this._frozen.get(elem);
		if (this.yCurr >= y) {
			if (clone === undefined) {
				clone = elem.nativeElement.cloneNode(true);
				clone.style.position = "fixed";
				clone.style.top = `${elem.nativeElement.offsetTop - y}px`;
				clone.style.marginTop = `0px`;
				elem.nativeElement.after(clone);
				clone["visible"] = true;
				this._frozen.set(elem, clone);
				elem.nativeElement.style.opacity = 0;
			} else if (!clone.visible) {
				clone.style.display = "flex";
				clone.visible = true;
				elem.nativeElement.style.opacity = 0;
			}
		} else if (clone && clone.visible) {
			clone.style.display = "none";
			clone.visible = false;
			elem.nativeElement.style.opacity = 1;
		}
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
		this.yPrev = this.yCurr;
		this.yCurr = window.pageYOffset;

		let subTitleElem = this.enSubTitle.nativeElement;
		let logoElem = this.logo.nativeElement;
		let block2Elem = this.enBlock2.nativeElement;
		let toolbarElem = this.enToolbar.nativeElement;
		let linksElem = this.enLinks.nativeElement;
		let lineElem = this.enLine.nativeElement;
		let tweetElems = [
			this.enTweet1.nativeElement,
			this.enTweet2.nativeElement,
			this.enTweet3.nativeElement,
			this.enTweet4.nativeElement,
			this.enTweet5.nativeElement,
		];

		/**
		 * title fade in/out
		 */
		this.fadeOut(this.enTitle, 100, 100);
		this.fadeIn(this.enSubTitle, 0);
		//subTitleElem.style.opacity = this.fadeInAt(0);

		/**
		 * move logo conditionally
		 */
		if (
			subTitleElem.offsetTop - LOGO_MARGIN - this.yCurr <=
			this.logoInfo.bottom
		) {
			const vd = subTitleElem.offsetTop - this.logoInfo.bottom;
			if (this.logoInfo.top + vd > this.yCurr + LOGO_MARGIN + PADDING) {
				/**
				 * move logo until logo is at top of screen
				 */
				logoElem.style.marginTop = `${vd - LOGO_MARGIN - this.yCurr}px`;
			} else {
				/**
				 * update when to fade out the logo
				 */
				logoElem.style.marginTop = `${-this.logoInfo.top + PADDING}px`;
				if (this.logoInfo.fadeOutY == Number.MAX_SAFE_INTEGER) {
					this.logoInfo.fadeOutY = this.yCurr + FADE_DURATION;
				}
			}
		} else {
			logoElem.style.marginTop = `0px`;
		}

		/**
		 * fade out logo & fade in toolbar
		 */
		this.fadeOut(this.logo, this.logoInfo.fadeOutY);
		this.fadeIn(this.enLinks, this.logoInfo.fadeOutY);
		this.fadeIn(this.enLine, this.logoInfo.fadeOutY);

		if (this.yCurr >= this.logoInfo.top + PADDING + FADE_DURATION) {
			if (
				toolbarElem.style.backgroundColor === "transparent" ||
				toolbarElem.style.backgroundColor === ""
			) {
				toolbarElem.style.backgroundColor = "black";
			}
		} else {
			if (toolbarElem.style.backgroundColor === "black") {
				toolbarElem.style.backgroundColor = "transparent";
			}
		}

		const ft = subTitleElem.offsetTop - window.innerHeight / 2;
		this.freeze(this.enSubTitle, ft);

		this.fadeOut(this.enSubTitle, ft + FADE_DURATION);
		this.fadeIn(this.enBlock2, ft + FADE_DURATION);
		//}

		/**
		 * tweet animations
		 */
		tweetElems.forEach(async (tweet, i) => {
			const t = tweet.offsetTop - window.innerHeight / 2;
			const f = 2;
			const d = TWEET_ROTATIONS[i];
			const s = Math.abs(this.negLinearSeq(t) * f) + 1;
			tweet.style.transform = `scale(${s > 2 ? 2 : s}) rotate(${
				d + this.negLinearSeq(t) * 20
			}deg)`;
			tweet.style.opacity = this.posLinearSeq(t - FADE_DURATION / 1.5);
		});
	}

	initAnimInfo() {
		/**
		 * calculate bottom of logo
		 */
		this.logoInfo.bottom =
			this.logo.nativeElement.offsetTop +
			this.logo.nativeElement.offsetHeight;
		this.logoInfo.top = this.logo.nativeElement.offsetTop;

		/**
		 * update subtitle margin top based on logo height
		 */
		this.enSubTitle.nativeElement.style.marginTop = `${
			this.logoInfo.bottom +
			LOGO_MARGIN -
			this.enTitle.nativeElement.offsetHeight -
			this.enTitle.nativeElement.offsetTop -
			100
		}px`;
	}

	ngAfterViewInit() {
		window.onpageshow = () => {
			this.initAnimInfo();
			(<any>window).twttr.widgets.load();
		};

		window.onresize = () => {
			this.initAnimInfo();
		};

		this.initAnimInfo();
	}
}
