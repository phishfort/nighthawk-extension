export default class Website {
	html: string;
	url: string;
	buttons: string;
	text: string;
	links: string;
	scripts: string;
	title: string;
	forms: string;
	images: string;
	js: string;

	constructor(document: Document) {
		this.html = document.documentElement.outerHTML;
		this.url = document.URL;
		this.buttons = this.getButtons();
		this.links = this.getLinks();
		this.js = this.getJs();
		this.scripts = this.getScripts();
		this.text = this.getText();
		this.title = this.getTitle();
		this.forms = this.getForms();
		this.images = this.getImages();
	}

	getButtons(): string {
		const buttons: any = document?.getElementsByTagName('button');
		const buttonList: string[] = [];
		for (const button of buttons) {
			buttonList.push(button.textContent);
		}
		return buttonList.toString();
	}

	getLinks(): string {
		const links: any = document?.getElementsByTagName('a');
		const linkList: string[] = [];
		for (const link of links) {
			linkList.push(link.textContent);
		}
		return linkList.toString();
	}

	getJs(): string {
		const scripts: any = document?.getElementsByTagName('script');
		const scriptList: string[] = [];
		for (const script of scripts) {
			scriptList.push(script.src);
		}
		return scriptList.toString();
	}

	getScripts(): string {
		const scripts: any = document?.getElementsByTagName('script');
		const scriptList: string[] = [];
		for (const script of scripts) {
			scriptList.push(script.textContent);
		}
		return scriptList.toString();
	}

	getText(): string {
		return document.body.textContent as string;
	}

	getTitle(): string {
		return document.title;
	}

	getForms(): string {
		const forms: any = document.getElementsByTagName('form');
		const formList: string[] = [];
		for (const form of forms) {
			formList.push(form.textContent);
		}
		return formList.toString();
	}

	getImages(): string {
		const images: any = document.getElementsByTagName('img');
		const imageList: string[] = [];
		for (const image of images) {
			imageList.push(image.src);
		}
		return imageList.toString();
	}

	toJSON() {
		return {
			html: this.html,
			url: this.url,
			text: this.text,
			links: this.links,
			scripts: this.scripts,
			title: this.title,
			forms: this.forms,
			images: this.images,
			js: this.js
		};
	}
}
