import Experience from "../experience.js";
import * as THREE from "three";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    //调试
    if (this.debug.active) {
      //用于创建一个名为"environment"的调试文件夹，使用的是lil-gui库的功能。
      this.debugFolder = this.debug.ui.addFolder("environment");
    }
    this.setSunLight();
    this.setEnvironmentMap();

  }
  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 4);
    // 阴影
    this.sunLight.castShadow = true;
    //远度
    this.sunLight.shadow.camera.far = 15;
    //分辨率
    this.sunLight.shadow.mapSize.set(1024, 1024);
    //法线偏移
    this.sunLight.shadow.normalBias = 0.05;
    //位置
    this.sunLight.position.set(3.5, 2, -1.25);
    this.scene.add(this.sunLight);
    //debug
    if (this.debug.active) {
      // 阳光强度：直接绑定到光源属性，Three.js 会自动重新渲染，无需 onChange
      this.debugFolder
        .add(this.sunLight, "intensity")
        .name("阳光强度")
        .min(0)
        .max(10)
        .step(0.001)

      this.debugFolder
        .add(this.sunLight.position, "x")
        .name("阳光X轴")
        .min(-5)
        .max(5)
        .step(0.001)

      this.debugFolder
        .add(this.sunLight.position, "y")
        .name("阳光Y轴")
        .min(-5)
        .max(5)
        .step(0.001)

      this.debugFolder
        .add(this.sunLight.position, "z")
        .name("阳光Z轴")
        .min(-5)
        .max(5)
        .step(0.001)

      //颜色
      this.debugFolder
        .addColor(this.sunLight, "color")

    }

  }
  //环境贴图
  setEnvironmentMap() {
    //环境贴图
    this.environmentMap = {};
    //环境贴图强度
    this.environmentMap.intensity = 2.4;
    //环境贴图纹理
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    //环境贴图纹理编码为sRGB
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;
    //将环境贴图添加到场景中
    this.scene.environment = this.environmentMap.texture;
    //更新材质
    this.environmentMap.updateMaterials = () => {
      //遍历场景中的所有子元素
      this.scene.traverse((child) => {
        //判断是否为网格材质
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          //设置环境贴图
          child.material.envMap = this.environmentMap.texture;
          //设置环境贴图强度
          child.material.envMapIntensity = this.environmentMap.intensity;
          //更新设置设为true
          child.material.needsUpdate = true;
        }
      });
    };
    // 初始调用一次更新材质
    this.environmentMap.updateMaterials();
    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, 'intensity')
        .name('地图强度')
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(() => this.environmentMap.updateMaterials());
    }
  }
}