import { dispatchEvent, replaceNode, createElement } from "../dom";

export default class ChecklistItem {
	constructor(desc, done) {
		this.desc = desc;
		this.done = !!done;

		this.onEdit = this.onEdit.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onChange = this.onChange.bind(this);
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

	render(tag, editMode) {
		let cls = "checklist-item";
		let params = {
			class: this.done ? cls + " done" : cls,
			"checklist-item": this // XXX: memory leak?
		};

		let dom = createElement;
		if(editMode) {
			let form = dom("form", null, [
				dom("input", { type: "text", value: this.desc }),
				dom("button", null, "💾 save")
			]);

			form.addEventListener("submit", this.onSave);
			return dom(tag, params, form);
		} else {
			let btn = dom("button", null, "✎ edit");
			let field = dom("label", null, [
				dom("input", { type: "checkbox", checked: !!this.done }),
				this.desc
			]);

			field.addEventListener("change", this.onChange);
			btn.addEventListener("click", this.onEdit);
			return dom(tag, params, [field, btn]);
		}
	}

	onEdit(ev) {
		let btn = ev.target;
		let el = btn.closest(".checklist-item");

		replaceNode(el, this.render(el.nodeName, true));
	}

	onSave(ev) {
		let field = ev.target.closest(".checklist-item"). // TODO: DRY
			querySelector("input[type=text]");
		this.desc = field.value;
		this.onChange(ev); // XXX: slighly hacky
	}

	onChange(ev) {
		dispatchEvent(ev.target, "checklist-item-update", this, { bubbles: true });
	}
}
