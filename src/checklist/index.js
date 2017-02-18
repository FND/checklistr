import ChecklistItem from "./item";
import { dispatchEvent, replaceNode, createElement } from "../dom";
import { bindMethodContext } from "../util";

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
		let dom = createElement;
		let btn = dom("button", null, "⊕ add");
		let el = dom("section", { class: "checklist" }, [
			dom("h3", { id: "checklist-" + this.id }, this.caption),
			dom("ol", null, this.items.map(item => item.render("li"))),
			btn
		]);

		btn.addEventListener("click", this.onAdd);
		el.addEventListener("checklist-item-update", this.onChange);
		return el;
	}

	onAdd(ev) {
		this.items.push(new ChecklistItem());

		// re-render -- FIXME: discards UI state (e.g. other items' edit mode)
		let node = ev.target.closest(".checklist");
		replaceNode(node, this.render());
	}

	onChange(ev) {
		let target = ev.target;
		let node = target.closest(".checklist-item");
		let list = node.closest(".checklist");

		let item = node["checklist-item"];
		item.done = !!target.checked;

		replaceNode(node, item.render(node.nodeName));

		// TODO: `ev.stopPropagation()` for encapsulation?
		let payload = {
			id: this.id,
			state: this.toJSON()
		};
		dispatchEvent(list, "checklist-update", payload, { bubbles: true });
	}
}
