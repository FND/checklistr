import http, { assertStatus } from "./http";

export default function Store(uri) {
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
