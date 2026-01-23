import Experience from './experience.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


export default class Camera {
  constructor(experience) {
    // //访问Experience实例,但是其他开发者可能改动，造成错误
    // this.experience = window.experience
    //通过参数传递Experience实例，更加稳定
    this.experience = experience
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    this.setOrbitControls()
  }

  //设置相机
  setInstance() {
    this.instance = new THREE.PerspectiveCamera(35,
      // 视口宽度/视口高度,是宽高比
      this.sizes.width / this.sizes.height,
      0.1,
      1000)
    // 相机位置
    this.instance.position.set(6, 4, 8)
    this.scene.add(this.instance)
  }
  setOrbitControls() {
    // 创建控制器
    this.controls = new OrbitControls(this.instance, this.canvas)
    // 设置控制器阻尼，让控制器更真实，需要每帧更新一次
    this.controls.enableDamping = true
  }

  resize() {
    // 更新相机宽高比
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }
  update() {
    // 更新控制器
    this.controls.update()
  }
}