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
	@ViewChildren("vCenterTop") vCenterTops!: QueryList<ElementRef>;
	@ViewChildren("vCenterBottom") vCenterBottoms!: QueryList<ElementRef>;

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
		this.refresh();
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

	isMobile() {
		return window.innerWidth <= 815;
	}

	refresh(initAnims: boolean = false) {
		/**
		 * update scroll state & set up animations
		 */
		this.animate.setContext(window.pageYOffset, initAnims);

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
			(this.isMobile() ? 75 : 30);
		this.animate.fadeOut(this.logo, logoFt, 100);

		/**
		 * fade in/out subtitle
		 */
		const subtitleFt =
			logoFt +
			this.logo.nativeElement.offsetHeight -
			window.innerHeight / 2 +
			this.animate.FADE_DURATION;
		this.animate.fadeIn(this.subtitle, 0);
		this.animate.fadeOut(this.subtitle, subtitleFt);

		/**
		 * animate scale on subtitle
		 */
		this.subtitle.nativeElement.style.transform = `scale(${this.animate.posLinearFn(
			0
		)})`;

		/**
		 * make sure subtitle & tweet header stick at vertical center
		 */
		this.vCenterTops.forEach((v) => {
			v.nativeElement.style.top = `${
				(window.innerHeight - v.nativeElement.offsetHeight) / 2
			}px`;
		});
		this.vCenterBottoms.forEach((v) => {
			v.nativeElement.style.bottom = `${
				(window.innerHeight - v.nativeElement.offsetHeight) / 2
			}px`;
		});

		/**
		 * fade in out tweet header
		 */
		this.animate.fadeIn(
			this.tweetHeader,
			subtitleFt + this.animate.FADE_DURATION / 2
		);

		/**
		 * update the height of the curtain to include the tweets
		 */
		const curtainHeight =
			subtitleFt +
			this.animate.FADE_DURATION +
			window.innerHeight +
			this.tweets.height();
		this.curtain.nativeElement.style.height = `${curtainHeight}px`;
		this.tweets.setTop(curtainHeight - this.tweets.height());

		/**
		 * animate tweets & toolbar
		 */
		this.toolbar.handleScroll(curtainHeight, logoFt + 50);
		this.tweets.handleScroll();

		/**
		 * hide main container so that if we scroll < 0 on chrome it won't show
		 */
		// this.animate.setAt(
		// 	this.main,
		// 	window.innerHeight,
		// 	(e: any) => {
		// 		e.style.opacity = 0;
		// 	},
		// 	(e: any) => {
		// 		e.style.opacity = 1;
		// 	}
		// );

		/**
		 * animate scale & opacity on video
		 */
		this.video.nativeElement.style.transform = `scale(${this.animate.posLinearFn(
			this.curtain.nativeElement.offsetHeight - 100
		)})`;
		this.video.nativeElement.style.opacity = this.animate.posLinearFn(
			this.curtain.nativeElement.offsetHeight
		);
	}

	constructor(private animate: AnimateService) {}
}
