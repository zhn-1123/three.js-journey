import Sizes from './utils/size.js';
import time from './utils/time.js';
import * as THREE from 'three'
import Camera from './camera.js';
import Renderer from './renderer.js';
import World from './world/world.js';
import Environment from './world/environment.js';
import Resources from './utils/resources.js';
import sources from './sources.js';
import Debug from './utils/debug.js';


//单例模式，保证Experience只有一个实例
let instance = null

export default class Experience {
  constructor(canvas) {
    //如果实例存在，直接返回该实例
    if (instance) {
      return instance
    }
    //将实例保存在实例变量中，然后在其他类中引用后面就可以使用同一个实例
    instance = this

    //将实例挂载到全局变量上，方便调试
    window.experience = this
    //保存canvas
    this.canvas = canvas
    //调试
    this.debug = new Debug()
    //尺寸
    this.sizes = new Sizes()
    //时间
    this.time = new time()
    //场景
    this.scene = new THREE.Scene()
    //资源
    this.resources = new Resources(sources)
    //相机，this指向Experience实例，传递给Camera
    this.camera = new Camera(this)//(this)可以传递Experience实例
    //渲染器
    this.renderer = new Renderer()
    //世界，在所有加载完成后创建
    this.world = new World()


    //监听尺寸变化，尺寸调整
    this.sizes.on('resize', () => {
      this.resize()
    })
    //监听时间变化，时间更新
    this.time.on('tick', () => {
      this.update()
    })
  }

  resize() {
    //调用相机的resize方法
    this.camera.resize()
    this.renderer.resize()
  }
  update() {
    //先相机更新，再渲染器更新
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }
  //销毁
  destroy() {
    //事件发生器一个方法，用来移除所有监听器
    this.sizes.off('resize')
    //移除时间监听器
    this.time.off('tick')
    //遍历删除所有场景对象
    this.scene.traverse((child) => {
      //判断是否为网格材质
      if (child instanceof THREE.Mesh) {
        //删除几何体
        child.geometry.dispose()
        //遍历材质属性
        for (const key in child.material) {
          //获取材质属性
          const value = child.material[key]
          //如果存在一个值，且有dispose方法，则调用该方法
          if (value && typeof value.dispose === 'function') {
            //调用dispose方法
            value.dispose()
          }
        }
      }
    })
    //处理相机控制器的删除
    if (this.camera && this.camera.controls) {
      this.camera.controls.dispose()
    }
    //处理渲染器的删除，
    //如果使用了后期处理如效果编辑器，特定通道和其他东西，需要释放这些资源，同时还要释放webgl渲染目标，在效果编辑器中
    this.renderer.instance.dispose()
    //销毁调试
    if (this.debug.active) {
      //销毁调试文件夹
      this.debug.ui.destroy()
    }
  }
}