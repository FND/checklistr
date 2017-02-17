/* eslint-env node */
"use strict";

let path = require("path");
let commonjs = require("rollup-plugin-commonjs");
let nodeResolve = require("rollup-plugin-node-resolve");

let PKG = "node_modules/**";

module.exports = generateConfig("./src/index.js", "./dist/bundle.js");

function generateConfig(entryPoint, target, options = {}) {
	let { moduleName, externals, extensions } = options;
	let format = options.format || "iife";

	let resolve = { jsnext: true };
	if(extensions) {
		resolve.extensions = [".js"].concat(extensions);
	}

	let cfg = {
		entry: path.resolve(entryPoint),
		dest: path.resolve(target),
		format,
		plugins: [
			nodeResolve(resolve),
			commonjs({ include: PKG })
		]
	};

	if(moduleName) {
		cfg.moduleName = moduleName;
	}

	if(externals) { // excluded from bundle
		cfg.external = Object.keys(externals);
		cfg.globals = externals;
	}

	return cfg;
};
