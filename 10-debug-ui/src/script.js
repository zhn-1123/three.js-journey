import * as THREE from 'three'
//引入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// GSAP库
import gsap from 'gsap'
//dat.gui 库的所有导出内容作为一个名为 dat 的命名空间导入到当前模块中。
import *as dat from 'dat.gui'

// Debug调试
const gui = new dat.GUI()
//调试界面中这些元素我称之为微调
//如Range适用于数值范围，这里设定一个最小值和最大值的数字
// Checkbox适用于布尔值，
// Color适用于颜色，
// Text适用于字符串，文本输入
// Select适用于选择列表，
// Function适用于函数，
// Button适用于触发事件，

// 创建一个对象，用于保存调试参数
const parameters = {
    color: 0xff0000,
    // 创建一个名为spin的函数,用于旋转
    spin: () => {
        // 使用gsap库的to方法，将旋转角度从当前值旋转到当前值加上10
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 })
    }
}
//调试颜色
gui
    .addColor(parameters, 'color')
    // 监听参数的修改，并执行回调函数
    .onChange(() => {
        mesh.material.color.set(parameters.color)
    })

gui
    .add(parameters, 'spin')


/**
 * Base
 */
// 选择html中的canvas画布
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
// 创建一个立方体,1111为长宽高2222为顶点数
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
//材质,颜色使用上面创建的参数颜色
const material = new THREE.MeshBasicMaterial({ color: parameters.color })
// 创建一个网格
const mesh = new THREE.Mesh(geometry, material)
// 设置可见性,false为不可见
mesh.visible = false
scene.add(mesh)

// Debug调试，我们带在创建相关变量后在进行这部操作
// 括号里为创建的变量名，属性名称，最小值，最大值，步进值
//我们可以通过min 和 max和step方法 调整值
// gui.add(mesh.position, 'y', -3, 3, 0.01).name('y轴坐标')
//gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('y轴坐标')
gui
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('y轴坐标')

gui
    //添加网格可见性
    .add(mesh, 'visible')
    .name('是否可见')

gui
    //添加网格线框
    .add(mesh.material, 'wireframe')
    .name('是否线框')


/**
 * Sizes
 */
//设置全屏显示
// 窗口大小
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// 监听窗口变化
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    // 更新摄像机的宽高比，以适应窗口尺寸的变化。
    camera.aspect = sizes.width / sizes.height
    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix()

    // Update renderer更新一下渲染器的尺寸和像素比率
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
// 透视相机，0.1为最近距离，100为最远距离
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// 启用轨道控制器的阻尼
controls.enableDamping = true

/**
 * Renderer
 */
// 创建一个WebGL渲染器
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
//设置渲染器的尺寸
renderer.setSize(sizes.width, sizes.height)
// 设置像素比
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
// 创建一个时钟对象
const clock = new THREE.Clock()
// 动画循环函数，让每一帧执行一次
const tick = () => {
    //获取从时钟启动开始经过的总时间（秒）
    const elapsedTime = clock.getElapsedTime()

    // Update controls，更新轨道控制器状态
    controls.update()

    // Render，再次执行实际的渲染操作，将场景通过摄像机视角渲染到画布上
    renderer.render(scene, camera)

    // Call tick again on the next frame，请求浏览器在下次重绘前再次执行tick函数
    window.requestAnimationFrame(tick)
}
//启动动画循环
tick()