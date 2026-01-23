//引入EventEmitter类
import EventEmitter from "./EventEmitter.js";
//创建Sizes类，继承EventEmitter类
export default class Sizes extends EventEmitter {
  constructor() {
    super();
    // 设置初始宽高
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    //像素比，限制最大为2，取窗口设备像素比和2的最小值
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    //监听窗口变化
    window.addEventListener('resize', () => {
      //更新宽高
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      //触发一个事件，通知外部窗口变化了
      this.trigger('resize');
    });
  }
}