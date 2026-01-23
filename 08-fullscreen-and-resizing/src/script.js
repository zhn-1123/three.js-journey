import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    //将视口大小改成窗口
    width: window.innerWidth,
    height: window.innerHeight
}

// 监听窗口变化
window.addEventListener('resize', () => {
    // Update sizes更新尺寸
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera更新摄像机
    camera.aspect = sizes.width / sizes.height
    // 告诉摄像机更新投影矩阵
    camera.updateProjectionMatrix()

    // Update renderer更新渲染器
    renderer.setSize(sizes.width, sizes.height)
    //像素比是屏幕的像素密度如一个像素有4个像素点，那么像素比为2，像十字一样
    //同理，一个像素点有16个像素点，那么像素比为4
    //window.devicePixelRatio是屏幕的像素密度
    //设置像素比，取较小值
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//监听双击事件
window.addEventListener('dblclick', () => {
    //fullscreenElement是全屏元素，webkitFullscreenElement是webkit全屏元素
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    //全屏
    //全屏API
    //全屏API是HTML5新增的API，用于控制浏览器窗口的显示模式
    //全屏API有2个方法
    //1.全屏方法
    //全屏方法用于将浏览器窗口切换到全屏模式
    //全屏方法有2个参数
    //1.element:要全屏的元素
    //2.options:全屏的选项
    if (!fullscreenElement) {
        //请求全屏并进入全屏
        if (canvas.requestFullscreen) {
            //请求全屏
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) {
            //请求全屏
            canvas.webkitRequestFullscreen()
        }
    } else {
        //退出全屏
        if (document.exitFullscreen) {
            //退出全屏
            //从文档中退出全屏，在Safari浏览器中，这种简单功能会慢一拍
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
            //退出全屏
            document.webkitExitFullscreen()
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
//关闭轨道控制
//controls.enabled = false
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