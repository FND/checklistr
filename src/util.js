export function bindMethodContext(ctx, ...methods) {
	methods.forEach(name => {
		ctx[name] = ctx[name].bind(ctx);
	});
}
