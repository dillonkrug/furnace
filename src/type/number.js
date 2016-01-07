import furnace from '../core';

furnace
	.define('number', () => ({
		construct (event) {

		},
		validate ({ value }) {
			return (typeof value === 'number');
		}
	}));
