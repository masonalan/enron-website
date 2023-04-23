import {
	Component,
	HostListener,
	ViewChildren,
	QueryList,
	ElementRef,
} from "@angular/core";

import { AnimateService } from "./../animate.service";

import tweetData from "../../assets/tweets.json";

@Component({
	selector: "app-tweets",
	templateUrl: "./tweets.component.html",
	styleUrls: ["./tweets.component.scss"],
})
export class TweetsComponent {
	@ViewChildren("tweet") elementRefs!: QueryList<ElementRef>;

	/**
	 * tweet structure
	 */
	structure = new Array<Array<any>>();

	/**
	 * tweet indexes that map to the first tweet in each row
	 */
	rowStarts = [0, 2, 3, 6, 8];

	/**
	 * get row, col & rowSize based on a tweet index
	 */
	index(i: number) {
		++i;
		let currRow = 0;
		let j = 0;
		for (; j < this.rowStarts.length && this.rowStarts[j] < i; ++j) {
			++currRow;
		}
		return {
			row: --currRow,
			col: i - this.rowStarts[j - 1] - 1,
			rowSize: this.rowStarts[j] - this.rowStarts[j - 1],
		};
	}

	/**
	 * restructure tweets based on window width
	 */
	//@HostListener("window:resize", ["$event"])
	reStructure() {
		/**
		 * Create tweet structure
		 */
		this.structure.length = 0;
		tweetData.forEach((tweet, i) => {
			const ti = this.index(i);
			if (ti.row == this.structure.length) {
				this.structure.push(new Array());
			}
			this.structure[ti.row].push(tweet);
		});
	}

	handleScroll() {
		/**
		 * tweet animations
		 */
		this.elementRefs.forEach(async (tweet, i) => {
			console.log("each tweet");
			const ti = this.index(i);

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
			const dur = this.animate.FADE_DURATION * 2.5;
			const currRot =
				destRot +
				(destRot < 0
					? this.animate.posLinearFn(thresh, dur)
					: this.animate.negLinearFn(thresh, dur)) *
					40;

			/**
			 * calculate current scale
			 */
			let scale =
				Math.abs(this.animate.negLinearFn(thresh, dur) * 2) +
				1 +
				ti.row / 2.0;
			scale = scale > 5 ? 5 : scale;

			/**
			 * apply styles
			 */
			//tweet.nativeElement.style.transform = `scale(${scale}) rotate(${currRot}deg)`;
			tweet.nativeElement.style.opacity =
				this.animate.posLinearFn(thresh);
		});
	}

	constructor(private animate: AnimateService) {
		this.reStructure();
	}
}
