/* eslint-env browser */

// `emitter` is a DOM node
export function dispatchEvent(emitter, name, payload, options = {}) {
	if(payload) {
		options.detail = payload;
	}
	let ev = new CustomEvent(name, options);
	emitter.dispatchEvent(ev);
}

export function replaceNode(oldNode, newNode) {
	let container = oldNode.parentNode;
	container.insertBefore(newNode, oldNode);
	container.removeChild(oldNode);
};

// adapted from <https://github.com/roca-components/declarative-rendering>
export function createElement(tag, params, children) {
	if(!children) {
		children = [];
	} else if(!children.pop) {
		children = [children];
	}

	let node = document.createElement(tag);
	Object.keys(params || {}).forEach(param => {
		let value = params[param];
		// special-casing for boolean attributes (e.g. `<input … autofocus>`)
		if(value === true) {
			value = "";
		} else if(value === false) {
			return;
		}

		if(value.substr) { // attribute
			node.setAttribute(param, value);
		} else { // property
			node[param] = value;
		}
	});

	children.forEach(child => {
		if(child.substr) {
			child = document.createTextNode(child);
		}
		node.appendChild(child);
	});

	return node;
}
