import Renderer from './renderer'
import Environment from './environment'
import { PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from './experience'
import UI from './ui'
import FollowCamera from './followCamera'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

export default class Game{

    private _renderer: Renderer
    private _environment: Environment
    private _controls: OrbitControls
    private _experience: Experience
    private _ui: UI
    private _followCamera: FollowCamera
    private _gui: GUI = new GUI()

    constructor(camera: PerspectiveCamera, environment: Environment)
    {        
        this._environment = environment
        this._renderer = new Renderer(camera, this._environment)
        this._controls = new OrbitControls(camera, this._renderer.renderer.domElement)
        this._followCamera = new FollowCamera(this._environment.scene, camera, this._renderer.renderer)
        this._experience = new Experience(this._environment, this._followCamera)
        this._ui = new UI(this._renderer)

        const cameraFolder = this._gui.addFolder("Camera")
        cameraFolder.add(camera.position,"x", 0, 10)
        cameraFolder.add(camera.position,"y", 0, 10)
        cameraFolder.add(camera.position,"z", 0, 10)
    }

    update(delta: number, elapsedTime: number){
        this._renderer.Update()
        this._controls.update()
        this._experience.update(delta)
    }
} 
