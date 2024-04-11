import * as THREE from 'three';
import { gsap } from 'gsap';

import Project from  "../Project.js"; 

let animationPaused;
let group;
const animationActionClips = [];
export default class Asset3D {
	constructor() {
		console.log( "Asset3D" );
		this.project = new Project(); // create ref to the project class 
		this.zappar = this.project.zappar; // create ref to Zappar in the project file
		this.world = this.project.world;  // create ref to the world in the project file
		this.resources = this.project.resources; // create ref to the resources in the project file
		this.time = this.project.time; // create a ref to the time class ( need to update animtion mixer on every frame )
        
		this.resource = this.resources.items.assets3D; // glb
		this.earthResource = this.resources.items.earthTest3D;
		this.hotspot01Resource = this.resources.items.hotspot01;
		this.hotspot02Resource = this.resources.items.hotspot02;
		this.hotspot03Resource = this.resources.items.hotspot03;
		this.forestTextResource = this.resources.items.forestText;
		
		// create a ref for accessing any animations stored in the glb file
		this.resourceAnimation = this.resource.animations; 
		// this.earthResourceAnimation = this.earthResource.animations;
		
		// Check to see if asset has exported animations
		this.hasAnimation = this.resourceAnimation.length > 0 ? true : false; 
		// this.hasAnimation = this.earthResourceAnimation.length > 0 ? true : false; 
		this.setModel();
		this.setAnimation();
	}
	setInstance() {
	}
	setModel() {
		this.model = this.resource.scene; // create a ref to all meshes in the glb file glb file
		console.log(this.model);
		this.earthModel = this.earthResource.scene; // create a ref to all meshes in the glb file glb file
		this.hotspot01Model = this.hotspot01Resource.scene;
		this.hotspot02Model = this.hotspot02Resource.scene;
		this.hotspot03Model = this.hotspot03Resource.scene;
		this.forestTextModel = this.forestTextResource.scene;
		// Look through all of the model  
		console.log( this.resource );
		this.model.traverse( ( child ) => {
			if ( child.isMesh ) { 
				// If child is a mesh then ensure that the meshes cast shadows.
				child.castShadow = true; 
				child.receiveShadow = true;
				child.material.vertexColors = false;
				// set correct texture encording for all imported textures in the model
				child.material.map.encoding = THREE.sRGBEncoding;
			}
		} );
		this.earthModel.traverse( ( child ) => {
			if ( child.isMesh ) { 
				// If child is a mesh then ensure that the meshes cast shadows.
				child.castShadow = true; 
				child.receiveShadow = true;
				child.material.vertexColors = false;
				// set correct texture encording for all imported textures in the model
				child.material.map.encoding = THREE.sRGBEncoding;
			}
		} );
		this.hotspot01Model.traverse( ( child ) => {
			if ( child.isMesh ) { 
				// If child is a mesh then ensure that the meshes cast shadows.
				child.castShadow = true; 
				child.receiveShadow = true;
				child.material.vertexColors = false;
				// set correct texture encording for all imported textures in the model
				// NO TEXTURES ON THIS MODEL YET 
				// child.material.map.encoding = THREE.sRGBEncoding;
			}
		} );
		this.hotspot02Model.traverse( ( child ) => {
			if ( child.isMesh ) { 
				// If child is a mesh then ensure that the meshes cast shadows.
				child.castShadow = true; 
				child.receiveShadow = true;
				child.material.vertexColors = false;
				// set correct texture encording for all imported textures in the model
				// NO TEXTURES ON THIS MODEL YET 
				// child.material.map.encoding = THREE.sRGBEncoding;
			}
		} );
		this.hotspot03Model.traverse( ( child ) => {
			if ( child.isMesh ) { 
				// If child is a mesh then ensure that the meshes cast shadows.
				child.castShadow = true; 
				child.receiveShadow = true;
				child.material.vertexColors = false;
				// set correct texture encording for all imported textures in the model
				// NO TEXTURES ON THIS MODEL YET 
				// child.material.map.encoding = THREE.sRGBEncoding;
			}
		} );
		this.forestTextModel.traverse( ( child ) => {
			if ( child.isMesh ) { 
				// If child is a mesh then ensure that the meshes cast shadows.
				child.castShadow = true; 
				child.receiveShadow = true;
				child.material.vertexColors = false;
				// set correct texture encording for all imported textures in the model
				// NO TEXTURES ON THIS MODEL YET 
				// child.material.map.encoding = THREE.sRGBEncoding;
			}
		} );
		// Positions
		this.model.position.set( 0, 0, 0 );
		// Center the model and scale it down to more readable size
		this.earthModel.position.set( 0.1, -1.5, -3 );
		this.earthModel.scale.set( .8, .8, .8);
		this.hotspot01Model.scale.set( .7, .7, .7);
		this.hotspot02Model.scale.set( .4, .4, .4);
		this.hotspot03Model.scale.set( .5, .5, .5);
		
		// Text Models with fact sheets for area. Hide until needed
		this.forestTextModel.position.set(1.5, .7, -1);
		this.forestTextModel.rotation.x = -1.5 * Math.PI;
		this.forestTextModel.visible = false;

		// Group all of the hotspots together to rotate around the earthModel as a pivot point
		group = new THREE.Group();
		group.add(this.hotspot01Model, this.hotspot02Model, this.hotspot03Model);
		group.position.set( 0.1, 0, -3);

		this.hotspot01Model.position.set(2.7, .5, 0);
		this.hotspot02Model.position.set(-3, .8, 0);
		this.hotspot02Model.rotation.y = -.5 * Math.PI;
		this.hotspot03Model.position.set(-0.1, 2, 0);

		// Need to add the model to the instantTrackerGroup for it to be display
		this.zappar.instantTrackerGroup.add( this.earthModel, group, this.forestTextModel );
	}
	setAnimation() {
		if( !this.hasAnimation ) return; // if the model has no animation do nothing

		// set the animation to Sun model here. Create clip of animation below
		this.animMixer = new THREE.AnimationMixer( this.model );
		// Set up Subclips
		this.resourceAnimation.forEach( ( element ) => {
			// Subclips consit of a name, start frame, end frame
			// Useuful if all animations are on one exported timeline
			const firstClip = this.animMixer.clipAction( THREE.AnimationUtils.subclip( element, "firstAction", 255, 2510 ) );
			// Push each clip to a array so we can access them more easily
			animationActionClips.push( firstClip );
		} );
		this.firstClip.play();
		// Listener for when a animation clip finishes
		this.animMixer.addEventListener( "finished", ( e ) => {
            
		} );
	}
	placementMode( bool ) {
		if( bool ) {
			// Stuff to happen when in placement mode
			
		}
		else if( !bool ) {
			// Stuff to happen when not in placement mode
		}
	}
	update() {
		if( this.hasAnimation ) {
			if( animationPaused ) return; // Stop the animation mixter from updating, which pauses the anaimtion
			this.animMixer.update( this.time.delta * 0.001 ); // update the animation mixer
		}

	}
}