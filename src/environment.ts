import { Color, Scene } from 'three'


export default class Environment{

    public scene: Scene
   
    constructor(){
        this.scene = new Scene()   
        //this.scene.background = new Color(Color.NAMES.white)   
    }


}