import { Scene, Group, Mesh, AnimationAction, AnimationMixer } from "three"
import { GLTFLoader } from "three/examples/jsm/Addons.js"


export default class Character extends Group{

   private scene: Scene
   private loader: GLTFLoader
   private modelPath: string
   public animationActions: { [clip: string] : AnimationAction } = {}
   mixer?: AnimationMixer

    constructor(loader: GLTFLoader, scene: Scene, modelPath: string = 'models/HoodedAdventurer$@idle.glb')
    {          
       super()
       this.loader = loader 
       this.scene = scene
       this.modelPath = modelPath

    }

    public async Load(){       

        // const [remy, walk, run] = await Promise.all([
        //     this.loader.loadAsync(this.modelPath),
        //     this.loader.loadAsync('models/remy@walk.glb'),
        //     this.loader.loadAsync('models/remy@run.glb')
        // ])

        const [hooded] = await Promise.all([
            this.loader.loadAsync(this.modelPath)
        ])
     
     
        hooded.scene.traverse((child) => {
            if((child as Mesh).isMesh)
            {
                child.castShadow = true
            }
        })    

       hooded.scene.rotation.y = Math.PI / 1
        this.add(hooded.scene)
      
             
        this.mixer = new AnimationMixer(hooded.scene)
        this.animationActions['idle'] = this.mixer.clipAction(hooded.animations[9])
        this.animationActions['walk'] = this.mixer.clipAction(hooded.animations[22])
        this.animationActions['run'] = this.mixer.clipAction(hooded.animations[16])
        this.animationActions['death'] = this.mixer.clipAction(hooded.animations[0])
        this.animationActions['attack'] = this.mixer.clipAction(hooded.animations[21])

        // this.animationActions['walk'] = this.mixer.clipAction(AnimationUtils.subclip(walk.animations[0],'walk', 0, 42))
        // this.animationActions['run'] = this.mixer.clipAction(AnimationUtils.subclip(run.animations[0],'run', 0, 23))

        this.scene.add(this)
    }

   
} 
