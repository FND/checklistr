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

// generates a DOM element
// `params` describe attributes and/or properties, as determined by the
// respective type (string or boolean attributes vs. arbitrary properties)
// if a `ref` parameter is provided, it is expected to contain a `[refs, id]`
// tuple; `refs[id]` will be assigned the respective DOM node
// `children` is an array of strings or DOM elements - for convenience, the
// array may be omitted when passing only a single entity
// adapted from <https://github.com/roca-components/declarative-rendering>
export function createElement(tag, params, children = []) {
	params = params || {};
	if(!children.pop) {
		children = [children];
	}

	let node = document.createElement(tag);
	Object.keys(params).forEach(param => {
		let value = params[param];
		// special-casing for node references
		if(param === "ref") {
			let [registry, name] = value;
			registry[name] = node;
			return;
		}
		// boolean attributes (e.g. `<input … autofocus>`)
		if(value === true) {
			value = "";
		} else if(value === false) {
			return;
		}
		// attributes vs. properties
		if(value.substr) {
			node.setAttribute(param, value);
		} else {
			node[param] = value;
		}
	});

	children.forEach(child => {
		node.appendChild(child.substr ? document.createTextNode(child) : child);
	});

	return node;
}
