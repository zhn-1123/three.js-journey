//类
export default class Robot {
  //构造函数
  constructor(name, legs) {
    //this指代当前实例化的对象
    this.name = name;
    this.legs = legs;
    console.log(`I am ${name}`);
    this.sayHi();
  }
  sayHi() {
    console.log('Hello World!');
  }
}