import Robot from "./robot.js";
//子类  继承父类的属性和方法
export default class FlyingRobot extends Robot {
  //重写构造函数
  constructor(name, legs) {
    //super是基类的引用，调用父类的构造函数
    super(name, legs);
    //是调用基类的方法，如果用this.sayHi()，会调用子类重写的方法
    super.sayHi();
  };
  //重写父类的方法
  sayHi() {
    console.log(`I am ${this.name}`);
  }
  takeOff() {
    console.log(`have a good flight ${this.name}`);
  }
  land() {
    console.log(`welcome back ${this.name}`);
  }
}