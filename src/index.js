import Checklist from "./checklist";
import Store from "./store";
import loadScripts from "./loader";

let polyfills = [];
if(!window.fetch) {
	polyfills.push("fetch.js");
}
loadScripts(polyfills, init);

function init() {
	const store = new Store("checklists.json");

	store.load().
		then(checklists => {
			Object.keys(checklists).forEach(id => {
				let list = Checklist.fromJSON(id, checklists[id]);
				let node = list.render();
				document.body.appendChild(node);
			});

			document.body.addEventListener("checklist-update", function(ev) {
				let { id, state } = ev.detail
				store.update(id, state);
			});
		});
}
