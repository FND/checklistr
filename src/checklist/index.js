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

	toJSON() {
		return {
			id: this.id,
			caption: this.caption,
			items: this.items.map(item => item.toJSON())
		};
	}

	render() {
		let dom = createElement;
		let list = dom("section", { class: "checklist" }, [
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
		let payload = {
			id: this.id,
			state: this.toJSON()
		};
		dispatchEvent(list, "checklist-update", payload, { bubbles: true });
	}
}
