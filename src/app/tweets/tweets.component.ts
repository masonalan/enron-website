import {
	Component,
	HostListener,
	ViewChildren,
	QueryList,
	ElementRef,
} from "@angular/core";

import tweetData from "../../assets/tweets.json";

@Component({
	selector: "app-tweets",
	templateUrl: "./tweets.component.html",
	styleUrls: ["./tweets.component.scss"],
})
export class TweetsComponent {
	@ViewChildren("tweet") elementRefs!: QueryList<ElementRef>;

	/**
	 * tweets
	 */
	tweets: any;

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
	@HostListener("window:resize", ["$event"])
	reStructure() {
		/**
		 * Create tweet structure
		 */
		this.structure.length = 0;
		const tweetArr = tweetData as Array<any>;
		tweetArr.forEach((tweet, i) => {
			const ti = this.index(i);
			if (ti.rowSize * 400 > window.innerWidth) {
				return;
			}
			if (ti.row == this.structure.length) {
				this.structure.push(new Array());
			}
			this.structure[ti.row].push(tweet);
		});
	}

	constructor() {
		this.reStructure();
	}
}
