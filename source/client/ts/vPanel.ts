import { UITools } from './UI.js';

interface IvPanelCloser extends HTMLElement {
	panel?: vPanel;
}

export class vPanel {
	private DOM: HTMLElement;
	private panel: HTMLElement;
	private title: string;
	private UI: UITools;

	constructor(title: string, contents: Array<HTMLElement> = []) {
		this.UI = new UITools();
		
		this.title = title;

		this.DOM = document.createElement('div');
		this.DOM.classList.add('vPanel');
		this.DOM.addEventListener('click', this.Close);
		
		this.panel = document.createElement('div');
		this.DOM.appendChild(this.panel);

		this.AddContent(contents, true);

		document.body.appendChild(this.DOM);
	}

	public Enable(): void {
		this.DOM.classList.remove('disabled');
	}

	public AddCloser(closer: IvPanelCloser) {
		closer.panel = this;
		closer.addEventListener('click', this.ClosePanel);
	}

	public AddContent(content: Array<HTMLElement> = [], refresh: boolean) {
		if (refresh) {
			this.Clear();
		}
		content.forEach((element) => {
			this.panel.appendChild(element);
		});
	}

	private Clear() {
		this.panel.innerHTML = '';
		const heading = this.UI.CreateText(this.title, null, null, 'h1');
		this.panel.appendChild(heading);
	}

	private ClosePanel(this: IvPanelCloser, e: Event) {
		if (e.target == this) {
			this.panel.DOM.classList.add('disabled');
		}
	} 

	private Close(this: HTMLElement, e: Event) {
		if (e.target == this) {
			this.classList.add('disabled');
		}
	}
}
