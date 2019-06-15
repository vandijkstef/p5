import { UITools } from './UI.js';
import { VPanel } from './vPanel.js';

export class Renderer {

	public static set() {
		const user = document.querySelector('#user');
		user.addEventListener('click', Renderer.renderLogin);

		const infopanel = document.querySelector('button#info') as any;
		if (infopanel) {
			infopanel.addEventListener('click', () => {
				infopanel.UI = new UITools();
				infopanel.panel = new VPanel('Uw verhalen', [
					infopanel.UI.CreateText(''),
				]);
			});
		}
	}

	public static renderStories(data, id?: string): any {
		return new Promise((resolve, reject) => {
			const content = [];
			const UI = new UITools();

			fetch('/favs')
				.then((response) => {
					return response.json();
				})
				.then((favData) => {
					for (const entry of data) {
						if (id === 'fav') {
							if (favData.status === 'ok') {
								if (!favData.favs.includes(entry.id)) {
									continue;
								}
							} else {
								continue;
							}
						}

						const favCount = Math.floor(Math.random() * 100);
						const fav = UI.CreateHTML(`<i class="fas fa-heart"></i> <span>${favCount}</span>`, null, null, 'button');
						fav.addEventListener('click', Renderer.favHandler);
						fav.classList.add('fav');

						const download = UI.CreateHTML('<i class="fas fa-cloud-download-alt"></i>', null, null, 'button');
						download.addEventListener('click', Renderer.storeHandler);
						download.classList.add('download');

						const section = UI.Wrap([
							UI.CreateText(entry.title, null, null, 'h3'),
							UI.Wrap([
								UI.CreateHTML(`<i class="far fa-comment-alt"></i> ${entry['slash:comments']}`, null, null, 'p'),
								UI.CreateHTML(`<i class="fab fa-gratipay"></i> ${favCount}`, null, null, 'p'),
							]),
							UI.Wrap([
								fav,
								download,
							], ['row']),
						], null, null, 'section');

						section.classList.add('story');
						section.dataset.id = entry.id;
						section.dataset.pubdate = new Date(entry.pubDate).getTime();
						section.dataset.favs = favCount;
						section.dataset.comments = entry['slash:comments'];
						section.dataset.length = entry['content:encoded'].length;

						if (favData.status === 'ok' && favData.favs.includes(entry.id)) {
							section.dataset.myfav = '1';
							section.classList.add('fav');
							fav.classList.add('active');
						}

						content.push(section);
					}

					let classes = null;
					if (id) {
						classes = ['slide'];
					}

					const article = UI.Wrap(content, classes, id, 'article');
					resolve(article);
				})
				.catch((err) => {
					reject(err);
				});
		});

	}

	public static renderFilter() {
		return new Promise((resolve, reject) => {
			const content = [];
			const UI = new UITools();

			const commentsBtn = UI.CreateText('Reacties', null, null, 'button');
			commentsBtn.dataset.sort = 'comments';
			commentsBtn.addEventListener('click', Renderer.sortHandler);
			content.push(commentsBtn);

			const favBtn = UI.CreateText('Likes', null, null, 'button');
			favBtn.dataset.sort = 'favs';
			favBtn.addEventListener('click', Renderer.sortHandler);
			content.push(favBtn);

			const lengthBtn = UI.CreateText('Lengte', null, null, 'button');
			lengthBtn.dataset.sort = 'length';
			lengthBtn.addEventListener('click', Renderer.sortHandler);
			content.push(lengthBtn);

			const dateBtn = UI.CreateText('Datum', null, null, 'button');
			dateBtn.dataset.sort = 'pubdate';
			dateBtn.addEventListener('click', Renderer.sortHandler);
			content.push(dateBtn);

			if (document.body.classList.contains('user')) {
				const myFavBtn = UI.CreateText('Mijn favorieten', null, null, 'button');
				myFavBtn.dataset.sort = 'myfav';
				myFavBtn.addEventListener('click', Renderer.sortHandler);
				content.push(myFavBtn);
			}

			const buttonWrap = UI.Wrap(content, null, null, 'div');
			buttonWrap.id = 'filter';

			const section = UI.Wrap([
				UI.CreateText('Alle verhalen', null, null, 'h2'),
				buttonWrap,
			], null, 'filtersc', 'section');

			// target.appendChild(UI.Wrap([section], null, null, 'main'));
			resolve(section);

		});
	}

	public static sortHandler(this: HTMLElement) {
		const container = this.parentElement.parentElement.parentElement.querySelector('article');
		const stories = document.body.querySelectorAll('main > article section');
		const buttons = this.parentElement.parentElement.querySelectorAll('button');

		buttons.forEach((button) => {
			button.classList.remove('active');
			button.classList.remove('inv');
		});
		this.classList.add('active');

		let reverse = true;
		if (container.dataset.sort === this.dataset.sort) {
			reverse = false;
			container.dataset.sort = 'reverse';
		} else {
			container.dataset.sort = this.dataset.sort;
		}

		stories.forEach((story: HTMLElement) => {
			let input = parseInt(story.dataset[this.dataset.sort], 10) || 0;
			if (input > 10000000000) {
				input = input / 1000;
			}
			if (reverse) {
				story.style.order = (input * -1).toString();
			} else {
				story.style.order = input.toString();
				this.classList.add('inv');
			}
		});
	}

	public static renderLogin(this: any) {
		return new Promise((resolve, reject) => {
			if (!this.panel) {
				this.UI = new UITools();
				const submit = this.UI.CreateText('Log in', null, null, 'button');
				submit.addEventListener('click', Renderer.submitLogin);
				this.panel = new VPanel('Login', [
					this.UI.CreateInputText(
						this.UI.CreateLabel('Naam'),
						'name',
						'text',
						true,
					),
					this.UI.CreateInputText(
						this.UI.CreateLabel('Wachtwoord'),
						'password',
						'password',
						true,
					),
					submit,
				]);
			} else {
				this.panel.Enable();
			}
			resolve();
		});
	}

	public static submitLogin(this: any) {
		// const panel = this.parentElement.parentElement;
		const name = document.querySelector('[name=name]') as HTMLInputElement;
		const pass = document.querySelector('[name=password]') as HTMLInputElement;
		if (name.value.length === 0 && pass.value.length === 0) {
			console.warn('missing input');
		} else {
			const API = new XMLHttpRequest();
			API.open('POST', '/login');
			API.setRequestHeader('Content-Type', 'application/json');
			API.onload = function() {
				const res = JSON.parse(this.response);
				if (res.status === 'ok' || res.status === 'new') {
					window.location.reload();
				}
			};

			API.send(JSON.stringify({
				name: name.value,
				pass: pass.value,
			}));
		}
	}

	public static favHandler(this: HTMLInputElement) {
		if (document.body.classList.contains('user')) {
			const button = this;
			const API = new XMLHttpRequest();
			API.open('POST', '/fav');
			API.setRequestHeader('Content-Type', 'application/json');
			API.onload = function() {
				const res = JSON.parse(this.response);
				if (res.status === 'ok') {
					button.parentElement.dataset.myfav = '1';
					button.parentElement.classList.add('fav');
					button.classList.add('active');
				}
			};
			API.send(JSON.stringify({
				id: this.parentElement.dataset.id,
			}));
		} else {
			const userBtn = document.querySelector('#user') as HTMLElement;
			userBtn.click();
		}
	}

	public static storeHandler(this: HTMLElement) {
		console.log(this);
	}

}
