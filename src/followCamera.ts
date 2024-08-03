import { Object3D, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
 
export default class FollowCamera{

    public camera: PerspectiveCamera
    public pivot: Object3D = new Object3D()
    public yaw: Object3D = new Object3D()
    public pitch: Object3D = new Object3D()
   
    constructor(scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer){
       this.camera = camera
       
       document.addEventListener('pointerlockchange', () => {
            if(document.pointerLockElement === renderer.domElement){
                document.addEventListener('mousemove', this.OnMouseMove)
                document.addEventListener('wheel', this.OnMouseWheel)
            }
            else
            {
                document.removeEventListener('mousemove', this.OnMouseMove)
                document.removeEventListener('wheel', this.OnMouseWheel)
            }
       })

       scene.add(this.pivot)
       this.pivot.add(this.yaw) //guinada
       this.yaw.add(this.pitch) //arremesso
       this.pitch.add(camera) // adding the perspective camera to the hierarchy
    }

    OnMouseMove = (e: MouseEvent) => {
        this.yaw.rotation.y -= e.movementX * 0.002

        const v = this.pitch.rotation.x - e.movementY * 0.002
       
        if (v > -1 && v < 1) {
            this.pitch.rotation.x = v
        }
   
    }

    OnMouseWheel = (e: WheelEvent) => {
        e.preventDefault()       
        const v = this.camera.position.z + e.deltaY * 0.005

        if (v >= 0.5 && v <= 10) {
            this.camera.position.z = v
        }
    }


}