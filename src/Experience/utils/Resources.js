import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import EventEmitter from "./EventEmitter";

import Project from  "../Project.js"; 

export default class Resources extends EventEmitter {
	constructor( sources ) {
		super();

		this.project = new Project();
		this.zappar = this.project.zappar;

		// Options
		this.sources = sources;
        
		// Setup
		this.items = {};
		this.toLoad = this.sources.length;
		this.loaded = 0;
        
		this.setLoaders();
		this.startLoading();
	}
	setLoaders() {
		this.loaders = {};
		this.loaders.gltfLoader = new GLTFLoader();
		this.loaders.textureLoader = new THREE.TextureLoader();
		this.loaders.audioLoader = new THREE.AudioLoader();
	}
	startLoading() {
		// Load each source
		for( const source of this.sources ) {
			if( source.type === "gltfModel" ) {
				this.loaders.gltfLoader.load( source.path, ( file ) => {
					this.sourceLoaded( source, file );
				},
				undefined, () => {
					console.log( 'An error ocurred loading the GLTF model' );
				} );
			}
			if( source.type === "texture" ) {
				this.loaders.textureLoader.load( source.path, ( file ) => {
					this.sourceLoaded( source, file );
					// console.log(source)
				},
				undefined, () => {
					console.log( 'An error ocurred loading the Texture' );
				} );
			}
			if( source.type === "audio" ) {
				this.loaders.audioLoader.load( source.path, ( file ) => {
					this.sourceLoaded( source, file );
				} );
			}
		}
	}
	sourceLoaded( source, file ) {
		this.items[source.name] = file;
		this.loaded ++;

		if( this.loaded === this.toLoad ) {
			this.trigger( "ready" );
			console.log( "Ready" );
		}
	}
}