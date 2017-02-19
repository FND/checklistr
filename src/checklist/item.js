import { dispatchEvent, replaceNode, createElement as dom } from "../dom";
import { bindMethodContext } from "../util";

export default class ChecklistItem {
	constructor(desc, done) {
		this.desc = desc || "";
		this.done = !!done;

		bindMethodContext(this, "onEdit", "onSave", "onChange");
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
		// suppress re-rendering in edit mode to avoid discarding transient UI
		// state -- XXX: special-casing
		if(this.editMode && this.node.querySelector("input[type=text]")) {
			return this.node;
		}

		let { node } = this;
		tag = tag || node.nodeName;

		let cls = "checklist-item";
		let params = {
			class: this.done ? `${cls} done` : cls
		};

		if(this.editMode) {
			let form = dom("form", null, [
				dom("input", { type: "text", value: this.desc }),
				dom("button", null, "💾 save")
			]);

			form.addEventListener("submit", this.onSave);
			this.node = dom(tag, params, form);
		} else {
			let btn = dom("button", null, "✎ edit");
			let field = dom("label", null, [
				dom("input", { type: "checkbox", checked: !!this.done }),
				this.desc
			]);

			field.addEventListener("change", this.onChange);
			btn.addEventListener("click", this.onEdit);
			this.node = dom(tag, params, [field, btn]);
		}

		if(node) { // refresh
			replaceNode(node, this.node);
		}
		return this.node;
	}

	onEdit(ev) {
		this.editMode = true;
		this.render();
	}

	onSave(ev) {
		let desc = this.node.querySelector("input[type=text]").value;
		this.editMode = false;
		if(desc === this.desc) {
			this.render();
		} else {
			this.desc = desc;
			this.update();
		}
	}

	onChange(ev) {
		let { target } = ev;
		this.done = !!target.checked;
		this.update();
	}

	update() {
		this.render();
		dispatchEvent(this.node, "checklist-item-update", this, { bubbles: true });
	}
}
