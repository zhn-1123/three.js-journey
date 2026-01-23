export default [
  // 资源列表
  { // 环境贴图
    name: 'environmentMapTexture',
    // 资源类型
    type: 'cubeTexture',
    // 资源路径（使用根路径和正确扩展名）
    path: [
      '/textures/environmentMap/px.jpg',
      '/textures/environmentMap/nx.jpg',
      '/textures/environmentMap/py.jpg',
      '/textures/environmentMap/ny.jpg',
      '/textures/environmentMap/pz.jpg',
      '/textures/environmentMap/nz.jpg',
    ]
  },

  { // 地面颜色纹理（课程示例使用 dirt 目录下的图片）
    name: 'grassColorTexture',
    type: 'texture',
    path: '/textures/dirt/color.jpg'
  },
  { // 地面法线纹理
    name: 'grassNormalTexture',
    type: 'texture',
    path: '/textures/dirt/normal.jpg'
  },
  {
    name: 'grassTexture',
    type: 'texture',
    path: '/textures/dirt/color.jpg'
  },
  {
    name: 'grassNormalTexture',
    type: 'texture',
    path: '/textures/dirt/normal.jpg'
  },
  {
    name: 'foxModel',
    type: 'gltfModel',
    path: '/models/Fox/glTF/Fox.gltf'
  }
]