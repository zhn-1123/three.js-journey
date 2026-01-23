import Sizes from './utils/size.js';
import time from './utils/time.js';

export default class Experience {
  constructor(canvas) {
    //将实例挂载到全局变量上，方便调试
    window.experience = this
    //保存canvas
    this.canvas = canvas
    //尺寸
    this.sizes = new Sizes()
    //时间
    this.time = new time()
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
    console.log('resize')
  }
  update() {
    // console.log('update')
  }
}