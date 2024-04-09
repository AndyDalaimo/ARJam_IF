import * as THREE from "three";

import Project from "../Project";

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
        if (this.project.isTouchScreen)
        {
            document.addEventListener( "touchend", ( event )=>
            {
                this.mouse.x = ( event.changedTouches[0].clientX / window.innerWidth ) * 2 - 1;
                this.mouse.y = -( event.changedTouches[0].clientY / window.innerHeight ) * 2 + 1; 
                this.checkIntersection();
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
        }
    }

    checkIntersection()
    {
        if (this.project.hasPlaced)
        {
            this.raycaster.setFromCamera(this.mouse, this.project.camera);
        
            const intersects = this.raycaster.intersectObjects(this.scene.children[0].children, true);

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
}