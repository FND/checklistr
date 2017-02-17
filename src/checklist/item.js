import { createElement } from "../dom";

export default function ChecklistItem(desc, done) {
	this.desc = desc;
	this.done = !!done;
}

ChecklistItem.fromJSON = function(payload) {
	return new this(payload.desc, payload.done);
};

ChecklistItem.prototype.render = function(tag) {
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
};
