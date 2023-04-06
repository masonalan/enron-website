import {
	AfterViewInit,
	ElementRef,
	ViewChild,
	HostListener,
	Component,
} from "@angular/core";

const TITLE_ANIM_THRESHOLD = 100;
const LOGO_MARGIN = 70;
const FADE_DURATION = 170; /* in px */
const TOOLBAR_HEIGHT = 125;

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewInit {
	title = "enron-website";

	yOffset = 0;

	logo = {
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

	fadeInAt(threshold: number, duration = FADE_DURATION) {
		return (this.yOffset - threshold) / duration;
	}

	fadeOutAt(threshold: number, duration = FADE_DURATION) {
		return (threshold - this.yOffset) / duration;
	}

	@ViewChild("title") enTitle!: ElementRef;
	@ViewChild("subtitle") enSubTitle!: ElementRef;
	@ViewChild("logo") enLogo!: ElementRef;
	@ViewChild("firstquote") enFirstQuote!: ElementRef;

	@HostListener("window:scroll", ["$event"])
	onScroll(event: Event) {
		this.yOffset = window.pageYOffset;

		let subTitleElem = this.enSubTitle.nativeElement;
		let logoElem = this.enLogo.nativeElement;
		let quote1Elem = this.enFirstQuote.nativeElement;

		/**
		 * title & subtitle fade in/out
		 */
		this.enTitle.nativeElement.style.opacity = this.fadeOutAt(100, 100);

		this.subTitle.fadeInY = !this.subTitle.fadeInY
			? (window.innerHeight + 30 - subTitleElem.offsetTop) * -1
			: this.subTitle.fadeInY;
		subTitleElem.style.opacity = this.fadeInAt(this.subTitle.fadeInY);

		if (subTitleElem.style.opacity >= 1) {
			subTitleElem.style.opacity = this.fadeOutAt(
				this.subTitle.fadeInY + 600
			);
		}

		/**
		 * subtitle & logo collision
		 */
		if (!this.logo.bottom) {
			this.logo.bottom = logoElem.offsetTop + logoElem.offsetHeight;
		}

		const subTitleTop = subTitleElem.offsetTop - LOGO_MARGIN - this.yOffset;
		if (subTitleTop <= this.logo.bottom) {
			if (
				subTitleElem.offsetTop +
					subTitleElem.offsetHeight +
					30 -
					this.yOffset >
				window.innerHeight
			) {
				const logoCurrMarTop = parseInt(logoElem.style.marginTop);
				logoElem.style.marginTop = `${
					70 - (this.logo.bottom - subTitleTop)
				}px`;
			} else if (this.logo.fadeOutY == Number.MAX_SAFE_INTEGER) {
				this.logo.fadeOutY = this.yOffset + FADE_DURATION;
			}
		} else {
			logoElem.style.marginTop = `${LOGO_MARGIN}px`;
		}

		/**
		 * freeze subtitle
		 */
		// if (
		// 	subTitleElem.offsetTop +
		// 		subTitleElem.offsetHeight +
		// 		30 -
		// 		this.yOffset <=
		// 		window.innerHeight &&
		// 	subTitleElem.style.position !== "fixed"
		// ) {
		// 	this.enSubTitle.nativeElement.style.position = "fixed";
		// 	this.subTitle.fixedY = this.yOffset;
		// } else if (this.yOffset < this.subTitle.fixedY) {
		// 	this.enSubTitle.nativeElement.style.position = "relative";
		// }

		/**
		 * fade out logo
		 */
		logoElem.style.opacity = this.fadeOutAt(this.logo.fadeOutY);

		/**
		 * fade in quote 1
		 */
		this.quote1.fadeInY = !this.quote1.fadeInY
			? quote1Elem.offsetTop - TOOLBAR_HEIGHT - 200
			: this.quote1.fadeInY;
		quote1Elem.style.opacity = this.fadeInAt(this.quote1.fadeInY);

		/**
		 * freeze quote 1
		 */
		if (this.yOffset > this.quote1.fadeInY + 200) {
			quote1Elem.style.top = `${
				1200 + (this.yOffset - (this.quote1.fadeInY + 200))
			}px`;
		}

		/**
		 * fade out quote 1
		 */
		if (quote1Elem.style.opacity >= 1) {
			quote1Elem.style.opacity = this.fadeOutAt(
				this.quote1.fadeInY + 400
			);
		}
	}

	ngAfterViewInit() {
		this.enLogo.nativeElement.style.marginTop = `${LOGO_MARGIN}px`;
		this.enSubTitle.nativeElement.style.marginTop = `${
			window.innerHeight - 200
		}px`;
	}
}
