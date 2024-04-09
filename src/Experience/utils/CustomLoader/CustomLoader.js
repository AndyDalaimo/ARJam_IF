import "./loader.css";
export default class CustomLoader  {
	constructor() {
		this.spinner = document.querySelectorAll( ".spinner" );
		this.loader = document.querySelector( "#loader-container" );
	}
	loading() {
		this.loader.classList.remove( "loaded" );
		this.loader.classList.add( "loader-loading" );

		this.spinner.forEach( ( each, index ) => {
			each.classList.remove( "loaded-spinners" );
			index === 0 ? each.classList.add( "spinner-1" ) : each.classList.add( "spinner-2" );
		} );

		this.loader.style.display = "block";
	}
	loaded() {
		setTimeout( () => {
			this.loader.classList.add( "loaded" );
	
			this.spinner.forEach( ( each ) => {
				each.classList.add( "loaded-spinners" );
			} );
	
			this.loader.addEventListener( "transitionend", () => {
				this.loader.style.display = "none";
				this.loader.classList.remove( "loader-loading" );
				this.spinner.forEach( ( each ) => {
					each.classList.remove( "spinner-1", "spinner-2" );
				} );
			} );
		}, 500 );
	}
}