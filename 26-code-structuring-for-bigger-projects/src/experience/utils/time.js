import EventEmitter from "./EventEmitter.js";
export default class time extends EventEmitter {
  constructor() {
    super()
    //记录初始时间
    this.start = Date.now()
    //记录当前时间
    this.current = this.start
    //总共经过的时间
    this.elapsed = 0
    //两帧之间的时间差,不设置为0，防止报错
    this.delta = 16
    //每一帧调用一次tick方法
    window.requestAnimationFrame(() => this.tick())
  }
  tick() {
    //计算当前时间戳
    const currentTime = Date.now()
    //计算两帧之间经过的时间
    this.delta = currentTime - this.current
    //计算总共经过的时间
    this.elapsed = currentTime - this.start
    this.current = currentTime
    //触发tick事件
    this.trigger('tick')
    //下一帧继续调用tick方法
    window.requestAnimationFrame(() => this.tick())
  }
}