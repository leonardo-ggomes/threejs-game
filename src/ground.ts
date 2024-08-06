import {
  ConeGeometry,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  Object3D,
  ObjectLoader,
  PlaneGeometry,
  SphereGeometry,
  TextureLoader,
} from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export default class Ground extends Object3D {
  constructor() {
    super();
    this.Init();
  }

  Init = () => {
    const textureLoader = new TextureLoader();

    const texture = textureLoader.load("textures/terrain_grayscale.png");
    const textureMap = textureLoader.load("textures/terrain_map.png");

    const material = new MeshStandardMaterial({
      wireframe: false,
      displacementMap: texture,
      map: textureMap,
      displacementScale: -2.3,
      displacementBias: 2.08,
    });

    const width = 100;
    const height = 100;

    let plane = new Mesh(
      new PlaneGeometry(width, height, width - 1, height - 1),
      material
    );

    plane.rotation.x = -Math.PI / 2;
    this.add(plane);

    textureLoader.load("textures/terrain_map.png", (t) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;

      canvas.width = t.image.width;
      canvas.height = t.image.height;

      context.drawImage(t.image, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const positions: any[] = [];

      for (let h = 0; h < canvas.height; h += 10) {
        for (let w = 0; w < canvas.width; w += 10) {
          const index = (h * canvas.width + w) * 4;

          const R = data[index + 0];
          const G = data[index + 1];
          const B = data[index + 2];

          const m = (R + G + B) / 3;

          if (m < 150) {
            positions.push({
              worldX: (w / canvas.width) * width - width / 2,
              worldY: (R / 255) * 10,
              worldZ: (h / canvas.height) * height - height / 2,
            });
          }
        }
      }

      new GLTFLoader().load("models/PineTree.glb", (gltf) => {
        const tree = gltf.scene
        //this.add(gltf.scene);

        // const g = new ConeGeometry(1, 2);
        // const mesh = new MeshToonMaterial({ color: 0x00ff00 });

        // const n = positions.length;

        //const instance = new InstancedMesh(g, mesh, n);
        //const o = new Object3D();

        positions.forEach((c, i) => {
          const a = tree.clone()
          a.position.set(c.worldX, c.worldY, c.worldZ);

          //a.updateMatrix();
        //   instance.setMatrixAt(i, o.matrix);
            this.add(a);
        });

      
      });
    });

    const gui = new GUI();
    const materialFolder = gui.addFolder("Material");
    materialFolder.add(material, "displacementScale", -10, 10);
    materialFolder.add(material, "displacementBias", -10, 10);
    materialFolder.add(material, "wireframe");
  };
}
