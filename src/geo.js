import furnace from './core';

furnace
	.define('geo:us:state', () => ({
		string: true,
		enum: ['NY', 'TX', 'CA']
	}))
	.define('geo:us:zipcode', () => ({
		string: true,
		regex: /^\d{5}$/
	}))
	.define('geo:lnglat', () => ({
		array: {
			elements: [{
				number: 'float',
				min: -180,
				max: 180
			}, {
				number: 'float',
				min: -90,
				max: 90
			}]
		}
	}));
