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

		let refs = {};
		if(this.editMode) {
			this.node = dom(tag, params, [
				dom("form", { ref: [refs, "form"] }, [
					dom("input", { type: "text", value: this.desc }),
					dom("button", null, "💾 save")
				])
			]);
			refs.form.addEventListener("submit", this.onSave);
		} else {
			this.node = dom(tag, params, [
				dom("label", null, [
					dom("input", {
						type: "checkbox",
						checked: !!this.done,
						ref: [refs, "cbox"]
					}),
					this.desc
				]),
				dom("button", { ref: [refs, "btn"] }, "✎ edit")
			]);
			refs.cbox.addEventListener("change", this.onChange);
			refs.btn.addEventListener("click", this.onEdit);
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
