import { AnimationAction, AnimationMixer, BoxGeometry, Euler, Matrix4, Mesh, MeshBasicMaterial, Object3D, Quaternion, Scene, Vector3 } from 'three'
import Character from './character'
import FollowCamera from './followCamera'
import Environment from './environment'

export default class PlayerController{

    character: Character
    mixer?: AnimationMixer
    activeAnimation?: AnimationAction
    keyboard: { [key: string]: boolean } = {}
    followTarget = new Object3D()//new Mesh(new BoxGeometry(), new MeshBasicMaterial({color:0xff0000}))
    vector = new Vector3()
    inputVelocity = new Vector3()
    euler = new Euler()
    quaternion = new Quaternion()
    rotationMatrix = new Matrix4()
    targetQuaternion = new Quaternion()
    followCam: FollowCamera
    speed: number = 2
    scene: Scene

    constructor(character: Character, followCam: FollowCamera, environment: Environment){
        this.character = character   
        this.mixer = this.character.mixer
        this.followCam = followCam
        //this.activeAnimation = this.character.animationActions['idle']
        this.scene = environment.scene
        this.scene.add(this.followTarget)

        const onDocumentPress = (e: KeyboardEvent) => {
            this.keyboard[e.key] = e.type === "keydown"
        }


        document.addEventListener('keydown', onDocumentPress)
        document.addEventListener('keyup', onDocumentPress)
    }

    private setAnimation(active: AnimationAction){
        
        if(active != this.activeAnimation)
        {
            this.activeAnimation?.fadeOut(0.2)
            active.reset().fadeIn(0.1).play()
            this.activeAnimation = active
        }
             
    }

    update(delta: number)
    {
        this.mixer?.update(delta)
        
        // Reseta a velocidade de entrada
        this.inputVelocity.set(0, 0, 0)

        if (this.keyboard['s']) {
            this.inputVelocity.z = 1
            this.setAnimation(this.character.animationActions['walk'])
            this.speed = 10
        }
        else if (this.keyboard['a']) {
            this.inputVelocity.x = -1
            this.setAnimation(this.character.animationActions['walk'])
            this.speed = 10
        }
        else if (this.keyboard['d']) {
            this.inputVelocity.x = 1
            this.setAnimation(this.character.animationActions['walk'])
            this.speed = 10
        }        
        else if(this.keyboard['w']){
            if(this.keyboard['Shift'])
            {
                this.setAnimation(this.character.animationActions['run'])
                this.speed = 15
            }
            else{
                this.setAnimation(this.character.animationActions['walk'])
                this.speed = 10
            }  
            
             // Define a velocidade de entrada para frente
            this.inputVelocity.z = -1
        }
        else
        {
            this.setAnimation(this.character.animationActions['idle'])
        }

        this.inputVelocity.setLength(delta * (this.speed || 1)) // limit horizontal movement based on walking or running speed
    
        this.euler.y = this.followCam.yaw.rotation.y;
        this.quaternion.setFromEuler(this.euler);
        this.inputVelocity.applyQuaternion(this.quaternion);


        // Multiplica a velocidade de entrada pelo delta para escalonamento do movimento
        this.inputVelocity.multiplyScalar(delta * (this.speed + 10)) // Ajuste o fator de escala conforme necessário

        //Ajusta a direção da followTarget
        this.followTarget.position.copy(this.character.position) 
        this.followTarget.getWorldPosition(this.vector) // Put followTargets new world position into a vector
        this.followCam.pivot.position.lerp(this.vector, delta * 10) // lerp the followCam pivot towards the vector
        

        // Atualiza a posição do personagem
        this.character.position.add(this.inputVelocity)

        // Player model also lerps towards the capsules position, but independently of the followCam
        this.character.position.lerp(this.vector, delta * 20)       
       
        // Make the camera look at the character
        this.followCam.camera.lookAt(this.character.position);

        this.rotationMatrix.lookAt(
            this.followTarget.position,
            this.character.position as Vector3,
            this.character.up as Vector3
        );
        this.targetQuaternion.setFromRotationMatrix(this.rotationMatrix);
        const distance = this.character.position.distanceTo(this.followTarget.position)

        // If distance is higher than some espilon, and Eves quaternion isn't the same as the targetQuaternion, then rotate towards the targetQuaternion.
        if ((distance as number) > 0.0001 && !this.character.quaternion.equals(this.targetQuaternion)) {
            this.targetQuaternion.z = 0 // so that it rotates around the Y axis
            this.targetQuaternion.x = 0 // so that it rotates around the Y axis
            this.targetQuaternion.normalize() // always normalise quaternions before use.
        
            this.character.quaternion.rotateTowards(this.targetQuaternion, delta * 5)
        }
    }


}