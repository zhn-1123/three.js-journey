import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
// //widthSegments, heightSegments, depthSegments分别是宽度，高度，深度的分段
// //这样可以控制每个面上的三角形的数量

//我们将使用Float32Array来创建顶点数据
//Float32Array只能存储浮点数，不能存储布尔值也不能嵌套其他数组，有特定的长度
//创建顶点数据，创建一个三角形有三个顶点所以有九个数据
// const positionsArray = new Float32Array([
//     // 第一个顶点的x,y,z
//     0, 0, 0,
//     // 第二个顶点的x,y,z
//     0, 1, 0,
//     // 第三个顶点的x,y,z
//     1, 0, 0,
// ])
// // 创建顶点缓冲属性
// const positionsAttribute = new THREE.BufferAttribute(
//     positionsArray,
//     // 每个顶点有3个数据
//     3
// )

// 创建缓冲几何体
const geometry = new THREE.BufferGeometry()
// 将顶点属性添加到缓冲几何体中
//'position'为传递的属性值的名称
//geometry.setAttribute('position', positionsAttribute)

//创建一个计数变量为50
const count = 50
//创建位置数组，每个三角形有3个顶点，每个顶点有3个数据
const positionsArray = new Float32Array(count * 3 * 3)
for (let i = 0; i < count * 3 * 3; i++) {
    // 获取当前索引位置的顶点数据，范围是-0.5到0.5之间
    positionsArray[i] = Math.random() - 0.5
}
// 创建位置属性
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
// 将位置属性添加到缓冲几何体中
geometry.setAttribute('position', positionsAttribute)

const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    // 是否显示线框
    wireframe: true
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
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