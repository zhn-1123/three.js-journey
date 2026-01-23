//用来管理不同资源加载的类，防止加载完成顺序不同导致错误
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "./EventEmitter.js";


export default class Resources extends EventEmitter {

  constructor(sources) {
    super();
    //资源列表
    this.sources = sources;
    //已加载的资源列表
    this.items = {};
    //需要加载的资源数量
    this.toLoad = this.sources.length;
    //已加载的资源数量
    this.loaded = 0;
    //创建加载器
    this.setLoaders();
    //开始加载资源
    this.startLoading();
  }
  //设置加载器
  setLoaders() {
    //保存到实例变量中
    this.loaders = {};
    //创建gltf加载器
    this.loaders.gltfLoader = new GLTFLoader();
    //创建纹理加载器
    this.loaders.textureLoader = new THREE.TextureLoader();
    //创建立方体纹理加载器
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }
  //开始加载资源
  startLoading() {
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        //使用gltf加载器加载gltf资源
        this.loaders.gltfLoader.load(source.path,
          (file) => {
            // 将加载的资源保存到items中
            this.sourcesLoaded(source, file);
          })
      }
      else if (source.type === "texture") {
        //使用纹理加载器加载纹理资源
        this.loaders.textureLoader.load(source.path,
          (file) => {
            // 将加载的资源保存到items中
            this.sourcesLoaded(source, file);
          }
        )
      }
      else if (source.type === "cubeTexture") {
        //使用立方体纹理加载器加载立方体纹理资源
        this.loaders.cubeTextureLoader.load(source.path,
          (file) => {
            // 将加载的资源保存到items中
            this.sourcesLoaded(source, file);
          }
        )
      }
    }
  }
  //资源已加载完成
  sourcesLoaded(source, file) {
    //将加载的资源保存到items中
    this.items[source.name] = file;
    //加载完成，触发loaded事件
    this.loaded++;
    if (this.loaded === this.toLoad) {
      //触发ready事件，通知外部资源已加载完成
      this.trigger('ready');
    }
  }
}
