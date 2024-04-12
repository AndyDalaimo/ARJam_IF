import * as THREE from "three";

import Project from "../Project";

let earthObject, hotSpotGroup;

export default class Raycaster 
{
    constructor()
    {
        this.project = new Project();
        this.scene = this.project.scene;
        this.world = this.project.world;
        console.log(this.scene);

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.init();
    }

    init()
    {
        // define variables for objects to move later
        earthObject = this.scene.children[0].children[4];
        hotSpotGroup = this.scene.children[0].children[5];

        if (this.project.isTouchScreen)
        {
            document.addEventListener( "touchend", ( event )=>
            {
                this.mouse.x = ( event.changedTouches[0].clientX / window.innerWidth ) * 2 - 1;
                this.mouse.y = -( event.changedTouches[0].clientY / window.innerHeight ) * 2 + 1; 
                this.checkIntersection();
            } )
            document.addEventListener( "touchmove", ( event )=> 
            {
                this.mouse.x = ( event.changedTouches[0].clientX / window.innerWidth ) * 2 - 1;
                this.mouse.y = -( event.changedTouches[0].clientY / window.innerHeight ) * 2 + 1;
                this.rotateEarth(this.mouse.x);
            } )
        }
        else 
        {
            document.addEventListener( "click" , ( event )=>
            {
                this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
                this.checkIntersection();
                // console.log( `Mouse x = ${this.mouse.x} Mouse y = ${this.mouse.y}`);
            } )
            document.addEventListener( "mousemove", ( event )=> 
            {
                this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
                this.rotateEarth(this.mouse.x);
            } )
        }
    }

    checkIntersection()
    {
        if (this.project.hasPlaced)
        {
            this.raycaster.setFromCamera(this.mouse, this.project.camera);
        
            const intersects = this.raycaster.intersectObjects(this.scene.children[0].children, true);
            // console.log(intersects);

            if (intersects.length > 0)
            {
                if (this.intersectedMesh != intersects[0].object)
                {
                    this.intersectedMesh = intersects[0].object;
                    this.world.returnedIntersectedObject(this.intersectedMesh);
                    console.log(this.intersectedMesh);
                    this.intersectedMesh = null;
                }
            }
            else 
            {
               this.intersectedMesh = null;
               console.log("No Collision");
            }
        }
        
    }
    // Rotate the earth when user drags across screen
	rotateEarth(targetX)
	{
        if (this.project.hasPlaced)
        {
            // let earthObject = this.scene.children[0].children[4];
            earthObject.rotation.y += 1.5 * (targetX * 10 - earthObject.rotation.y);
            // let hotSpotGroup = this.scene.children[0].children[5];
            hotSpotGroup.rotation.y += 1.5 * (targetX * 10 - hotSpotGroup.rotation.y);
        }
    }
}