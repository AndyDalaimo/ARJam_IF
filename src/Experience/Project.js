import * as THREE from 'three';
import * as ZapparThree from '@zappar/zappar-threejs';

import CustomLoader from "./utils/CustomLoader/CustomLoader.js";
import Sizes from "./utils/Sizes.js";
import Time from "./utils/Time.js";
import World from "./World/World.js";
import Zappar from "./World/Zappar.js";
import Resources from './utils/Resources.js';
import sources from './utils/sources.js';

let instance = null;
let visibilityChange, hidden;
const constraintsBackCamera = 
    {
    	video : 
		{ facingMode : { exact : "environment" }, },
    };
export default class Project {
	constructor() {
		if ( instance )	return instance;
		instance = this;

		this.customLoader = new CustomLoader();
		this.sizes = new Sizes(); 
		this.time = new Time(); 
		// Construct our ThreeJS renderer and scene as usual
		this.renderer = new THREE.WebGLRenderer( { antialias : true, } );
		// Construct the Three.js Scene 
		this.scene = new THREE.Scene();
		// Create a TEMP Zappar camera for UI sound at start
		this.camera = new ZapparThree.Camera();
		this.zappar = new Zappar();
		// initialise the resources and create a ref
		this.resources = new Resources( sources );
		// initialise the world and create a ref
		this.world = new World();
		/**
         *  Variables
         */
		// Returns true if the device is a touch device
		this.isTouchScreen = window.matchMedia( "(pointer : coarse)" ).matches;
		
		/**
        *  HTML Elements
        */
		this.splashScreen =
       {
       	page : document.getElementById( 'splashScreen' ),
       	lanuch_btn : document.getElementById( 'launch-btn' ),
       };
		this.gameplayScreen =
       {
       	page : document.getElementById( 'gameplayScreen' ),
       	tapToPlace_btn : document.getElementById( 'tap_to_place-btn' ),
       	placementMode_ui : document.getElementById( 'placementMode-ui' ),
       	gameplay_ui : document.getElementById( 'gameplay-ui' ),
       	recenter_btn : document.getElementById( 'recenter-btn' ),
       	infor_textBox : document.getElementById( 'infor-textBox' ),
       	infor_text : document.getElementById( 'infor-text' ),
		returnToEarth_btn : document.getElementById( 'returnToEarth_btn')
       };
        
		/**
        * Event Emitters & Listeners
        * These emitters & Listeners can be called immediately after constrcution
        */
		// Once HTML Document is loaded
		document.addEventListener( "DOMContentLoaded", () => {
			this.handleVisibilityChange();
			// hide and unhide all sectons at start - seems to fix lag issues when displaying them later
			
		} );
		// Event emitter for when all assets are loaded
		this.resources.on( "ready", () => {
			this.createAudio();
			this.setAudio();
			this.world.init();
			this.customLoader.loaded();
		} );
		// Event emitter for when the window is resized
		// Update the Three.js Renderer with new canvs with & height
		this.sizes.on( "resize", () =>  this.renderer.setSize( this.sizes.width, this.sizes.height ) );

		/**
         *  Buttons
		 * Add any button event listeners here to keep the code tidy
         */
		// SPLASHSCREEN PAGE
		this.splashScreen.lanuch_btn.addEventListener( 'click', () => {
			this.requestPremisions();
		} );
		// GAMEPLAY
		this.gameplayScreen.tapToPlace_btn.addEventListener( 'click', () => {
			this.placementMode( false );

		} );
		this.gameplayScreen.recenter_btn.addEventListener( 'click', () => {
			this.placementMode( true );
		} );
		/*this.gameplayScreen.returnToEarth_btn.addEventListener( 'click', ()=> {
			console.log("return to earth button");
			this.returnToEarthView();
		} );*/
	}
	init() {
		/**
         * setup files
         */
		this.setInstance();
		this.setCamera(); // call the function to set the camera settings
		/**
         * Rednerer
        */
		this.renderer.shadowMap.enabled = true; // Enable Shadows 
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Shadow map type
		this.renderer.toneMapping = THREE.ReinhardToneMapping; // Set the tonemapping for the experience 
		this.renderer.toneMappingExposure = 0.8; // Control the Tonemapping strength
		this.renderer.physicallyCorrectLights = true; // Enable Physicall Correct Lighting
		this.renderer.outputEncoding = THREE.sRGBEncoding; // Set the encoding

		// The Zappar component needs to know our WebGL context, so set it like this:
		ZapparThree.glContextSet( this.renderer.getContext() );
       
		// The renderer needs to be added to the HTML Document
		document.body.appendChild( this.renderer.domElement );
		this.renderer.setSize( this.sizes.width, this.sizes.height );

		// Request Zappar Permisions after camera has been set to device ID camera source
		this.zappar.RequestCameraPermisions( () => { 
			this.startGame(); 
			this.customLoader.loaded(); // Remove the Loader as the content has been loaded
		} );

		/**
         *  Event Emitters
         *  These emitters wont be called until after camera permisions 
         */
		// Event emitter for tick (every frame)
		this.time.on( "tick", () =>  this.update() );
	}
	setInstance() {
		this.hasPlaced = false;
		this.initalPlacement = true;
	}
	// Request permsions to look for cameras on device  
	requestPremisions() {
		this.customLoader.loading();
		navigator.mediaDevices.getUserMedia( constraintsBackCamera ).then( ( mediaStream ) => {
			const backCameraID = mediaStream.getVideoTracks()[ 0 ].getSettings().deviceId;
			console.log( "Promise respoence = " + backCameraID );
			this.camera = new ZapparThree.Camera( { rearCameraSource : backCameraID } );
			this.init(); 
			console.log( `Moblie active = ${ mediaStream.active }` );
		} )
			.catch( ()=>{
				navigator.mediaDevices.getUserMedia( { video : true } ).then( ( mediaStream ) =>{
					console.log( `Webcam active = ${ mediaStream.active }` );
					this.init(); 
				} )
					.catch( ( error ) => {
						console.log( error ); 
						this.zappar.permissionDenied();
					} );
			} );
	}
	// If user changes tabs of hides the browser put in placement mode
	handleVisibilityChange() {
		// Check device to understand which prefix to use for visibility changes
		if ( document.hidden !== undefined ) { // Opera 12.10 and Firefox 18 and later support
			hidden = "hidden";
			visibilityChange = "visibilitychange";
		} 
		else if ( document.mozHidden !== undefined ) {
			hidden = "mozHidden";
			visibilityChange = "mozvisibilitychange";
		} 
		else if ( document.msHidden !== undefined ) {
			hidden = "msHidden";
			visibilityChange = "msvisibilitychange";
		} 
		else if ( document.webkitHidden !== undefined ) {
			hidden = "webkitHidden";
			visibilityChange = "webkitvisibilitychange";
		} 
		else if ( document.oHidden !== undefined ) {
			hidden = "oHidden";
			visibilityChange = "ovisibilitychange";
		}          
		document.addEventListener( visibilityChange, () => {
			// If the page is hidden, toggle placement mode
			if ( document[ hidden ] && this.hasPlaced ) {
				this.placementMode( true );
				console.log( document[ hidden ] );
			}
		}, false );
	}
	startGame() {
		this.zappar.enableInstanceTracker(); 
		this.splashScreen.page.style.display = "none";
		this.gameplayScreen.page.style.display = "flex";
		this.initalPlacement = true;
		this.placementMode( true );
	}
	resetGame() {
		this.setInstance();
		this.startGame();
		this.world.setInstance();
	}
	setCamera() {
		// Set the background of our scene to be the zappar camera background texture
		this.camera.backgroundTexture.encoding = THREE.sRGBEncoding;
		this.scene.background = this.camera.backgroundTexture;
		this.camera.poseMode = ZapparThree.CameraPoseMode.AnchorOrigin;
		console.log( "Camera Set" );
	}
	createAudio() {
		// Create Audio Listener
		const audioListener = new THREE.AudioListener(); // only need one audio listener
		this.camera.add( audioListener );
		this.TapToPlace_auido = new THREE.Audio( audioListener );
		this.TapToPlace_sound = this.resources.items.TapToPlace_sound;
	}
	setAudio( callback ) {
		// Set the sound to the audio buffer
		this.TapToPlace_auido.setBuffer( this.TapToPlace_sound );
		this.TapToPlace_auido.setVolume( 0.15 );
		console.log( "Audio set" );
        
		if ( callback ) callback(); // once complete callback function
	}
	uiSoundEffect ( clip ) {
		if( clip.isPlaying ) clip.stop();
		clip.play();
	}
	// Placement mode is disabled and enabled on a button press Wwenever the user wants to replace the Instant Tracking Group 
	placementMode( bool ) {
		if ( bool ) {  // If in Placement Mode
			this.gameplayScreen.placementMode_ui.style.display = "block";
			this.gameplayScreen.gameplay_ui.style.display = "none";
			this.world.placementMode( true );
            
		}
		else if( !bool ) { // If not in Placement Mode
			this.gameplayScreen.placementMode_ui.style.display = "none";
			this.gameplayScreen.gameplay_ui.style.display = "block";
			this.uiSoundEffect( this.TapToPlace_auido );
			this.world.placementMode( false );
		}
	}
	returnToEarthView()
	{
		this.gameplayScreen.infor_textBox.style.display = "none";
	}
	/**
     *  Game Loop
    */
	update() {
		this.zappar.update();
		this.world.update();
		// The Zappar camera must have updateFrame called every frame
		this.camera.updateFrame( this.renderer );
		// Draw the ThreeJS scene in the usual way, but using the Zappar camera
		this.renderer.render( this.scene, this.camera );
	}
}