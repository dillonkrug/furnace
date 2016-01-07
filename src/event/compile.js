import furnace from '../core';

export class CompileEvent {
	constructor (args, context) {
		this.args = args;
		this.context = context;
	}
	call (fn) {
		fn(this);
	}
	return () {
		return this.target;
	}
}

furnace.event('compile', CompileEvent);
