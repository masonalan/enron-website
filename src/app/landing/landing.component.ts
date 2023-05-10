import {
	Component,
	ElementRef,
	HostListener,
	QueryList,
	ViewChild,
	ViewChildren,
	AfterViewInit,
} from "@angular/core";

import { ToolbarComponent } from "../toolbar/toolbar.component";
import { TweetsComponent } from "../tweets/tweets.component";

import { AnimateService } from "../animate.service";

@Component({
	selector: "app-landing",
	templateUrl: "./landing.component.html",
	styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements AfterViewInit {
	yCurr = 0;
	subtitleContent =
		"Enron is committed to showing you<br />why we deserve a second chance.";

	@ViewChild("title") title!: ElementRef;
	@ViewChild("subtitle") subtitle!: ElementRef;
	@ViewChild("tweetHeader") tweetHeader!: ElementRef;
	@ViewChild("logo") logo!: ElementRef;
	@ViewChild("toolbar") toolbar!: ToolbarComponent;
	@ViewChild("titleContainer") titleContainer!: ElementRef;
	@ViewChild("tweets") tweets!: TweetsComponent;
	@ViewChild("curtain") curtain!: ElementRef;
	@ViewChild("commitments") commitments!: ElementRef;
	@ViewChild("main") main!: ElementRef;
	@ViewChild("video") video!: ElementRef;

	/*
	 * whether or not there is a scheduled animation frame
	 */
	_saf = false;

	/**
	 * whether or not the scroll event is the first
	 */
	_isFirstScroll = true;

	ngAfterViewInit() {
		this.refresh();
	}

	@HostListener("window:resize", ["$event"])
	onResize(event: Event) {
		this.refresh;
	}

	@HostListener("window:scroll", ["$event"])
	onScroll(event: Event) {
		if (this._saf) return;

		this._saf = true;

		requestAnimationFrame(() => {
			this.refresh(this._isFirstScroll);
			this._isFirstScroll = false;
			this._saf = false;
		});
	}

	refresh(initAnims: boolean = false) {
		if (window.innerWidth <= 375) {
			this.subtitleContent =
				"Enron is committed to showing<br />you why we deserve<br />a second chance.";
		} else {
			this.subtitleContent =
				"Enron is committed to showing you<br />why we deserve a second chance.";
		}

		/**
		 * update scroll state & set up animations
		 */
		const yPrev = this.yCurr;
		const yCurr = window.pageYOffset;
		if (initAnims) {
			console.log("First Scroll");
		}
		this.animate.setContext({ yCurr, yPrev, initAnims });
		this.yCurr = yCurr;

		/**
		 * fade out title & fade in subtitle
		 */
		this.animate.fadeOut(this.title, 0, 100);

		/**
		 * fade out logo
		 */
		const logoFt =
			this.titleContainer.nativeElement.offsetTop +
			this.titleContainer.nativeElement.offsetHeight -
			30;
		this.animate.fadeOut(this.logo, logoFt);

		/**
		 * fade out subtitle
		 */
		const subTitleFt =
			logoFt +
			this.logo.nativeElement.offsetHeight -
			window.innerHeight / 2 +
			this.animate.FADE_DURATION;

		this.animate.fadeIn(this.subtitle, 0);
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
		 * update the height of the curtain to include the tweets
		 */
		const curtainHeight =
			subTitleFt +
			this.animate.FADE_DURATION +
			window.innerHeight +
			this.tweets.height();
		this.curtain.nativeElement.style.height = `${curtainHeight}px`;

		const tweetsHeight = this.tweets.height();
		this.tweets.setTop(curtainHeight - tweetsHeight);
		//this.commitments.nativeElement.style.top = `-${tweetsHeight}px`;
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

		/**
		 * animate tweets & toolbar
		 */
		this.toolbar.handleScroll(curtainHeight, logoFt);
		this.tweets.handleScroll();

		this.video.nativeElement.style.transform = `scale(${this.animate.posLinearFn(
			this.curtain.nativeElement.offsetHeight
		)})`;
		this.video.nativeElement.style.opacity = this.animate.posLinearFn(
			this.curtain.nativeElement.offsetHeight
		);
	}

	constructor(private animate: AnimateService) {}
}
