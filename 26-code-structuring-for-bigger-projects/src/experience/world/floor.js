import Experience from "../experience.js";
import * as THREE from 'three'

export default class Floor {
  constructor() {
    // Floor 类负责创建并配置地面（mesh），然后添加到全局 scene
    // 通过 Experience 单例获取 scene 和已加载的资源
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry()
    this.setTexture()
    this.setMaterial()
    this.setMesh()
  }
  // 创建地板
  setGeometry() {
    // 创建地板的几何体
    // 这里使用 CircleGeometry 创建一个圆盘形地面，参数为半径和分段数
    this.geometry = new THREE.CircleGeometry(5, 64)
  }
  // 创建纹理
  setTexture() {
    //创建纹理
    this.texture = {}
    //草地颜色纹理
    this.texture.color = this.resources.items.grassColorTexture
    //设置纹理编码
    // 纹理的色彩空间编码，确保颜色显示正确
    this.texture.color.encoding = THREE.sRGBEncoding
    //设置纹理重复为1.5
    this.texture.color.repeat.set(1.5, 1.5)
    // 当 UV 超出 [0,1] 区间时，使用重复平铺（RepeatWrapping）
    this.texture.color.wrapS = THREE.RepeatWrapping
    this.texture.color.wrapT = THREE.RepeatWrapping

    //草地法线纹理
    this.texture.normal = this.resources.items.grassNormalTexture
    //设置纹理重复为1.5
    this.texture.normal.repeat.set(1.5, 1.5)
    // 当 UV 超出 [0,1] 区间时，使用重复平铺（RepeatWrapping）
    this.texture.normal.wrapS = THREE.RepeatWrapping
    this.texture.normal.wrapT = THREE.RepeatWrapping
  }
  // 创建材质
  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      // 设置材质颜色纹理
      map: this.texture.color,
      // 设置材质法线纹理
      normalMap: this.texture.normal
    })
  }
  // 创建地板网格
  setMesh() {
    // 创建地板网格
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    // 设置地板位置
    this.mesh.rotation.x = -Math.PI / 2
    // 接收阴影
    this.mesh.receiveShadow = true
    // 将地板添加到场景中
    this.scene.add(this.mesh)
  }
}