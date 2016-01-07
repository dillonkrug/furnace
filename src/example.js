import furnace from './index';

furnace
	.define('saysHello', () => ({
		schema: {
			name: {
				string: true
			}
		},
		methods: {
			sayHello () {
				console.log(`Hello, I am ${this.name}`);
			}
		}
	}));


var Address = furnace.compile({
	class: true,
	compile (event) {
		// console.log('Address Compiling', event.target);
	},
	schema: {
		street: {
			string: true,
			required: true
		},
		suite: {
			string: true
		},
		city: {
			string: true,
			required: true
		},
		state: 'geo:us:state',
		zip: 'geo:us:zipcode',
		ll: 'geo:lnglat'
	},
	saysHello: true,
	methods: {
		format () {
			return `
			${this.street}
			${this.suite}
			${this.city}, ${this.state} ${this.zip}
			`;
		}
	}
});

// console.log(Address);

var addr = new Address({
	name: 'an address',
	street: 'asdf',
	suite: '#1',
	city: 'asdf',
	state: 'CA',
	zip: '19237',
	ll: [-72, 42]
});
console.log(addr, typeof addr.format, addr.format());
addr.sayHello();

