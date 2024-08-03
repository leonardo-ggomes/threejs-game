import { PerspectiveCamera } from 'three'
import Camera from './camera'
import Renderer from './renderer'
 
export default class UI{

    public renderer: Renderer
   
    constructor(renderer: Renderer){
       this.renderer = renderer   
       
       let btnStart = document.getElementById('start') as HTMLButtonElement

       btnStart.addEventListener('click', () => {
            this.renderer.renderer.domElement.requestPointerLock()
       }, false)

    }



}