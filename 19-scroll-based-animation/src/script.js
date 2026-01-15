import * as THREE from 'three'
import GUI from 'lil-gui'
import { color } from 'three/src/nodes/TSL.js'
import { texture } from 'three/tsl'
// import { Camera, Scene } from 'three/webgpu'
// import { ParametersGroup } from 'three/examples/jsm/inspector/tabs/Parameters.js'
//引入gsap
import gsap from 'gsap'
/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    // 监听颜色改变
    .onChange(() => {
        material.color.set(parameters.materialColor),
            particlesMaterial.color.set(parameters.materialColor)
    })
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * 对象
 */
//texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
// 设置贴图过滤器,为最邻近渐变滤镜
gradientTexture.magFilter = THREE.NearestFilter

//设置对象距离
const objectsDistance = 4
//网格色调材质
const material = new THREE.MeshToonMaterial({
    // 设置材质颜色，设置为gui中设置的颜色
    color: parameters.materialColor,
    // 材质的渐变纹理
    gradientMap: gradientTexture
})
const mesh1 = new THREE.Mesh(
    //创建圆环体，1：圆环的半径（从圆心到圆环中心的距离）
    //0.4：管状部分的半径（圆环管的粗细）16：圆环圆周上的分段数（影响圆环的平滑度）
    //60：管状部分圆周上的分段数（影响管状部分的平滑度）
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const mesh2 = new THREE.Mesh(
    /**
 * 创建一个圆锥几何体
 *radius - 圆锥底部的半径，默认值为1
 *height - 圆锥的高度，默认值为2
 *radialSegments - 圆锥周围的分段数，用于控制圆锥侧面的平滑度，默认值为32
 * {THREE.ConeGeometry} 返回一个圆锥几何体对象
 */
    new THREE.ConeGeometry(1, 2, 32),
    material
)

const mesh3 = new THREE.Mesh(
    /**
     * 创建一个环面纽结几何体
     * radius - 环面纽结的主半径，控制整体大小，默认值为1
     * tube - 管道半径，控制管道的粗细，默认值为0.4
     * tubularSegments - 管道段数，控制几何体的精细程度，默认值为64
     * radialSegments - 径向段数，控制管道圆形截面的精细程度，默认值为8
     * THREE.TorusKnotGeometry} 返回一个环面纽结几何体对象
     */
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.y = -objectsDistance * 0
mesh2.position.y = -objectsDistance * 1
mesh3.position.y = -objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

//数组
const sectionmeshes = [mesh1, mesh2, mesh3]


//粒子
const particlesCount = 200
//创建粒子位置数据
const positions = new Float32Array(particlesCount * 3)
for (let i = 0; i < particlesCount; i++) {
    //随机生成位置
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    //objectsDistance * 0.5让他在2个单位上开始随机生成，objectsDistance * sectionmeshes.length确保延伸到最下面的物体
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionmeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
const particlesGeometry = new THREE.BufferGeometry()
//设置粒子位置数据
particlesGeometry.setAttribute('position',
    //创建缓冲区属性
    new THREE.BufferAttribute(positions, 3))
//material
const particlesMaterial = new THREE.PointsMaterial({
    //设置材质颜色
    color: parameters.materialColor,
    size: 0.03,
    //尺寸衰减
    sizeAttenuation: true
})

//创建粒子对象
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

//light
const directionLight = new THREE.DirectionalLight('#ffffff', 1)
directionLight.position.set(1, 1, 0)
scene.add(directionLight)

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
//创建相机组
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
// Base camera
const camera = new THREE.PerspectiveCamera(
    //垂直视角为35度
    35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    //透明，默认透明为0
    alpha: true
})
// 设置背景颜色以及透明度
// renderer.setClearColor('#000000', 100)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//滚动
//获取滚动位置
let scrollY = window.scrollY
//滚动距离
let currentSection = 0
//监听滚动位置
window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    //对滚动距离取整
    const newSection = Math.round(scrollY / sizes.height)
    //滚动位置改变
    if (newSection != currentSection) {
        currentSection = newSection
        // 旋转
        gsap.to(sectionmeshes[currentSection].rotation, {
            duration: 1.5,
            //旋转角度
            //渐入渐出，慢慢开始和结束
            ease: 'power2.inOut',
            //旋转角度
            x: '+=6',
            y: '+=3',
        })
    }
})

//光标
const cursor = {}
cursor.x = 0
cursor.y = 0
window.addEventListener('mousemove', (event) => {
    // 设置光标位置，event.clientX / sizes.width为0-1之间
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
/**
 * 存储上一帧的时间戳，用于计算时间差(delta time)，实现基于时间的平滑动画
 * 通常在动画循环中与当前时间比较，计算出两次渲染之间的时间间隔
 */
let previousTime = 0
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // 时间间隔
    const deltaTime = elapsedTime - previousTime
    // 上一帧的时间戳
    previousTime = elapsedTime

    //camera
    /**
 * 根据页面滚动位置更新相机Y轴位置
 * 通过将页面滚动距离转换为3D场景中的相机位移，实现视差滚动效果
 * scrollY - 页面垂直滚动距离
 * sizes - 包含屏幕尺寸信息的对象
 * sizes.height - 屏幕高度
 * objectsDistance - 物体间距离的缩放因子
 * camera - 相机对象
 */
    camera.position.y = (-scrollY / sizes.height) * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5
    //+= (parallaxX - cameraGroup.position.x)*0.1能够产生平滑的效果
    // *deltaTime考虑的是时间间隔，在不同的设备上，刷新率差异，因此需要考虑时间间隔
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    //动画
    for (//遍历数组
        const mesh of sectionmeshes) {
        //因为我们每一帧都改变值，而我们只能提供一个值，所以即使有些只需要成对更新，到最后我们还是只能放入另一个值
        //所以我们用时间间隔来代替帧率，因为不是直接赋值而是设置，只需要改变值就可以加到当前的位置上
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()