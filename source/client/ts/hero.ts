interface blob extends HTMLElement {
	image: HTMLImageElement;
}

export class Hero {

	blobs: NodeListOf<HTMLElement>;

	constructor(blobSelector: string) {
		this.blobs = document.querySelectorAll(blobSelector);
		this.blobs.forEach((blob: blob, i) => {
			// TODO: MinMax Top/Left
			const top = (blob.clientHeight / 100) + Math.random() * 50 + 150;
			const left = (blob.parentElement.clientWidth / 100) * (25 * i) + Math.random() * 150;			
			
			blob.style.top = top + 'px';
			blob.style.left = left + 'px';
			blob.dataset.top = top.toString();
			blob.dataset.left = left.toString();
			
			blob.image = blob.querySelector('img');
			blob.image.style.top = parseInt(blob.dataset.top) * -1 + 100 + 'px';
			blob.image.style.left = parseInt(blob.dataset.left) * -1 + 100 + 'px';

			blob.addEventListener('mouseenter', this.enter);
			blob.addEventListener('mouseleave', this.out);
			blob.addEventListener('click', this.activate);
		});
	}
	
	enter(this: blob) {
		if (!this.classList.contains('active')) {
			this.image.style.top = parseInt(this.dataset.top) * -1 + 175 + 'px';
			this.image.style.left = parseInt(this.dataset.left) * -1 + 175 + 'px';
		}
	}
	
	out(this: blob) {
		if (!this.classList.contains('active')) {
			this.image.style.top = parseInt(this.dataset.top) * -1 + 100 + 'px';
			this.image.style.left = parseInt(this.dataset.left) * -1 + 100 + 'px';
		}
	}
	
	activate(this: blob) {
		if (this.classList.contains('active')) {
			this.classList.remove('active');
			this.image.style.top = parseInt(this.dataset.top) * -1 + 175 + 'px';
			this.image.style.left = parseInt(this.dataset.left) * -1 + 175 + 'px';
			document.body.id = '';
		} else {
			this.classList.add('active');
			this.image.style.top = parseInt(this.dataset.top) * -1 + 350 + 'px';
			this.image.style.left = parseInt(this.dataset.left) * -1 + 350 + 'px';
			document.body.id = this.id;
		}
	}
}