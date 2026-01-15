import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
//引入矩形光助手
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
//环境光，第一个是颜色、第二个是强度，提供全方位光照
// const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
// //ambientLight.color = new THREE.Color(0xffffff)
// //ambientLight.intensity = 1.5
// scene.add(ambientLight)

// gui.add(ambientLight, 'intensity').min(0).max(10).step(0.1).name('ambient light intensity')

//方向光，第一个是颜色、第二个是强度、第三个是位置,
//看起来似乎有光从上方照射下来
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

//半球形光，第一个是颜色、第二个是颜色、第三个是强度
//底部是紫色，顶部是红色
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1)
scene.add(hemisphereLight)

//点光源，第一个是颜色、第二个是强度、第三个是光衰减距离
//点光源可以调节光衰减以及光开始衰减的距离
const pointLight = new THREE.PointLight(0xff9000, 1.5, 3)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

//矩形区域光，只支持网络标准材质和物理材质
//矩形区域光，第一个是颜色、第二个是强度、第三个为宽度、第四个是高度
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
//矩形区域光需要lookAt,改变指定方向,new THREE.Vector3()默认为0,0,0
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

//SpotLight光，聚光灯，像手电筒一样，第一个参数是颜色、第二个是强度、第三个是光衰减距离、
// 第四个光束角度，第五个为模糊度，边缘会变模糊，第六个参数是点光源的衰减效果
const spotLight = new THREE.SpotLight(0x78ff00, 1.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

//不能靠旋转的四元数来定向，不能用lookat控制聚光灯
//他是一个对象，但是没有在场景中显现，只是纯理论的概念
//我们需要把这个物体添加到场景
scene.add(spotLight.target)
spotLight.target.position.x = 0.75
//灯光会大幅影响性能，最低耗能的灯是环境光和半球光
//中成本的有方向光和点光源
//聚光灯和矩形光区对性能消耗较大

//光照烘培，理念是将灯光烘培到材质里，使用3d软件在材质中烘培灯光

//光源辅助工具Helpers
//半球光助手，第一个值是半球光，第二个值为助手大小
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

//方向光助手
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

//点光助手
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

//聚光灯助手
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

//矩形区域光助手，需要引入
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

/**
 * Objects
 */
// Material，网络标准材质需要光照才能看到物理上正确的效果
const material = new THREE.MeshStandardMaterial()
//材质粗糙度
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.z = 2
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()