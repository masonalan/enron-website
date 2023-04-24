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
	yCurr = 0;

	@ViewChild("title") title!: ElementRef;
	@ViewChild("subtitle") subtitle!: ElementRef;
	@ViewChild("tweetHeader") tweetHeader!: ElementRef;
	@ViewChild("logo") logo!: ElementRef;
	@ViewChild("toolbar") toolbar!: ElementRef;
	@ViewChild("links") links!: ElementRef;
	@ViewChild("line") line!: ElementRef;
	@ViewChild("titleContainer") titleContainer!: ElementRef;
	@ViewChild("tweets") tweets!: TweetsComponent;
	@ViewChild("curtain") curtain!: ElementRef;
	@ViewChild("main") main!: ElementRef;

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
		this.animate.fadeOut(this.title, 0, 100);
		this.animate.fadeIn(this.subtitle, 0);

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
			this.toolbar,
			logoFt + this.animate.FADE_DURATION,
			(e: any) => {
				e.style.background = "transparent";
			},
			(e: any) => {
				e.style.background = "black";
			}
		);

		/**
		 * fade in toolbar
		 */
		this.animate.fadeIn(this.links, logoFt + this.animate.FADE_DURATION);
		this.animate.fadeIn(this.line, logoFt + this.animate.FADE_DURATION);

		/**
		 * fade out subtitle
		 */
		const subTitleFt =
			logoFt +
			this.logo.nativeElement.offsetHeight -
			window.innerHeight / 2 +
			this.animate.FADE_DURATION;
		this.animate.fadeOut(this.subtitle, subTitleFt);

		/**
		 * fade in/fade out tweet header
		 */
		this.animate.fadeIn(
			this.tweetHeader,
			subTitleFt + this.animate.FADE_DURATION
		);

		const tweetHeaderFO = this.animate.fadeOut(
			this.tweetHeader,
			subTitleFt +
				this.animate.FADE_DURATION +
				window.innerHeight +
				this.tweets.height()
		);

		/**
		 * animate tweets if necessary
		 */
		this.tweets.handleScroll();

		/**
		 * update the height of the curtain to include the tweets
		 */
		this.curtain.nativeElement.style.height = `${
			subTitleFt +
			this.animate.FADE_DURATION +
			window.innerHeight +
			this.tweets.height()
		}px`;

		this.tweets.setTop(this.tweets.height());

		this.animate.setAt(
			this.toolbar,
			this.curtain.nativeElement.offsetHeight,
			(e: any) => {
				e.style.background = "black";
				e.style.transition = "background 0.1s";
			},
			(e: any) => {
				e.style.background = "white";
			}
		);

		/**
		 * hide main container so that if we scroll < 0 on chrome it won't show
		 */
		this.animate.setAt(
			this.main,
			window.innerHeight,
			(e: any) => {
				e.style.opacity = 0;
			},
			(e: any) => {
				e.style.opacity = 1;
			}
		);

		this._saf = false;
	}

	constructor(private animate: AnimateService) {}
}
