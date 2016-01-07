import furnace from './core';

furnace
	.define('methods', (methods) => ({
		compile ({ target }) {
			Object
				.keys(methods)
				.forEach(key => {
					target.prototype[key] = methods[key];
				});
		}
	}));
