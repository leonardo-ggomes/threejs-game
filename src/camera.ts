import { PerspectiveCamera } from 'three'
 
export default class Camera extends PerspectiveCamera{

    public perspectiveCamera: PerspectiveCamera
   
    constructor(fov: number = 75, near: number = 0.01, far: number = 100){
        super()
        this.perspectiveCamera = new PerspectiveCamera(
            fov,
            window.innerWidth / window.innerHeight,
            near,
            far
        )
        this.perspectiveCamera.position.set(1, 5.7, 5.08)
    }


}