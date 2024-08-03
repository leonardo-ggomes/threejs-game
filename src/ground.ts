import {  Mesh, MeshBasicMaterial, Object3D, PlaneGeometry } from "three"


export default class Ground extends Object3D{

    constructor()
    {          
      super()
      this.Init()
    }

    Init = () => {      
        
        let plane = new Mesh(
            new PlaneGeometry(20,20),
            new MeshBasicMaterial({color:0xfafafa})
        )
        plane.rotation.x = -Math.PI / 2
        this.add(plane)
    }

   
} 
