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
	@ViewChild("spacer") spacer!: ElementRef;
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

		if (window.pageYOffset < 100) {
			document.body.style.background = "black";
		} else {
			document.body.style.background = "white";
		}

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
		 * scale threadhold fn
		 */
		const scaleThresh = (offsetTop: number) => {
			return (
				offsetTop -
				window.innerHeight * 0.65 -
				this.animate.FADE_DURATION
			);
		};

		/**
		 * fade & scale subtitle 1
		 */
		const subtitle1St = scaleThresh(this.subtitle.nativeElement.offsetTop);
		this.animate.fadeIn(this.subtitle, subtitle1St);
		this.subtitle.nativeElement.style.transform = `scale(${
			this.animate.posLinearFn(subtitle1St) * 0.5 + 0.5
		})`;

		/**
		 * animate subtitle 2
		 */
		const subtitle2St = scaleThresh(
			this.tweetHeader.nativeElement.parentElement.offsetTop
		);
		this.animate.fadeIn(this.tweetHeader, subtitle2St);
		this.tweetHeader.nativeElement.style.transform = `scale(${
			this.animate.posLinearFn(subtitle2St) * 0.5 + 0.5
		})`;

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
		 * update the height of the spacer to account for tweets
		 */
		this.spacer.nativeElement.style.height = `${
			(window.innerHeight - this.tweetHeader.nativeElement.offsetHeight) /
				2 +
			this.tweets.height()
		}px`;

		/**
		 * set the top of the tweets
		 */
		this.tweets.setTop(
			this.curtain.nativeElement.offsetHeight - this.tweets.height()
		);

		/**
		 * animate tweets & toolbar
		 */
		this.toolbar.handleScroll(
			this.curtain.nativeElement.offsetHeight,
			logoFt + 50
		);
		this.tweets.handleScroll();

		/**
		 * fade out subtitle 2
		 */
		this.animate.fadeOut(
			this.tweetHeader,
			this.curtain.nativeElement.offsetHeight - window.innerHeight - 30
		);

		/**
		 * animate scale & opacity on video
		 */
		this.video.nativeElement.style.transform = `scale(${
			this.animate.posLinearFn(
				this.curtain.nativeElement.offsetHeight - 100
			) *
				0.5 +
			0.5
		})`;
		this.video.nativeElement.style.opacity = this.animate.posLinearFn(
			this.curtain.nativeElement.offsetHeight
		);
	}

	constructor(private animate: AnimateService) {}
}
