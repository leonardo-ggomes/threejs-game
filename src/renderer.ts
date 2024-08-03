import {PerspectiveCamera, WebGLRenderer} from 'three'
import Environment from './environment'
import Camera from './camera'

export default class Renderer{

    public renderer: WebGLRenderer
    public antialias: boolean = true 
    public enableShadow: boolean = false 
    private camera: PerspectiveCamera
    private environment: Environment

    constructor(camera: PerspectiveCamera, environment: Environment, antialias?: boolean, enableShadow: boolean = false){
        this.renderer = new WebGLRenderer({antialias: antialias})
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.shadowMap.enabled = enableShadow
        this.camera = camera
        this.environment = environment
        document.body.appendChild(this.renderer.domElement)
        this.OnRezise()
    }

    private OnRezise() {
        window.addEventListener('resize',()=>{
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        })
    }
    
    public Update(){
        this.renderer.render(this.environment.scene, this.camera)
    }

}