import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import imageSource from './color.jpg'

// console.log(imageSource)
// // 添加这一行来输出完整URL，这样在开发者工具中就可以点击跳转了
// console.log('完整URL:', new URL('./color.jpg', import.meta.url).href)

// Texture
//加载管理器,用处是监听加载进度
const loadingManager = new THREE.LoadingManager()
// 监听加载开始
loadingManager.onStart = () => {
    console.log('开始加载')
}
// 监听加载完成
loadingManager.onLoad = () => {
    console.log('加载完成')
}
// 监听加载进度
loadingManager.onProgress = () => {
    console.log('正在加载')
}
// 监听加载出错
loadingManager.onError = () => {
    console.log('加载出错')
}
// 纹理加载器
const textureloader = new THREE.TextureLoader(loadingManager)
// 加载纹理,一个纹理加载器可以加载多个纹理
const colorTexture = textureloader.load('/textures/door/color.jpg')
const alphaTexture = textureloader.load('/textures/door/alpha.jpg')
const heightTexture = textureloader.load('/textures/door/height.jpg')
const normalTexture = textureloader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureloader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureloader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureloader.load('/textures/door/roughness.jpg')

// //repeat是二维的，设置重复次数
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// // // 设置纹理映射模式,为纹理重复
// // colorTexture.wrapS = THREE.RepeatWrapping
// // colorTexture.wrapT = THREE.RepeatWrapping

// // 设置纹理映射模式,为镜像重复
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// //设置纹理偏移
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// //设置纹理旋转,逆时针转一圈为2𝜋，旋转点为左下角
// colorTexture.rotation = Math.PI / 4
// // 设置纹理中心点
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5
// 纹理的mipmap,来提升性能
colorTexture.generateMipmaps = false

//调整这个均值滤波器，使纹理更平滑
// 设置纹理缩放,最邻近滤镜
colorTexture.minFilter = THREE.NearestFilter

//调整这个均值滤镜，使纹理更平滑
//最邻近滤镜
colorTexture.magFilter = THREE.NearestFilter

//UV展开，像是打开一个折纸，每个顶点都会在正方形上有个二维坐标
// 每个顶点还有UV坐标,UV坐标是二维的

// const image = new Image()
// // 创建纹理对象
// const texture = new THREE.Texture(image)
// //在图片加载时，将图片数据赋给纹理对象
// image.onload = () => {
//     // 通知three.js纹理对象数据已更新
//     texture.needsUpdate = true
//     // // 添加纹理对象到场景中
//     // scene.background = texture

// }
// // 加载图片 
// image.src = '/textures/door/color.jpg'



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
//设置映射（纹理）
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()