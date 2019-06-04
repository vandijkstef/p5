import { StoryDB } from './StoryDB.js';
import { Renderer } from './Renderer.js';
import { Router } from './Router.js';
import { Hero } from './hero.js';

document.addEventListener('DOMContentLoaded', () => {
	Renderer.set();

	new Hero('#hero > section');
	
	const hero = document.querySelector('#hero');
	hero.addEventListener('click', function (e) {
		if (e.target !== this) {
			const DB = new StoryDB(() => {
				DB.getAll().then((stories: Array<any>) => {
					console.log(stories);
					const main = document.createElement('main');
					document.body.appendChild(main);

					Renderer.renderFilter().then((filter: HTMLElement) => {
						main.appendChild(filter);
						Renderer.renderStories(stories).then((storyDOM: HTMLElement) => {
							main.appendChild(storyDOM);
							const filterBtn = filter.querySelectorAll('button');
							if (filterBtn[1]) {
								filterBtn[1].click();
							}

							const recommendedStories = [
								stories[3],
								stories[75],
								stories[19],
								stories[33],
								stories[61],
								stories[24],
							];
							Renderer.renderStories(recommendedStories, 'recommended').then((recommended) => {

								const sectionRecommended = document.createElement('section');
								const title = document.createElement('h2');
								title.innerText = 'Aanbevolen';
								sectionRecommended.appendChild(title);
								sectionRecommended.appendChild(recommended);
								main.insertBefore(sectionRecommended, filter);

								Renderer.renderStories(stories, 'fav').then((favDOM) => {

									const favStories = favDOM.querySelectorAll('.story');
									if (favStories.length) {
										const sectionLiked = document.createElement('section');
										const title = document.createElement('h2');
										title.innerText = 'Favorieten';
										sectionLiked.appendChild(title);
										sectionLiked.appendChild(favDOM);

										main.insertBefore(sectionLiked, filter);
									}
								});
							});
						});
					});
				});
			});
		}
	});
});
