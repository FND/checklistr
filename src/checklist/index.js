import ChecklistItem from "./item";
import { dispatchEvent, replaceNode, createElement } from "../dom";

export default class Checklist {
	constructor(id, caption, items) {
		this.id = id;
		this.caption = caption;
		this.items = items;

		this.onChange = this.onChange.bind(this);
	}

	static fromJSON(id, payload) {
		let items = payload.items.map(item => ChecklistItem.fromJSON(item));
		return new this(id, payload.caption, items);
	}

	render() {
		let params = {
			class: "checklist",
			checklist: this // XXX: memory leak?
		};

		let dom = createElement;
		let list = dom("section", params, [
			dom("h3", { id: "checklist-" + this.id }, this.caption),
			dom("ol", null, this.items.map(item => item.render("li")))
		]);

		list.addEventListener("change", this.onChange);

		return list;
	}

	onChange(ev) {
		let target = ev.target;
		let node = target.closest(".checklist-item");
		let list = node.closest(".checklist");

		let item = node["checklist-item"];
		item.done = !!target.checked;

		replaceNode(node, item.render("li")); // XXX: slightly hacky due to tag name

		// TODO: `ev.stopPropagation()` for encapsulation?
		dispatchEvent(list, "checklist-update", { id: this.id }, { bubbles: true });
	}
}
