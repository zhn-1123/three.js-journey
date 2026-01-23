import Experience from "../experience.js";
import * as THREE from "three";

export default class Fox {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    //获取资源
    this.resource = this.resources.items.foxModel;
    //调试
    this.debug = this.experience.debug;
    //调试文件夹
    if (this.debug.active) {
      //用于创建一个名为"fox"的调试文件夹，使用的是lil-gui库的功能。
      this.debugFolder = this.debug.ui.addFolder("fox");
    }


    this.setModel();
    this.setAnimation();
  }
  //创建狐狸
  setModel() {
    //获取狐狸模型
    this.model = this.resource.scene;
    //缩放狐狸
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        //创建阴影
        child.castShadow = true;
      }
    })
  }
  //创建动画
  setAnimation() {
    //获取动画
    this.animation = {}
    //创建动画
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    // //剪辑动作，单个动作
    // this.animation.action = this.animation.mixer.clipAction(this.resource.animations[0]);
    // this.animation.action.play();
    // 创建动作
    this.animation.actions = {}
    //剪辑动作，将动画添加到空闲动作中
    this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]);
    //剪辑动作，将动画添加到行走动作中
    this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1]);
    //剪辑动作，将动画添加到跑步动作中
    this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2]);
    //决定执行哪个动作，设置空闲为默认动作
    this.animation.actions.current = this.animation.actions.idle;
    //播放默认动作
    this.animation.actions.current.play();
    this.animation.play = (name) => {
      //新动作
      const newAction = this.animation.actions[name];
      //旧动作
      const oldAction = this.animation.actions.current;
      //设置新动作
      newAction.reset();
      //播放新动作
      newAction.play();
      //交叉过渡，过渡时间为1秒
      newAction.crossFadeFrom(oldAction, 1);
      //将新动作设为当前动作
      this.animation.actions.current = newAction;
    }
    // Debug，用户界面调试
    if (this.debug.active) {
      const debugObject = {
        //播放空闲动画
        '空闲动作': () => {
          this.animation.play('idle')
        },
        //播放走路动画
        '行走动作': () => {
          this.animation.play('walking')
        },
        //播放跑步动画
        '跑步动作': () => {
          this.animation.play('running')
        }
      }
      //添加按钮
      this.debugFolder.add(debugObject, '空闲动作')
      this.debugFolder.add(debugObject, '行走动作')
      this.debugFolder.add(debugObject, '跑步动作')
    }
  }
  update() {
    //更新动画
    this.animation.mixer.update(this.time.delta * 0.001);
  }
}