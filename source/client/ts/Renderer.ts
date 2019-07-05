import { UITools } from './UI.js';
import { VPanel } from './vPanel.js';

export class Renderer {

	public static set() {
		// Header
		const user = document.querySelector('#user');
		user.addEventListener('click', Renderer.renderLogin);
		const infopanel = document.querySelector('#info') as any;
		if (infopanel) {
			infopanel.addEventListener('click', () => {
				infopanel.UI = new UITools();
				infopanel.panel = new VPanel('Uw verhalen', [
					infopanel.UI.CreateText('Op deze website kunt u geinspireerd raken voor uw volgende reis. Op basis van uw type bestemming hebben we een collectie met interessante verhalen.'),
					infopanel.UI.CreateText('Indien u een account aanmaakt worden uw favoriete verhalen automatisch opgeslagen. Zo kunt u ook in het vliegtuig alvast wegdromen.'),
				]);
			});
		}

		// Onpage
		const login = document.querySelector('[href="#login"]');
		if (login) {
			login.addEventListener('click', Renderer.renderLogin);
		}
		const toHero = document.querySelector('[href="#hero"]');
		if (toHero) {
			toHero.addEventListener('click', Renderer.toHero);
			const hero = document.querySelector('#hero');
			hero.classList.add('hidden');
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

						const titleLink: any = UI.CreateLink(
							UI.CreateText(entry.title, null, null, 'h3'),
							`#${entry.id}`,
						);
						titleLink.dataset.id = entry.id;
						titleLink.story = entry;

						const favCount = Math.floor(Math.random() * 100);
						const fav = UI.CreateHTML(`<i class="fas fa-heart"></i>`, null, null, 'button');
						fav.addEventListener('click', Renderer.favHandler);
						fav.classList.add('fav');

						const share = UI.CreateHTML('<i class="fas fa-share-alt"></i>', null, null, 'button');
						share.story = entry;
						share.classList.add('share');
						share.addEventListener('click', Renderer.shareHandler);

						const seasonID = Math.round(Math.random() * 2);
						let season = 'fas fa-sun';
						let seasonName = 'Zomer';
						if (seasonID === 1) {
							season = 'fas fa-city';
							seasonName = 'Weekend';
						} else if (seasonID === 2) {
							season = 'far fa-snowflake';
							seasonName = 'Winter';
						}

						const section = UI.Wrap([
							titleLink,
							UI.Wrap([
								UI.CreateHTML(`<i class="far fa-comment-alt"></i> ${entry['slash:comments']}`, null, null, 'p'),
								UI.CreateHTML(`<i class="fab fa-gratipay"></i> ${favCount}`, null, null, 'p'),
								UI.CreateHTML(`<i class="${season}"></i> <span>${seasonName}</span>`, ['season'], null, 'p'),
							]),
							UI.Wrap([
								fav,
								share,
							], ['row']),
						], null, null, 'section');

						section.classList.add('story');
						section.story = entry;
						UI.addHandler(section, this.renderSingle);
						section.dataset.id = entry.id;
						section.dataset.pubdate = new Date(entry.pubDate).getTime();
						section.dataset.favs = favCount;
						section.dataset.comments = entry['slash:comments'];
						section.dataset.length = entry['content:encoded'].length;
						section.dataset.season = seasonID;

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

			if (document.body.classList.contains('user')) {
				const myFavBtn = UI.CreateText('Mijn favorieten', null, null, 'button');
				myFavBtn.dataset.sort = 'myfav';
				myFavBtn.addEventListener('click', Renderer.sortHandler);
				content.push(myFavBtn);
			}

			const lengthBtn = UI.CreateText('Lengte', null, null, 'button');
			lengthBtn.dataset.sort = 'length';
			lengthBtn.addEventListener('click', Renderer.sortHandler);
			content.push(lengthBtn);

			const dateBtn = UI.CreateText('Datum', null, null, 'button');
			dateBtn.dataset.sort = 'pubdate';
			dateBtn.addEventListener('click', Renderer.sortHandler);
			content.push(dateBtn);

			const summerBtn = UI.CreateHTML('<i class="fas fa-sun"></i>', ['action'], null, 'button');
			summerBtn.dataset.filter = '0';
			summerBtn.addEventListener('click', Renderer.filterHandler);
			content.push(summerBtn);

			const weekendBtn = UI.CreateHTML('<i class="fas fa-city"></i>', ['action'], null, 'button');
			weekendBtn.dataset.filter = '1';
			weekendBtn.addEventListener('click', Renderer.filterHandler);
			content.push(weekendBtn);

			const winterBtn = UI.CreateHTML('<i class="far fa-snowflake"></i>', ['action'], null, 'button');
			winterBtn.dataset.filter = '2';
			winterBtn.addEventListener('click', Renderer.filterHandler);
			content.push(winterBtn);

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
		const stories = document.body.querySelectorAll('section#filtersc article > section');
		const buttons = this.parentElement.parentElement.querySelectorAll('button');

		buttons.forEach((button) => {
			if (!button.classList.contains('action')) {
				button.classList.remove('active');
				button.classList.remove('inv');
			}
		});
		this.classList.add('active');

		let reverse = true;
		if (container.dataset.sort === this.dataset.sort) {
			reverse = false;
			container.dataset.sort = 'reverse';
		} else {
			container.dataset.sort = this.dataset.sort;
		}
		console.log('the', stories);
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

	public static filterHandler(this: any) {
		if (this.classList.contains('inv')) {
			this.classList.remove('inv');
			// Enable items;
			const stories = document.querySelectorAll('#filtersc article > section');
			stories.forEach((story: HTMLElement) => {
				if (story.dataset.season === this.dataset.filter) {
					story.classList.remove('hidden');
				}
			});
		} else {
			this.classList.add('inv');
			// Disable items;
			const stories = document.querySelectorAll('#filtersc article section');
			stories.forEach((story: HTMLElement) => {
				if (story.dataset.season === this.dataset.filter) {
					console.log(story);
					story.classList.add('hidden');
				}
			});
		}
	}

	public static renderLogin(this: any) {
		return new Promise((resolve, reject) => {
			if (!this.panel) {
				this.UI = new UITools();
				if (!document.body.classList.contains('user')) {
					const submit = this.UI.CreateText('Log in', null, null, 'button');
					submit.addEventListener('click', Renderer.submitLogin);
					const email = this.UI.CreateInputText(
						this.UI.CreateLabel('Emailadres'),
						'email',
						'email',
						true,
					);
					email.classList.add('hidden');
					const newUser = this.UI.CreateInputText(
						this.UI.CreateLabel('Nieuwe gebruiker'),
						'newuser',
						'checkbox',
					);
					newUser.querySelector('input').addEventListener('change', () => {
						email.classList.toggle('hidden');
					});
					this.panel = new VPanel('Login', [
						this.UI.CreateText('De combinatie van wachtwoord en gebruikersnaam is onbekend', ['hidden', 'error']),
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
						newUser,
						email,
						submit,
					]);
				} else {
					const username = this.querySelector('span').innerText;
					const logout = this.UI.CreateText('Log uit', null, null, 'button');
					logout.addEventListener('click', () => {
						window.location.href = '/logout';
					});
					this.panel = new VPanel(username, [
						logout,
					]);
				}
			} else {
				this.panel.Enable();
			}
			resolve();
		});
	}

	public static renderSingle(this: any, e) {
		switch (e.target.tagName) {
			case 'SECTION':
			case 'DIV':
			case 'H3':
			case 'A':
			case 'P':
				if (!document.querySelector('#single')) {
					const UI = new UITools();

					const hero = document.querySelector('#hero');
					const main = document.querySelector('main');
					hero.classList.add('hidden');
					main.classList.add('hidden');

					const content = document.createElement('div');
					content.innerHTML = this.story['content:encoded'];

					const back = UI.CreateHTML('<i class="fas fa-angle-left"></i>', ['none', 'back'], null, 'button');
					UI.addHandler(back, () => {
						const storyDOM = document.querySelector('#single');
						storyDOM.parentElement.removeChild(storyDOM);
						hero.classList.remove('hidden');
						main.classList.remove('hidden');
					});

					const comments = UI.CreateHTML(`<i class="fas fa-comment"></i> ${this.story['slash:comments']}`, ['none', 'comment'], null, 'button');

					const fav = UI.CreateHTML(`<i class="fas fa-heart"></i>`, null, null, 'button');
					fav.addEventListener('click', Renderer.favHandlerSingle);
					fav.classList.add('fav');
					console.log(this);
					if (this.classList.contains('fav')) {
						fav.classList.add('active');
					}

					const story = UI.Wrap([
						UI.Wrap([
							UI.Wrap([
								back,
							]),
							UI.Wrap([
								comments,
								fav,
							]),
						]),
						UI.Wrap([
							UI.CreateText(this.story.title, null, null, 'h1'),
							content,
						], null, null, 'section'),
					], null, 'single', 'section');
					story.dataset.id = this.story.id;
					document.body.appendChild(story);
					window.scrollTo(0, 0);
				}
				break;
			default:
				break;
		}
	}

	public static submitLogin(this: any) {
		const name = document.querySelector('[name=name]') as HTMLInputElement;
		const pass = document.querySelector('[name=password]') as HTMLInputElement;
		const newUser = document.querySelector('[name=newuser]') as HTMLInputElement;
		const email = document.querySelector('[name=email]') as HTMLInputElement;
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
				} else if (res.status === 'bad' || res.status === 'unknown') {
					document.querySelector('.hidden.error').classList.remove('hidden');
				} else {
					console.warn(res);
				}
			};

			API.send(JSON.stringify({
				name: name.value,
				pass: pass.value,
				newuser: newUser.checked,
				email: email.value,
			}));
		}
	}

	public static favHandler(this: HTMLInputElement) {
		if (document.body.classList.contains('user')) {
			const button = this;
			const API = new XMLHttpRequest();
			const remove = this.classList.contains('active') ? true : false;
			API.open('POST', '/fav');
			API.setRequestHeader('Content-Type', 'application/json');
			API.onload = function() {
				const res = JSON.parse(this.response);
				if (res.status === 'ok') {
					button.parentElement.parentElement.dataset.myfav = '1';
					button.classList.add('active');
				} else if (res.status === 'removed') {
					button.parentElement.parentElement.dataset.myfav = '0';
					button.classList.remove('active');
				}
			};
			console.log(this.parentElement.parentElement.dataset);
			API.send(JSON.stringify({
				id: this.parentElement.parentElement.dataset.id,
				remove: `${remove}`,
			}));
		} else {
			const userBtn = document.querySelector('#user') as HTMLElement;
			userBtn.click();
		}
	}

	public static favHandlerSingle(this: any) {
		if (document.body.classList.contains('user')) {
			const button = this;
			const API = new XMLHttpRequest();
			const remove = this.classList.contains('active') ? true : false;
			API.open('POST', '/fav');
			API.setRequestHeader('Content-Type', 'application/json');
			API.onload = function() {
				const res = JSON.parse(this.response);
				if (res.status === 'ok') {
					button.classList.add('active');
				} else if (res.status === 'removed') {
					button.classList.remove('active');
				}
			};
			const storyDOM = document.querySelector('#single') as HTMLElement;
			const storyID = storyDOM.dataset.id;
			API.send(JSON.stringify({
				id: storyID,
				remove: `${remove}`,
			}));
		} else {
			const userBtn = document.querySelector('#user') as HTMLElement;
			userBtn.click();
		}
	}

	public static shareHandler(this: any) {
		const navi: any = navigator;
		if (navi.share) {
			navi.share({
				title: this.story.title,
				text: 'Lees nu ' + this.story.title,
				url: 'https://stefvandijk.nl/',
			});
		} else {
			console.log(this);
		}
	}

	public static toHero(this: HTMLElement) {
		const hero = document.querySelector('#hero');
		hero.classList.remove('hidden');
		this.parentElement.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement.parentElement);
	}

}
