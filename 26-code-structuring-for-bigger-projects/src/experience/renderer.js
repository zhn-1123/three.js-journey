import * as THREE from "three";
import Experience from "./experience.js";

export default class Renderer {
  constructor() {

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera;
    this.canvas = this.experience.canvas;

    this.setIstance();
  }
  setIstance() {
    //渲染器
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      // 抗锯齿
      antialias: true,
    });
    //物理光照
    this.instance.physicallyCorrectLights = true;
    //颜色编码
    this.instance.outputEncoding = THREE.sRGBEncoding;
    //设置渲染器的色调映射算法为 Cineon 标准
    this.instance.toneMapping = THREE.CineonToneMapping;
    //曝光度
    this.instance.toneMappingExposure = 1.75;
    //阴影
    this.instance.shadowMap.enabled = true;
    //阴影质量为软阴影
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    //背景设为黑色
    this.instance.setClearColor('#211d20');
    //设置渲染器的像素比
    this.instance.setSize(this.sizes.width, this.sizes.height);
    //设置渲染器的设备像素比
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }
  resize() {
    //更新渲染器的宽高
    this.instance.setSize(this.sizes.width, this.sizes.height);
    //更新渲染器的像素比
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }
  update() {
    //渲染场景
    this.instance.render(this.scene, this.camera.instance);
  }

}
