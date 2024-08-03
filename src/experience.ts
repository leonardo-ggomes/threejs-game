import { AmbientLight } from 'three'
import Environment from './environment'
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js'
import Character from './character'
import Ground from './ground'
import PlayerController from './playerController'
import FollowCamera from './followCamera'

export default class Experience{

    private _environment: Environment
    public loader: GLTFLoader
    public player?: PlayerController
    public followCamera: FollowCamera
  
    constructor(environment: Environment, followCamera: FollowCamera){
        this._environment = environment
        this.followCamera = followCamera

        this.loader = new GLTFLoader()
        this.loader.setDRACOLoader(new DRACOLoader().setDecoderPath('jsm/libs/draco'))
        
        this.Init()
        let character = new Character(this.loader, this._environment.scene,'models/HoodedAdventurer$@idle.glb')        
        character.Load().then(() => {
            this.player = new PlayerController(character, this.followCamera, this._environment)
        })
    }

    Init = () => {
        const light = new AmbientLight(0xffffff, 10)        
        this._environment.scene.add(light)
        const ground = new Ground()
        this._environment.scene.add(ground)       
    }

    update(delta: number){
        this.player?.update(delta)
    }

}