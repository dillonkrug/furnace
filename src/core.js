export default function furnace (spec, data) {
	return furnace.compile(spec);
}

// class FurnaceClass {
// 	constructor (...args) {
// 		this.$furnace.$emit('construct', [this, args]);
// 	}
// }

// `class` defines what is being created, as well as events to expect
// `required` listens for a `validate` event
// it all begins with the `compile` event
// various types can hook into the compile event.  They must set the event target.

export class Apex {
	constructor (parent, key) {
		Object.defineProperty(this, '$$parent', { value: parent });
		this.$$key = key;
		this.$$listeners = Object.create(null);
	}
	$on (name, fn) {
		var handlers = this.$$listeners[name] || (this.$$listeners[name] = []);
		if (Array.isArray(fn)) {
			for (var i = 0; i < fn.length; i++) {
				handlers.push(fn[i]);
			}
		} else {
			handlers.push(fn);
		}
	}
	$path () {
		if (!this.$$parent) {
			return;
		}
		var path = this.$$parent.$path();
		if (path) {
			path += '.' + this.$$key;
		} else {
			path = this.$$key;
		}
		return path;
	}
	$emit (name, args) {
		var listeners = this.$$listeners[name];
		if (!listeners || !listeners.length) {
			return;
		}
		var EventClass = furnace.event(name);
		var event = new EventClass(args, this);
		for (var i = 0; i < listeners.length; i++) {
			event.call(listeners[i]);
		}
		return event.return();
	}
}


furnace.$$defn = Object.create(null);
furnace.$$fn = Object.create(null);
furnace.define = function (id, defn) {
	furnace.$$defn[id] = defn;
	return furnace;
};

furnace.$$event = Object.create(null);
furnace.event = function (id, Class) {
	if (!Class) {
		if (!furnace.$$event[id]) {
			throw new Error(`Unknown event "${id}"`);
		}
		return furnace.$$event[id];
	}
	furnace.$$event[id] = Class;
	return furnace;
};

function getEvents (spec) {
	var stack = [spec], source, eventIds = [], events = Object.create(null);
	while ((source = stack.shift())) {
		for (var key in source) {
			if (typeof source[key] === 'function') {
				if (!events[key]) {
					eventIds.push(key);
					events[key] = [];
				}
				events[key].push(source[key]);
			} else {
				if (typeof furnace.$$defn[key] !== 'function') {
					throw new Error(`Unknown key ${key}`);
				}
				stack.push(furnace.$$defn[key](source[key]));
			}
		}
	}
	return [eventIds, events];
}

furnace.compile = function (spec, parent, key) {
	if (typeof spec === 'string') {
		var fn = furnace.$$defn[spec];
		spec = fn();
	}
	var target = new Apex(parent, key);
	var [eventIds, events] = getEvents(spec);
	// console.log('eventIds', eventIds);
	eventIds.forEach(id => {
		target[id] = function (...args) {
			// console.log('Args for ', id, args);
			return this.$emit(id, args);
		};
		target.$on(id, events[id]);
	});
	if (target.compile) {
		// console.log('typeof target.compile', typeof target.compile);
		return target.compile();
	}
	return target;
};

/*
furnace
	.define('class', () => ({
		compile (event) {
			console.log('compiling class');
			event.target = class extends FurnaceClass {};
			event.target.$furnace = event.target.prototype.$furnace = event.context;
		}
	}))
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
	.define('methods', (methods) => ({
		compile ({ target }) {
			Object
				.keys(methods)
				.forEach(key => {
					target.prototype[key] = methods[key];
				});
		}
	}))
	.define('array', () => ({
		construct (event) {
			if (!Array.isArray(event.target)) {
				event.target = [];
			}
		}
	}))
	.define('object', () => ({
		construct (event) {
			event.target = {};
		}
	}))
	.define('schema', schema => ({
		compile ({ context }) {
			Object
				.keys(schema)
				.forEach(key => {
					context[key] = furnace.compile(schema[key], context, key);
				});
		},
		construct ({ args: [ data ], target, context }) {
			Object
				.keys(schema)
				.forEach(key => {
					var ret = context[key].construct(data && data[key], data && data[key]);
					target[key] = ret;
				});
		},
		validate (event) {
			Object
				.keys(schema)
				.forEach(key => {
					event.context[key].$emit('validate', [event.data[key], event]);
				});
		}
	}))
	.define('string', () => ({
		construct (event) {

		},
		validate ({ value }) {
			return (typeof value === 'string');
		}
	}))
	.define('regex', (regex) => ({
		validate ({ value }) {
			return regex.test(value);
		}
	}))
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
	}))
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
		console.log('Address Compiling', event.target);
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

console.log(Address);

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
*/

