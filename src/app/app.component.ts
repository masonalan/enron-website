import {
	AfterViewInit,
	ElementRef,
	ViewChild,
	HostListener,
	Component,
} from "@angular/core";

const TITLE_ANIM_THRESHOLD = 100;
const LOGO_MARGIN = 0;
const FADE_DURATION = 200; /* in px */
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
	@ViewChild("block2") enBlock2!: ElementRef;
	@ViewChild("logo") enLogo!: ElementRef;
	@ViewChild("firstquote") enFirstQuote!: ElementRef;
	@ViewChild("toolbar") enToolbar!: ElementRef;
	@ViewChild("links") enLinks!: ElementRef;
	@ViewChild("line") enLine!: ElementRef;

	@HostListener("window:scroll", ["$event"])
	onScroll(event: Event) {
		this.yOffset = window.pageYOffset;

		let subTitleElem = this.enSubTitle.nativeElement;
		let logoElem = this.enLogo.nativeElement;
		let block2Elem = this.enBlock2.nativeElement;
		let toolbarElem = this.enToolbar.nativeElement;
		let linksElem = this.enLinks.nativeElement;
		let lineElem = this.enLine.nativeElement;

		/**
		 * title & subtitle fade in/out
		 */
		this.enTitle.nativeElement.style.opacity = this.fadeOutAt(100, 100);

		this.subTitle.fadeInY = !this.subTitle.fadeInY
			? (window.innerHeight - subTitleElem.offsetTop - 60) * -1
			: this.subTitle.fadeInY;
		subTitleElem.style.opacity = this.fadeInAt(this.subTitle.fadeInY);
		block2Elem.style.opacity = this.fadeInAt(
			this.subTitle.fadeInY + subTitleElem.offsetHeight - 57.5 * 2 // 57.5 is line height
		);

		/**
		 * subtitle & logo collision
		 */
		if (!this.logo.bottom) {
			this.logo.bottom =
				logoElem.offsetTop + logoElem.offsetHeight + TOOLBAR_HEIGHT;
		}

		/**
		 * move logo conditionally
		 */
		const subTitleTop = subTitleElem.offsetTop - LOGO_MARGIN - this.yOffset;
		if (subTitleTop <= this.logo.bottom) {
			if (
				subTitleElem.offsetTop -
					TOOLBAR_HEIGHT -
					logoElem.offsetHeight -
					this.yOffset >
				30
			) {
				const logoCurrMarTop = parseInt(logoElem.style.marginTop);
				logoElem.style.marginTop = `${
					LOGO_MARGIN - (this.logo.bottom - subTitleTop)
				}px`;
			} else {
				if (this.logo.fadeOutY == Number.MAX_SAFE_INTEGER) {
					this.logo.fadeOutY = this.yOffset + FADE_DURATION;
				}
			}
		} else {
			logoElem.style.marginTop = `${LOGO_MARGIN}px`;
		}

		/**
		 * fade out logo
		 */
		logoElem.style.opacity = this.fadeOutAt(this.logo.fadeOutY);
		linksElem.style.opacity = this.fadeInAt(this.logo.fadeOutY);
		lineElem.style.opacity = this.fadeInAt(this.logo.fadeOutY);

		if (this.yOffset >= this.logo.fadeOutY) {
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
	}

	ngAfterViewInit() {
		let titleElem = this.enTitle.nativeElement;
		let h = window.innerHeight - parseInt(titleElem.offsetHeight) - 100;
		h = h > 750 ? 750 : h;
		this.enLogo.nativeElement.style.height = `${h}px`;
		this.enLogo.nativeElement.style.marginTop = `${LOGO_MARGIN}px`;
		this.enSubTitle.nativeElement.style.marginTop = `${
			window.innerHeight - 200
		}px`;
	}
}
