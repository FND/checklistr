(function() {

function init() {
	const store = new Store("checklists.json");

	store.load().
		then(checklists => {
			Object.keys(checklists).forEach(id => {
				let list = Checklist.fromJSON(id, checklists[id]);
				document.body.appendChild(list.render());
			});
		});
}

function Checklist(id, caption, items) {
	this.id = id;
	this.caption = caption;
	this.items = items;

	this.onChange = this.onChange.bind(this);
}
Checklist.fromJSON = function(id, payload) {
	let items = payload.items.map(item => ChecklistItem.fromJSON(item));
	return new this(id, payload.caption, items);
};
Checklist.prototype.render = function() {
	let dom = createElement;
	let list = dom("section", { class: "checklist" }, [
		dom("h3", { id: "checklist-" + this.id }, this.caption),
		dom("ol", null, this.items.map(item => item.render("li")))
	]);

	list.addEventListener("change", this.onChange);

	return list;
};
Checklist.prototype.onChange = function(ev) {
	let target = ev.target;
	let node = target.closest(".checklist-item");

	item = node["checklist-item"];
	item.done = !!target.checked;

	replaceNode(node, item.render("li")); // XXX: slightly hacky due to tag name
};

function ChecklistItem(desc, done) {
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

function Store(uri) {
	this.uri = uri;
}
Store.prototype.load = function() {
	return http("GET", this.uri).
		then(res => res.json()).
		then(payload => {
			this.data = payload;
			return this.data;
		});
};
Store.prototype.save = function() {
	return http("PUT", this.uri, null, JSON.stringify(this.data)).
		then(res => {
			assertStatus(res, [200, 201], "error saving");
		});
};

var polyfills = [];
if(!window.fetch) {
	polyfills.push("fetch.js");
}
loadScripts(polyfills, init);

function replaceNode(oldNode, newNode) {
	var container = oldNode.parentNode;
	container.insertBefore(newNode, oldNode);
	container.removeChild(oldNode);
};

// adapted from <https://github.com/roca-components/declarative-rendering>
function createElement(tag, params, children) {
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

function http(method, uri, headers, payload) {
	let options = { method: method, credentials: "same-origin" };
	if(headers) {
		options.headers = headers;
	}
	if(payload) {
		options.body = payload;
	}
	// XXX: DEBUG
	//return fetch(uri, options);
	console.log(method, uri, { headers: headers, payload: payload });
	let checklists = {
		foo: {
			caption: "Hello World",
			items: [{
				desc: "lorem ipsum",
				done: true
			}, {
				desc: "dolor sit amet"
			}]
		}
	};
	return Promise.resolve({ json: _ => Promise.resolve(checklists) });
}

function assertStatus(response, status, msg) {
	let code = response.status;
	let error = status.pop ? status.includes(code) : code !== status;
	if(error) {
		let err = new Error(msg);
		err.status = status; // XXX: hacky
		throw err;
	}
}

// tiny script loader <https://gist.github.com/FND/69a7d6d59c7774a5ddb54cd93156a1fc>
function loadScripts(t,e){if(!t.length)return void(e&&e());t=t.slice();var r=t.shift();loadScript(r,function(){t.length?loadScripts(t,e):e&&e()},function(){throw new Error("failed to load script "+r)})}function loadScript(t,e,r){var n=document.createElement("script");n.addEventListener("load",e),r&&n.addEventListener("error",r),n.src=t,document.head.appendChild(n)}

}());
