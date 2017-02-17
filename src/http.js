export default function http(method, uri, headers, payload) {
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

export function assertStatus(response, status, msg) {
	let code = response.status;
	let error = status.pop ? status.includes(code) : code !== status;
	if(error) {
		let err = new Error(msg);
		err.status = status; // XXX: hacky
		throw err;
	}
}
