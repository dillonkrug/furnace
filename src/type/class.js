import furnace from '../core';

class FurnaceClass {
	constructor (...args) {
		this.$furnace.$emit('construct', [this, args]);
	}
}

furnace
	.define('class', () => ({
		compile (event) {
			// console.log('compiling class');
			event.target = class extends FurnaceClass {};
			event.target.$furnace = event.target.prototype.$furnace = event.context;
		}
	}));
