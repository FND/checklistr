import ChecklistItem from "./item";
import { dispatchEvent } from "uitil/dom/events";
import { replaceNode } from "uitil/dom";
import { createElement as dom } from "uitil/dom/create";
import bindMethodContext from "uitil/method_context";

export default class Checklist {
	constructor(id, caption, items) {
		this.id = id;
		this.caption = caption;
		this.items = items;

		bindMethodContext(this, "onAdd", "onChange");
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
		let refs = {};
		let el = dom("section", { class: "checklist" }, [
			dom("h3", { id: "checklist-" + this.id }, this.caption),
			dom("ol", null, this.items.map(item => item.render("li"))),
			dom("button", { ref: [refs, "btn"] }, "⊕ add")
		]);
		refs.btn.addEventListener("click", this.onAdd);
		el.addEventListener("checklist-item-update", this.onChange);

		if(this.node) { // refresh
			replaceNode(this.node, el);
		}
		this.node = el;
		return el;
	}

	onAdd(ev) {
		this.items.push(new ChecklistItem());
		this.render();
	}

	onChange(ev) {
		let payload = {
			id: this.id,
			state: this.toJSON()
		};
		dispatchEvent(this.node, "checklist-update", payload, { bubbles: true });
	}
}
