import furnace from '../core';

export class ValidationEvent {
	constructor ([ data, parent ], context) {
		this.data = data;
		this.parent = parent;
		this.context = context;
		this.target = null;
		this.errors = [];
	}
	call (fn) {
		fn(this);
	}
	addError (msg) {
		this.errors.push(msg);
	}
	return () {
		if (this.errors.length) {
			return this.errors;
		}
		return true;
	}
}

furnace.event('validate', ValidationEvent);
