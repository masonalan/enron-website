import {
	Component,
	ElementRef,
	HostListener,
	QueryList,
	ViewChild,
	ViewChildren,
} from "@angular/core";

import { TweetsComponent } from "./tweets/tweets.component";

import { AnimateService } from "./animate.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	title = "enron-website";

	yCurr = 0;

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
	@ViewChild("curtain") curtain!: ElementRef;
	@ViewChild("tweetsSpacer") tweetsSpacer!: ElementRef;

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
		 * update scroll state & set up animations
		 */
		const yPrev = this.yCurr;
		this.yCurr = window.pageYOffset;
		this.animate.setScrollPos(this.yCurr, yPrev);

		/**
		 * fade out title & fade in subtitle
		 */
		this.animate.fadeOut(this.enTitle, 0, 100);
		this.animate.fadeIn(this.enSubTitle, 0);

		/**
		 * fade out logo
		 */
		const logoFt =
			this.titleContainer.nativeElement.offsetTop +
			this.titleContainer.nativeElement.offsetHeight -
			30;
		this.animate.fadeOut(this.logo, logoFt);

		/**
		 * update the bg color of the toolbar
		 */
		this.animate.setAt(
			this.enToolbar,
			logoFt + this.animate.FADE_DURATION,
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
		this.animate.fadeIn(this.enLinks, logoFt + this.animate.FADE_DURATION);
		this.animate.fadeIn(this.enLine, logoFt + this.animate.FADE_DURATION);

		/**
		 * fade out subtitle
		 */
		const subTitleFt =
			logoFt +
			this.logo.nativeElement.offsetHeight -
			window.innerHeight / 2 +
			this.animate.FADE_DURATION;
		this.animate.fadeOut(this.enSubTitle, subTitleFt);

		/**
		 * fade in/fade out tweet header
		 */
		this.animate.fadeIn(
			this.enBlock2,
			subTitleFt + this.animate.FADE_DURATION
		);

		const tweetHeaderFO = this.animate.fadeOut(
			this.enBlock2,
			subTitleFt +
				this.animate.FADE_DURATION +
				window.innerHeight +
				this.tweets.height()
		);

		/**
		 * animate tweets if necessary
		 */
		this.tweets.handleScroll();

		const spacerHeight = this.tweets.height();

		console.log(this.tweets.height());
		this.curtain.nativeElement.style.height = `${
			subTitleFt +
			this.animate.FADE_DURATION +
			window.innerHeight +
			this.tweets.height()
		}px`;

		this.tweetsSpacer.nativeElement.style.height = `${this.tweets.height()}px`;
		this.tweets.setTop(this.tweets.height());

		this._saf = false;
	}

	constructor(private animate: AnimateService) {}
}
