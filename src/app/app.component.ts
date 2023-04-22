import {
	AfterViewInit,
	ElementRef,
	ViewChild,
	HostListener,
	Component,
	OnInit,
	ViewChildren,
	QueryList,
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

	/**
	 * put into json file
	 */
	tweetRows = new Array<Array<any>>();
	tweets = [
		{
			url: "https://twitter.com/NookTtocs/status/547501432?ref_src=twsrc%5Etfw",
			author: "nooK ttocS (@NookTtocs)",
			date: "December 30, 2007",
			content: `And more recently, Enron and the energy traders took
			corruption and evilness to a whole new level.`,
		},
		{
			url: "https://twitter.com/Percival/status/367504092?ref_src=twsrc%5Etfw",
			author: "Sean Percival (@Percival)",
			date: "October 27, 2007",
			content: `one thing good about moving is "the purge" why was i
			keeping bills from 2004 in my file cabinet? shredded
			so much tonight. feeling enron`,
		},
		{
			url: "https://twitter.com/AndyBoydnl/status/427197372?ref_src=twsrc%5Etfw",
			author: "Andy Boyd (@AndyBoydnl)",
			date: "November 19, 2007",
			content: `Just gob smacked after watching the Enron
			documentary - we always did wonder how they made
			money - and of course they didn&#39;t`,
		},
		{
			url: "https://twitter.com/brownsabbath/status/430269402?ref_src=twsrc%5Etfw",
			author: "Nick Ramirez (@brownsabbath)",
			date: "November 20, 2007",
			content: `I&#39;ve shredded my weight in paper today, maybe I
			should&#39;ve worked at Enron`,
		},
		{
			url: "https://twitter.com/nytimesbusiness/status/453313652?ref_src=twsrc%5Etfw",
			author: "NYT Business (@nytimesbusiness)",
			date: "November 29, 2007",
			content: `3 Bankers Plead Guilty in Case Tied to Enron
			http://tinyurl.com/2cm2la`,
		},
		{
			url: "https://twitter.com/NookTtocs/status/547501432?ref_src=twsrc%5Etfw",
			author: "nooK ttocS (@NookTtocs)",
			date: "December 30, 2007",
			content: `And more recently, Enron and the energy traders took
			corruption and evilness to a whole new level.`,
		},
		{
			url: "https://twitter.com/Percival/status/367504092?ref_src=twsrc%5Etfw",
			author: "Sean Percival (@Percival)",
			date: "October 27, 2007",
			content: `one thing good about moving is "the purge" why was i
			keeping bills from 2004 in my file cabinet? shredded
			so much tonight. feeling enron`,
		},
		{
			url: "https://twitter.com/AndyBoydnl/status/427197372?ref_src=twsrc%5Etfw",
			author: "Andy Boyd (@AndyBoydnl)",
			date: "November 19, 2007",
			content: `Just gob smacked after watching the Enron
			documentary - we always did wonder how they made
			money - and of course they didn&#39;t`,
		},
		{
			url: "https://twitter.com/brownsabbath/status/430269402?ref_src=twsrc%5Etfw",
			author: "Nick Ramirez (@brownsabbath)",
			date: "November 20, 2007",
			content: `I&#39;ve shredded my weight in paper today, maybe I
			should&#39;ve worked at Enron`,
		},
	];

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

	tweetIndex(i: number) {
		++i;
		let currRow = 0;
		let rowStart = 0;
		for (let r = 0; r < i; ) {
			rowStart = r;
			++currRow;
			r = r + 2 + currRow - 1;
		}
		return { row: --currRow, col: i - rowStart - 1, rowSize: currRow + 2 };
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
	@ViewChildren("tweet") tweetElements!: QueryList<ElementRef>;
	@ViewChild("tweetsContainer") tweetsContainer!: ElementRef;

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
		this.tweetElements.forEach(async (tweet, i) => {
			const ti = this.tweetIndex(i);

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
	structureTweets() {
		/**
		 * Create tweet structure
		 */
		this.tweets.forEach((tweet, i) => {
			const ti = this.tweetIndex(i);
			if (ti.rowSize * 400 > window.innerWidth) {
				return;
			}
			if (ti.row == this.tweetRows.length) {
				this.tweetRows.push(new Array());
			}
			this.tweetRows[ti.row].push(tweet);
		});

		// 	const cutoff = (this.tweetIndex(this.tweets.length - 1).row + 1) * 400;
		// 	this.tweetsContainer.nativeElement.style.background = `linear-gradient(180deg, black ${cutoff}px, rgba(0, 0, 0, 0) ${0}px)`;
	}

	ngAfterViewInit() {
		window.onpageshow = () => {
			(<any>window).twttr.widgets.load();
			this.refresh();
		};

		window.onresize = () => {
			this.structureTweets();
			this.refresh();
		};

		this.structureTweets();
	}
}
