import furnace from '../core';

furnace
	.define('string', () => ({
		construct (event) {

		},
		validate ({ value }) {
			return (typeof value === 'string');
		}
	}));
