import './style.css'
import Camera from "./camera";
import Game from "./game";
import Environment from "./environment";
import { Clock } from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'


const camera = new Camera()
const environment = new Environment()
const clock = new Clock()

//#region Stats
const stats = new Stats()
document.body.appendChild(stats.dom)
//#endregion

const game = new Game(camera.perspectiveCamera, environment)

function animate(){
    requestAnimationFrame(animate)
    game.update(clock.getDelta(), clock.getElapsedTime())
    stats.update()
}

animate()