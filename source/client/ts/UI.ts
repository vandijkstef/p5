// TODO: Theres probably an updated version in EG
export class UITools {

	// Creators
	// Base
	public CreateText(text: string, classes?: [string], id?: string, elementName: string = 'p') {
		const element: any = this.Create(classes, id, elementName);
		if (typeof(text) === 'string') {
			element.innerText = text;
		} else {
			element.appendChild(text);
		}
		return element;
	}

	public CreateHTML(text: string, classes?: [string], id?: string, elementName: string = 'p') {
		const element: any = this.Create(classes, id, elementName);
		element.innerHTML = text;
		return element;
	}

	public CreateLink(text: string, path: string, classes?: [string], id?: string) {
		const element: HTMLAnchorElement = this.CreateText(text, classes, id, 'a');
		element.href = path;
		return element;
	}

	public CreateImage(src: string, title: string, classes?: [string], id?: string) {
		const element: HTMLImageElement = this.Create(classes, id, 'img');
		element.src = src;
		element.alt = title;
		return element;
	}

	public CreateSVG(src: string, title: string, classes: [string], id: string, cacheIcon: boolean = false) {
		// TODO: Rework so it can function without API, unless required. Maybe use export class constructor for this?
		// const element = this.Create(classes, id, 'div');
		// const iconCache = localStorage.getItem(src);
		// if (!iconCache) {
		// 	const api = new XMLHttpRequest();
		// 	api.open('GET', src, true);
		// 	api.onload = () => {
		// 		if (cacheIcon) {
		// 			localStorage.setItem(src, api.responseText);
		// 		}
		// 		element.innerHTML = api.responseText;
		// 	};
		// 	api.send();
		// } else {
		// 	element.innerHTML = iconCache;
		// }
		// return element;
	}

	public CreateList(items: HTMLLIElement[], classes: [string], id: string, type: string = 'ul') {
		const element: HTMLElement = this.Create(classes, id, type);
		items.forEach((item) => {
			element.appendChild(item);
		});
		return element;
	}

	public CreateListItem(text: string, path?: string, classes?: [string], id?: string) {
		let element: HTMLElement;
		if (path && path.length > 0) {
			element = this.Create(classes, id, 'li');
			const link = this.CreateLink(text, path);
			element.appendChild(link);
		} else {
			element = this.CreateText(text, classes, id, 'li');
		}
		return element;
	}

	// Form
	public CreateLabel(text: string, classes?: [string], id?: string) {
		const element: HTMLLabelElement = this.CreateText(text, classes, id, 'label');
		return element;
	}

	public CreateInputText(label: HTMLLabelElement, name: string, type: string = 'text', required: boolean = false, value: string = '', placeholder: string = ' ', classes?: [string]) {
		const input = this.CreateInput(name, type, required, value, placeholder, classes);
		if (type === 'checkbox' || type === 'radio') {
			label.classList.add('inline');
		}
		label.appendChild(input);
		return label;
	}

	public CreateForm(fields: HTMLLabelElement[], action: string = window.location.href, method: string = 'POST', classes?: [string], id?: string) {
		const submit = this.CreateInput(null, 'submit');
		submit.type = 'submit';
		fields.push(submit);

		const form = this.Wrap(fields, classes, id, 'form');
		form.action = action;
		form.method = method;

		return form;
	}

	public CreateInput(name: string, type: string = 'text', required: boolean = false, value: string = '', placeholder: string = ' ', classes?: [string]) {
		const input = this.Create(classes, name, 'input');
		input.type = type;
		if (type === 'submit') {
			return input;
		}
		input.name = name;
		input.value = value;
		if (type === 'hidden') {
			return input;
		}
		input.required = required;
		input.placeholder = placeholder;
		return input;
	}

	// CreateInputSet()

	// CreateInputRadio()

	// CreateInputCheckbox()

	// CreateInputSelect()
	// CreateSelectOption()

	// CreateForm()

	// CreateAudio()

	// Decorators

	public addHandler(element: HTMLElement, handler: EventListener, type: string = 'click') {
		element.addEventListener(type, handler);
		return element;
	}

	public addSafeClickHandler(element: HTMLElement, handler: EventListener) {
		element.addEventListener('mousedown', (e: Event) => {
			console.log('down');
		});
		element.addEventListener('mousemove', (e: Event) => {
			console.log('move');
		});
		element.addEventListener('mouseup', (e: Event) => {
			console.log('up');
		});
	}

	// Rendering

	// Render()
	public Wrap(elements: HTMLElement[], classes: [string] = [''], id: string = '', wrapperType: string = 'div') {
		const wrapper = this.Create(classes, id, wrapperType);
		elements.forEach((element) => {
			wrapper.appendChild(element);
		});
		return wrapper;
	}

	// WrapRender()

	// Private
	private Create(classes?: [string], id?: string, elementName: string = 'div') {
		const element: any = document.createElement(elementName);
		if (id) {
			this.AddID(element, id);
		}
		if (classes) {
			this.AddClasses(element, classes);
		}
		return element;
	}

	private AddID(element: HTMLElement, id: string) {
		element.id = id;
		return element;
	}

	private AddClasses(element: HTMLElement, classes: [string]) {
		classes.forEach((className) => {
			if (className.length > 0) {
				element.classList.add(className);
			}
		});
		return element;
	}
}
