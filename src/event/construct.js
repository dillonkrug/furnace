import furnace from '../core';

export class ConstructEvent {
		constructor ([ instance, args ], context) {
			// console.log('construct event', args);
			this.args = args;
			this.context = context;
			this.target = instance;
		}
		call (fn) {
			fn(this);
		}
		return () {
			return this.target;
		}
	}

furnace.event('construct', ConstructEvent);
