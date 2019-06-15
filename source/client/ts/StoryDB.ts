export class StoryDB {

	private stories: [object];

	constructor(callback) {
		this.getStories()
			.then((stories: [object]) => {
				this.stories = stories;
				this.parse();
				callback();
			});
	}

	public getAll() {
		return new Promise((resolve, reject) => {
			if (!this.stories) {
				reject('No stories');
			} else {
				resolve(this.stories);
			}
		});
	}

	private getStories() {
		return new Promise((resolve, reject) => {
			let stories;
			const storyString: string = localStorage.getItem('stories');
			if (!storyString) {
				fetch('/collection')
					.then((response) => {
						return response.json();
					})
					.then((data) => {
						data.forEach((entry) => {
							entry.rss.channel.item.forEach((item) => {
								if (!stories) {
									stories = [item];
								} else {
									stories.push(item);
								}
							});
						});
					})
					.then(() => {
						localStorage.setItem('stories', JSON.stringify(stories));
						resolve(stories);
					})
					.catch((err) => {
						reject(err);
					});
			} else {
				try {
					stories = JSON.parse(storyString) as [object];
				} catch (err) {
					reject(err);
					return;
				}
				resolve(stories);
			}
		});
	}

	private parse() {
		this.stories.forEach((story: any) => {
			story.id = story.title.split('(')[1].split(')')[0];
			story.title = story.title.split('(')[1].split('– ')[1];
		});
	}

}
