import furnace from '../core';

furnace
	.define('object', () => ({
		construct (event) {
			event.target = {};
		}
	}));
