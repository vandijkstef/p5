interface Iblob extends HTMLElement {
	image: HTMLImageElement;
}

export class Hero {

	public blobs: NodeListOf<HTMLElement>;

	constructor(blobSelector: string) {
		this.blobs = document.querySelectorAll(blobSelector);
		this.blobs.forEach((blob: Iblob, i) => {
			// TODO: MinMax Top/Left
			const top = (blob.clientHeight / 100) + Math.random() * 50 + 150;
			const left = (blob.parentElement.clientWidth / 100) * (25 * i) + Math.random() * 150;

			blob.style.top = top + 'px';
			blob.style.left = left + 'px';
			blob.dataset.top = top.toString();
			blob.dataset.left = left.toString();

			blob.image = blob.querySelector('img');
			blob.image.style.top = parseInt(blob.dataset.top, 10) * -1 + 100 + 'px';
			blob.image.style.left = parseInt(blob.dataset.left, 10) * -1 + 100 + 'px';

			blob.addEventListener('mouseenter', this.enter);
			blob.addEventListener('mouseleave', this.out);
			blob.addEventListener('click', this.activate);
		});
	}

	public enter(this: Iblob) {
		if (!this.classList.contains('active')) {
			this.image.style.top = parseInt(this.dataset.top, 10) * -1 + 175 + 'px';
			this.image.style.left = parseInt(this.dataset.left, 10) * -1 + 175 + 'px';
		}
	}

	public out(this: Iblob) {
		if (!this.classList.contains('active')) {
			this.image.style.top = parseInt(this.dataset.top, 10) * -1 + 100 + 'px';
			this.image.style.left = parseInt(this.dataset.left, 10) * -1 + 100 + 'px';
		}
	}

	public activate(this: Iblob) {
		// TODO: Make seperate back button
		if (!this.classList.contains('active')) {
			this.classList.add('active');
			this.image.style.top = parseInt(this.dataset.top, 10) * -1 + 3500 + 'px';
			this.image.style.left = parseInt(this.dataset.left, 10) * -1 + 3500 + 'px';
			document.body.id = this.id;
		}
	}
}
