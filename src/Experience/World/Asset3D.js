import * as THREE from 'three';
import { gsap } from 'gsap';

import Project from  "../Project.js"; 

let animationPaused;
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
		
		this.resourceAnimation = this.resource.animations; // create a ref for accessing any animations stored in the glb file
		
		// Check to see if asset has exported animations
		this.hasAnimation = this.resourceAnimation.length > 0 ? true : false; 
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
		// Positions
		this.model.position.set( 0, 0, 0 );
		// Center the model and scale it down to more readable size
		this.earthModel.position.set( 0.1, 0, 0 );
		this.earthModel.scale.set( .5, .5, .5);
		this.hotspot01Model.position.set(1.8, 1.8, 0);
		this.hotspot02Model.position.set(-1.8, 1.8, 0);
		this.hotspot03Model.position.set(0, -1.8, 0);
		// Need to add the model to the instantTrackerGroup for it to be display
		// this.zappar.instantTrackerGroup.add( this.model );
		this.zappar.instantTrackerGroup.add( this.earthModel , this.hotspot01Model, this.hotspot02Model, this.hotspot03Model);
		// this.zappar.instantTrackerGroup.add( this.hotspot01Model );
		// this.zappar.instantTrackerGroup.add( this.hotspot02Model );
		// this.zappar.instantTrackerGroup.add( this.hotspot03Model );
	}
	setAnimation() {
		if( !this.hasAnimation ) return; // if the model has no animation do nothing

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