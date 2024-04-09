import * as ZapparThree from '@zappar/zappar-threejs';

import Project from "../Project.js"; 

export default class Zappar {
	constructor() {
		console.log( "Zappar File" );
		this.project = new Project();
		this.time = this.project.time;

		if ( ZapparThree.browserIncompatible() ) {
            
			ZapparThree.browserIncompatibleUI();
			throw new Error( 'Unsupported browser' );
		}
		this.setInstance();
	}
	setInstance () {
		// Create an InstantWorldTracker and wrap it in an InstantWorldAnchorGroup for us
		// to put our ThreeJS content into
		this.instantTracker = new ZapparThree.InstantWorldTracker();
		this.instantTrackerGroup = new ZapparThree.InstantWorldAnchorGroup( this.project.camera, this.instantTracker );
        
		this.disableInstanceTracker();
		this.project.scene.add( this.instantTrackerGroup );
	}
	enableInstanceTracker() {
		this.instantTrackerGroup.visible = true;
		this.instantTracker.enabled = true;
	}
	disableInstanceTracker() {
		this.instantTrackerGroup.visible = false;
		this.instantTracker.enabled = false;
	}
	RequestCameraPermisions( callBackFuc ) {
		// we need to ask the users for permission
		ZapparThree.permissionRequestUI().then( ( granted ) => {
			// If the user granted us the permissions we need then we can start the camera
			// Otherwise let's them know that it's necessary with Zappar's permission denied UI
			if ( granted ) {
				this.project.camera.start();
				// call back function to startGame in Projects Script
				callBackFuc();
			}
			else ZapparThree.permissionDeniedUI();
		} );
	}
	permissionDenied() {
		ZapparThree.permissionDeniedUI();
	}
	update() {
		if( !this.project.hasPlaced ) {
			// If the user hasn't chosen a place in their room yet, update the instant tracker
			// to be directly in front of the user
			this.instantTrackerGroup.setAnchorPoseFromCameraOffset( 0, 0, -3 );
		}
		else if ( this.project.hasPlaced ) {

		}
	}
}