import {
	Component,
	HostListener,
	ViewChild,
	ViewChildren,
	QueryList,
	ElementRef,
	AfterViewInit,
} from "@angular/core";

import { AnimateService } from "./../animate.service";

import tweetData from "../../assets/tweets.json";

@Component({
	selector: "app-tweets",
	templateUrl: "./tweets.component.html",
	styleUrls: ["./tweets.component.scss"],
})
export class TweetsComponent implements AfterViewInit {
	@ViewChild("container") container!: ElementRef;
	@ViewChildren("tweet") elementRefs!: QueryList<ElementRef>;

	/**
	 * tweet structure
	 */
	structure = new Array<Array<any>>();

	/**
	 * tweet indexes that map to the first tweet in each row
	 */
	rowStarts = [0, 2, 3, 5, 8];

	/**
	 * get row, col & rowSize based on a tweet indexm
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

	setTop(top: number) {
		this.container.nativeElement.parentElement.style.top = `${top}px`;
	}

	private _height = 0;
	height() {
		return this._height;
	}

	@HostListener("window:resize", ["$event"])
	onResize() {
		/**
		 * create tweet structure
		 */
		this.structure.length = 0;
		tweetData.forEach((tweet, i) => {
			const ti = this.index(i);
			/**
			 * for mobile, we only want to show the first 3 rows (its enough for the transition)
			 */
			if (window.innerWidth <= 815 && ti.row > 2) {
				return;
			}
			if (ti.row == this.structure.length) {
				this.structure.push(new Array());
			}
			this.structure[ti.row].push(tweet);
		});

		if (!this.elementRefs) {
			return;
		}
		const rect = this.elementRefs
			.get(this.elementRefs.length - 1)!
			.nativeElement.getBoundingClientRect();
		this._height =
			rect.top +
			rect.height / 2 -
			this.container.nativeElement.parentElement.getBoundingClientRect()
				.top;
	}

	onScroll() {
		/**
		 * tweet animations
		 */
		this.elementRefs.forEach(async (tweet, i) => {
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
					? -7
					: ti.col + 1 > ti.rowSize / 2
					? 0
					: -80;

			/**
			 * calculate current rotation
			 * TODO: this threshold logic is not responsive - please fix asap
			 */
			const thresh =
				this.container.nativeElement.parentElement.offsetTop -
				window.innerHeight +
				ti.row * 500 +
				ti.col * 50;
			const dur = this.animate.FADE_DURATION * 2.5;
			const currRot =
				destRot !== -7
					? destRot +
					  (destRot < 0
							? this.animate.posLinearFn(
									thresh,
									window.innerHeight * 2
							  )
							: this.animate.negLinearFn(
									thresh,
									window.innerHeight * 2
							  )) *
							80
					: this.animate.posLinearFn(thresh, window.innerHeight * 2) *
							14 +
					  destRot;

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
			tweet.nativeElement.style.transform = `scale(${scale}) rotate(${currRot}deg)`;
			tweet.nativeElement.style.opacity =
				this.animate.posLinearFn(thresh);
		});
	}

	ngAfterViewInit() {
		this.onResize();
	}

	constructor(private animate: AnimateService) {
		this.onResize();
		this.animate.registerScrollCallback(() => this.onScroll());
	}
}
