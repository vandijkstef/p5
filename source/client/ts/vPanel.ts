import { UITools } from './UI.js';

interface IvPanelCloser extends HTMLElement {
	panel?: VPanel;
}

export class VPanel {
	private DOM: HTMLElement;
	private panel: HTMLElement;
	private title: string;
	private UI: UITools;
	private closer: HTMLElement;

	constructor(title: string, contents: HTMLElement[] = []) {
		this.UI = new UITools();

		this.title = title;

		this.DOM = document.createElement('div');
		this.DOM.classList.add('vPanel');
		this.DOM.addEventListener('click', this.Close);

		this.panel = document.createElement('div');
		this.DOM.appendChild(this.panel);

		this.AddContent(contents, true);

		this.closer = this.UI.CreateText('x', ['closer']);
		this.panel.appendChild(this.closer);
		this.ActivateCloser(this.closer);

		document.body.appendChild(this.DOM);
	}

	public Enable(): void {
		this.DOM.classList.remove('disabled');
	}

	public ActivateCloser(closer: IvPanelCloser) {
		closer.panel = this;
		closer.addEventListener('click', this.ClosePanel);
	}

	public AddContent(content: HTMLElement[] = [], refresh: boolean) {
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
		if (e.target === this) {
			this.panel.DOM.classList.add('disabled');
		}
	}

	private Close(this: HTMLElement, e: Event) {
		if (e.target === this) {
			this.classList.add('disabled');
		}
	}
}
