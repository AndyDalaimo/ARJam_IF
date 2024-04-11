import * as THREE from 'three';
import { gsap } from 'gsap';

import Project from "../Project.js";
import Enviorment from './Enviorment.js';
import Floor from './Floor.js';
import Asset3D from './Asset3D.js';
import Raycaster from './Raycaster.js';

// Map of all Objects to be interacted with and textContent set
const textInfor = new Map( [ 
	["Earth", "This is a model of the earth"],
	["Cube", "This is a model of a cube"]
]);

export default class World {
	constructor() {
		console.log( "World File" );
		this.project = new Project(); // create ref to the project class 
		this.zappar = this.project.zappar; // create ref to Zappar in the project file
		this.scene = this.project.scene; // create ref to the scene in the project file

	}
	init() {
		// Setup
		this.enviorment = new Enviorment(); // initialise the enviorment and create a ref
		this.plane = new Floor( 5 ); // Create a shadow plane
		this.asset3D = new Asset3D(); // initialise the asset3D and create a ref
		this.raycaster = new Raycaster();
		this.forestText = this.scene.children[0].children[6];
		

		this.setInstance();
		this.placement_Indicator_initialise();
	}
	setInstance() {
		// Call the corresponding setInstance function
		this.asset3D.setInstance();
	}
	// Create a circle placed below
	placement_Indicator_initialise() {
		// Create a new Mesh of CircleGeometry and a new MeshBasicMaterial to be applied to the mesh
		this.placement_indicator_mesh = new THREE.Mesh(
			new THREE.CircleGeometry( 0.4, 32 ),
			new THREE.MeshBasicMaterial( { color : new THREE.Color( "#00491F" ), } ),
		);
		// Needs to be added to the zappar tracking group to be visiable in the scene
		this.zappar.instantTrackerGroup.add( this.placement_indicator_mesh );
		// Set the scale and rotation 
		this.placement_indicator_mesh.scale.set( 0, 0, 1 );
		// this.placement_indicator_mesh.position.y = -0.5;
		// this.placement_indicator_mesh.position.z = -3;
		this.placement_indicator_mesh.position.set(0.0, -1.5, -3.2);
		this.placement_indicator_mesh.rotation.x = - Math.PI / 2;
	}
	// Call appropriate functionality with mesh the user is wanting to interact with
	returnedIntersectedObject( intersectedMesh ) {
		// this.project.gameplayScreen.infor_text.innerText = textInfor.get(intersectedMesh.name);

		this.initiateFactSheet( intersectedMesh.name );
		console.log(intersectedMesh.name);
		this.project.gameplayScreen.infor_textBox.style.display = "flex";
		this.project.gameplayScreen.returnToEarth_btn.style.display = "flex";
		this.project.gameplayScreen.infor_text.style.display = "none";
		this.project.gameplayScreen.returnToEarth_btn.addEventListener( 'touchstart', ()=> {
			this.returnToEarthView();
		} );

	}
	initiateFactSheet(name)
	{
		switch (name)
		{
			case "Plane005":
				console.log("Show Forest Fact Sheet");
				this.forestText.visible = true;
				break;
			case "Plane019":
				console.log("Show Ocean Fact Sheet");
				this.forestText.visible = true;
				break;
			case "Smog":
				console.log("Show Smog Fact Sheet");
				this.forestText.visible = true;
				break;

		}
	}
	returnToEarthView()
	{
		this.project.gameplayScreen.infor_textBox.style.display = "none";
		this.project.gameplayScreen.returnToEarth_btn.style.display = "none";
		this.forestText.visible = false;
	}
	// This Function is called for the project script. 
	placementMode( bool ) {
		if ( bool ) {
			this.project.hasPlaced = false;
			this.asset3D.placementMode( true );
			// Animate the x and y scale of the placement_indicator_mesh, t default scale in 0 so GSAP will animate x and y value from 0 to 1 over the set duration, in this case 0.4 seconds
			gsap.to( this.placement_indicator_mesh.scale, { x : 1, y : 1, duration : 0.4 } );
			this.placement_indicator_mesh.visible = true;
		}
		else if ( !bool ) {
			if ( this.project.initalPlacement ) {
				// Stuff to happen on the first time placement
				this.project.initalPlacement = false;
			}
			// Animate the X and Y scale from the current value (in this case 1, this is the value set above) to 0 over a duration of 0.4 seconds
			gsap.to( this.placement_indicator_mesh.scale, {
				x : 0,
				y : 0,
				duration : 0.4,
				// a call back is used to then wait for the animaton to finsihed before complete the below actions
				onComplete : () => {
					this.placement_indicator_mesh.visible = false;
					this.project.hasPlaced = true;
					this.asset3D.placementMode( false );
				}
			} );
		}
	}
	update() {
		if ( this.project.hasPlaced ) { // If not in placement mode
			// this is only called if not in placement mode, this prevents animations playing while the user is trying to place the Instant Tracking Group
			if ( this.asset3D ) {
				this.asset3D.update();
			}
		}
		// Only update the enviorment class if the camera exsits 
		if ( this.project.camera ) {
			this.enviorment.update();
		}
	}
}

