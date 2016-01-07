import furnace from './core';

furnace
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
	}));
