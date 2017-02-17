import { createElement } from "../dom";

export default class ChecklistItem {
	constructor(desc, done) {
		this.desc = desc;
		this.done = !!done;
	}

	static fromJSON(payload) {
		return new this(payload.desc, payload.done);
	}

	toJSON() {
		return {
			desc: this.desc,
			done: this.done
		};
	}

	render(tag) {
		let cls = "checklist-item";
		let params = {
			class: this.done ? cls + " done" : cls,
			"checklist-item": this // XXX: memory leak?
		};

		let dom = createElement;
		return dom(tag, params, [
			dom("label", null, [
				dom("input", { type: "checkbox", checked: !!this.done }),
				this.desc
			])
		]);
	}
}
