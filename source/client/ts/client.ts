import { Hero } from './hero.js';
import { Renderer } from './Renderer.js';
import { StoryDB } from './StoryDB.js';

document.addEventListener('DOMContentLoaded', () => {
	Renderer.set();

	const heroBanner = new Hero('#hero > section');

	const hero = document.querySelector('#hero');
	hero.addEventListener('click', function(e) {
		if (e.target !== this && !hero.classList.contains('rendered')) {
			hero.classList.add('rendered');
			const DB = new StoryDB(() => {
				DB.getAll().then((stories: any[]) => {
					const main = document.createElement('main');
					document.body.appendChild(main);

					Renderer.renderFilter().then((filter: HTMLElement) => {
						main.appendChild(filter);
						Renderer.renderStories(stories).then((storyDOM: HTMLElement) => {
							filter.appendChild(storyDOM);
							const filterBtn = filter.querySelectorAll('button');
							if (filterBtn[1]) {
								filterBtn[1].click();
							}

							const seasons: any = document.querySelectorAll('button.action');
							switch (document.body.id) {
								case 'summer':
									seasons[1].click();
									seasons[2].click();
									break;
								case 'weekend':
									seasons[0].click();
									seasons[2].click();
									break;
								case 'winter':
									seasons[0].click();
									seasons[1].click();
									break;
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
								const recommendedTitle = document.createElement('h2');
								recommendedTitle.innerText = 'Aanbevolen';
								sectionRecommended.appendChild(recommendedTitle);
								sectionRecommended.appendChild(recommended);
								main.insertBefore(sectionRecommended, filter);

								Renderer.renderStories(stories, 'fav').then((favDOM) => {

									const favStories = favDOM.querySelectorAll('.story');
									if (favStories.length) {
										const sectionLiked = document.createElement('section');
										const favTitle = document.createElement('h2');
										favTitle.innerText = 'Favorieten';
										sectionLiked.appendChild(favTitle);
										sectionLiked.appendChild(favDOM);

										main.insertBefore(sectionLiked, filter);
										const bla = window as any;
										if (bla.dragscroll) {
											bla.dragscroll();
										}
									} else {
										const bla = window as any;
										if (bla.dragscroll) {
											bla.dragscroll();
										}
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
