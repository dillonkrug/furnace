furnace
=======

### WORK IN PROGRESS

Furnace — Furnace is an *extremely* experimental library for creating composed classes.


Example

```javascript

furnace
	.define('hasName', () => ({
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


var Person = furnace.compile({
	class: true,
	hasName: true,
	schema: {
		age: {
			number: true
		}
	},
	methods: {
		growUp () {
			this.age++;
		}
	}
});

var joe = new Person({
	name: 'Joe',
	age: 24
});

joe.sayHello();
// => "Hello, I am Joe"


```


