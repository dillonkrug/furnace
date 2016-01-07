import furnace from '../core';

furnace
	.define('array', () => ({
		construct (event) {
			if (!Array.isArray(event.target)) {
				event.target = [];
			}
		}
	}));
