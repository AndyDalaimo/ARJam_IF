import EventEmitter from "./EventEmitter.js";

export default class Sizes extends EventEmitter {
	constructor() {
		console.log( "Sizes File" );
		super();
		// Setup 
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.pixelRatio = Math.min( window.devicePixelRatio, 2 );
       
		window.addEventListener( 'resize', () => {
			// Update sizes
			this.width = window.innerWidth;
			this.height = window.innerHeight;
         
			this.trigger( "resize" );
		} );
	}
}