//引入了 lil-gui 库，这是用于创建调试面板的轻量级库
import * as dat from 'lil-gui';

export default class Debug {
  constructor() {
    //创建调试，如果存在#debug，则创建调试
    this.active = window.location.hash === '#debug';
    if (this.active) {
      // 创建dat.GUI
      this.ui = new dat.GUI();
    }
  };
}
