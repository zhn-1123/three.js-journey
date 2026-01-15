import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI( )

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * 星系
 */
//参数对象
const parameters = {
    count: 10000, 
    size: 0.02,
    radius: 5,
    //分支数
    branches: 3,
    //旋转
    spin: 1,
    //随机数
    randomness: 0.2,
    //随机数强度
    randomnessPower: 3,
    //内部颜色
    insideColor: '#ff6030',
    //外部颜色
    outsideColor: '#1b3984'
}

let geometry = null
let material = null
let points = null

const generateGalaxy = () =>
{ 
    //检查旧数据，如果存在，则删除
    if (points !== null)
    {//删除旧数据，释放数据
        points.geometry.dispose()
        material.dispose()
        //移除点
        scene.remove(points)
    }

    //几何体
    geometry = new THREE.BufferGeometry()
    // 位置数组
    const positions = new Float32Array(parameters.count * 3)
    //颜色数组
    const colors = new Float32Array(parameters.count * 3)
    //设置内外部颜色
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)
    



    for (let i = 0; i < parameters.count; i++)
    {   
        //position
        const i3 = i * 3
        //随机半径
        const radius = parameters.radius * Math.random()
        //旋转,自选角度
        const spinAngle = radius * parameters.spin
        //随机角度,先对分支数取余数，让其变成0，1，2这种类型，然后除分支数，得到0，0.333，0.666这种类型
        //×2Π，得到一个弧度
        const branchesAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        //随机x
        const randomX = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        //随机z
        const randomZ = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        //y轴随机
        const randomY = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        //x轴随机
        positions[i3] =  Math.cos(branchesAngle + spinAngle) * radius + randomX
        //y轴随机
        positions[i3 + 1] =  0 + randomY
        //z轴随机
         positions[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius + randomZ
        
         //颜色
         //克隆内部颜色
         const mixColor = colorInside.clone()
        //用插值函数，让其一个颜色渐变到另一个颜色,后面为粒子距离除半径，让其变成一个0-1的数
        mixColor.lerp(colorOutside,radius / parameters.radius)
        //设置颜色属性,后面为红绿蓝
        colors[i3] = mixColor.r
        colors[i3 + 1] = mixColor.g
        colors[i3 + 2] = mixColor.b
    
    
    
        }
    // 设置位置属性
    geometry.setAttribute(
        'position', 
        new THREE.BufferAttribute(positions, 3))
    // 颜色属性
    geometry.setAttribute(
        'color', 
        new THREE.BufferAttribute(colors, 3))

    // 材质
     material = new THREE.PointsMaterial({
        // 大小
        size: parameters.size,
        // 大小随距离衰减
        sizeAttenuation: true,
        //深度测试
        depthWrite: false,
        /**
         * blending 属性定义了 WebGL 渲染中混合模式的行为。
         * 在 Three.js 中，blending 模式决定了物体的颜色如何与背景颜色或其他物体的颜色进行混合。
         * 
         * 该属性的值为 THREE.AdditiveBlending，表示使用加法混合模式。
         * 加法混合模式通常用于实现发光效果或粒子系统，其中颜色值会被相加而不是覆盖。
         * 
         * 参数说明：
         * - THREE.AdditiveBlending: 一种预定义的常量，表示加法混合模式。
         *   在这种模式下，源颜色和目标颜色会相加，公式为：
         *   result = source + destination
         * 
         * 返回值：
         * - 无返回值，因为这是一个属性定义，而非函数。
         */
        blending: THREE.AdditiveBlending,
        /**
         * vertexColors 属性表示是否为每个顶点分配独立的颜色。
         * 该属性通常用于3D图形渲染中，指示是否启用顶点级别的颜色处理。
         * 当设置为 true 时，每个顶点可以具有独立的颜色值，从而实现更精细的着色效果。
         * 如果设置为 false，则可能使用统一的颜色或其他着色策略。
         */
        vertexColors: true
    })
    
    // 点对象
     points = new THREE.Points(geometry, material)
    scene.add(points)

}

generateGalaxy()

// GUI
//onFinishChange,监听参数变化,停止后调动函数
gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()