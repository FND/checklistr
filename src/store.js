import http, { assertStatus } from "./http";

export default class Store {
	constructor(uri) {
		this.uri = uri;
	}

	update(id, value) {
		this.data[id] = value;
		return this.save();
	}

	load() {
		return http("GET", this.uri).
			then(res => res.json()).
			then(payload => {
				this.data = payload;
				return this.data;
			});
	}

	save() {
		return http("PUT", this.uri, null, JSON.stringify(this.data)).
			then(res => {
				assertStatus(res, [200, 201], "error saving");
			});
	}
}
