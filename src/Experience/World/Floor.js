import * as THREE from "three";
import Project from "../Project.js";

export default class Floor {
	constructor( planeSize ) {
		console.log( "Floor File" );
		this.project = new Project();
		this.zappar = this.project.zappar;

		this.planeSize = planeSize;
		this.setShadowPlane();
	}
	setShadowPlane() {
		// Create a plane which will receive the shadows.
		this.shadowPlane = new THREE.Mesh(
			new THREE.PlaneGeometry( this.planeSize, this.planeSize ),
			new THREE.ShadowMaterial( { opacity : 0.4 } ),
		);
		this.shadowPlane.receiveShadow = true;
		this.shadowPlane.rotation.x = -Math.PI / 2;
       
		this.zappar.instantTrackerGroup.add( this.shadowPlane );
	}
}

