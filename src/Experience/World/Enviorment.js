import * as THREE from "three";
import * as ZapparThree from '@zappar/zappar-threejs';

import Project from "../Project.js"; 

export default class Enviorment {
	constructor() {
        
		console.log( "Enviorment File" );
		// Instandiate 
		this.project = new Project();
		this.zappar = this.project.zappar;

		this.dirLight_intensity = 5;
		this.ambientLight_intensity = 1.5;
		this.setInstance();
		this.setDirectionLight();
		this.setAmbientLight();
	}
	setInstance() {
		// Set up the real time environment map
		this.environmentMap = new ZapparThree.CameraEnvironmentMap();
		this.project.scene.environment = this.environmentMap.environmentMap;
 
	}
	setDirectionLight() {
		// Direction light
		this.dirLight = new THREE.DirectionalLight(	"#FAFEFF", 1 );
		// this.dirLight.position.set(2, 8.5, 6)
		this.dirLight.position.set( 1.05, 2.33, 3 );
		this.dirLight.intensity = this.dirLight_intensity;
		this.dirLight.castShadow = true;
		this.dirLight.shadow.bias = -0.004;
        
		this.shadowDistance = 1.5;
		this.dirLight.shadow.camera.top = this.shadowDistance;
		this.dirLight.shadow.camera.bottom = -this.shadowDistance;
		this.dirLight.shadow.camera.left = -this.shadowDistance;
		this.dirLight.shadow.camera.right = this.shadowDistance;
		this.dirLight.shadow.camera.near = 0.5;
		this.dirLight.shadow.camera.far = 20;
		this.dirLight.shadow.radius = 3;
		this.dirLight.shadow.mapSize.width = 1024;
		this.dirLight.shadow.mapSize.height = 1024;
        
		// Light target postion object
		// We set the look at taget for the camera to be a blank object at position 0,0,0
		// Then the cameras angle is based on its position
		this.targetObject = new THREE.Object3D(); 
		this.dirLight.target = this.targetObject; 

		this.zappar.instantTrackerGroup.add( this.dirLight );
		this.zappar.instantTrackerGroup.add( this.targetObject );
        
		// Uncomment to have visual guild to the camera 
		/* this.zappar.instantTrackerGroup.add( new THREE.CameraHelper( this.dirLight.shadow.camera ) ) */
	}
	setAmbientLight() {
		// Ambinet Light
		this.ambientLight = new THREE.AmbientLight( '#F4FDFF', this.ambientLight_intensity );
		this.zappar.instantTrackerGroup.add( this.ambientLight );
	}
	update() {
		this.environmentMap.update( this.project.renderer, this.project.camera );
	}
}