interface blob extends HTMLElement {
	image: HTMLImageElement;
}

export class Hero {

	blobs: NodeListOf<HTMLElement>;

	constructor(blobSelector: string) {
		this.blobs = document.querySelectorAll(blobSelector);
		this.blobs.forEach((blob: blob, i) => {
			// TODO: MinMax Top/Left
			const top = (i * blob.clientHeight) + Math.random() * 150;
			const left = (blob.parentElement.clientWidth / 100) * (25 * i) + 150 + Math.random() * 150;			
			
			blob.style.top = top + 'px';
			blob.style.left = left + 'px';
			blob.dataset.top = top.toString();
			blob.dataset.left = left.toString();
			
			blob.image = blob.querySelector('img');
			blob.image.style.top = top * -1 + 100 + 'px';
			blob.image.style.left = left * -1 + 100 + 'px';

			blob.addEventListener('mouseenter', this.enter);
			blob.addEventListener('mouseleave', this.out);
			blob.addEventListener('click', this.activate);
		});
	}
	
	enter(this: blob) {
		console.log('enter');
		// const top = (10 * 100);
		// const left = (10 * 100);
		// this.image.style.top = top * -1 + 50 + 'px';
		// this.image.style.left = left * -1 + 50 + 'px';
	}
	
	out(this: blob) {
		console.log('out');
		// const top = (10 * 100) + 50;
		// const left = (10 * 100) + 50;
		// this.image.style.top = top * -1 + 50 + 'px';
		// this.image.style.left = left * -1 + 50 + 'px';
	}
	
	activate(this: blob) {
		console.log('much click many phun');
		this.classList.toggle('active');
	}
}