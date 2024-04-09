import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
	constructor() {
		console.log( "Time File" );
		super();
		this.start = Date.now();
		this.current = this.start;
		this.elapsed = 0; 
		this.delta = 16;

		window.requestAnimationFrame( () => {
			this.Tick();
		} );
	}
	// Game loop
	Tick() {
		const currentTime = Date.now();
		this.delta = currentTime - this.current;
		this.current = currentTime;
		this.elapsed = this.current - this.start;
        
		// Event emitter trigger 
		this.trigger( "tick" );
        
		window.requestAnimationFrame( () => {
			this.Tick();
		} );
	}
}