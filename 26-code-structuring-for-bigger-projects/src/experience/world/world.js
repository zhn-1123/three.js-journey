import { Wireframe } from "three/examples/jsm/Addons.js";
import Experience from "../experience.js";
import Environment from "./environment.js";
import Floor from "./floor.js";
import Fox from "./fox.js";
/**
 * World 类负责管理场景中的所有3D对象
 * 它使用Experience单例来访问共享的核心组件
 */
export default class World {
  /**
   * World类的构造函数，用于初始化场景
   */
  constructor() {
    // 初始化Experience实例，这是一个全局单例，用于管理整个应用的核心组件
    // 通过单例模式确保整个应用中只有一个Experience实例
    // 这样可以方便地在不同模块间共享scene、camera、renderer等核心对象
    this.experience = new Experience();
    this.scene = this.experience.scene;
    // 获取资源管理器实例
    this.resources = this.experience.resources;

    //监听资源加载完成
    this.resources.on("ready", () => {
      // 创建一个Floor实例，用于添加地板
      this.floor = new Floor();
      // 创建一个Fox实例，用于添加狐狸
      this.fox = new Fox();
      // 创建一个Environment实例，用于添加环境Objects
      this.environment = new Environment();
    });
  }
  update() {
    // 如果存在Fox实例，则调用其update方法更新狐狸
    if (this.fox) {
      this.fox.update();
    }
  }
}