import furnace from './core';

furnace
	.define('required', () => ({
		validate ({ data, context }) {
			console.log(context.$path());
			return !!data;
		}
	}))
	.define('enum', (arr) => ({
		validate ({ value }) {
			return arr.indexOf(value) >= 0;
		}
	}))
	.define('regex', (regex) => ({
		validate ({ value }) {
			return regex.test(value);
		}
	}));
