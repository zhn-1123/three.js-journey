import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'


//阴影贴图算法有
//1.BasicShadowMap，性能更好但画质下降
//2.PCFShadowMap
//3.PCFSoftShadowMap，效果相同但有柔化效果，效果更好但性能稍差
//4.VSMShadowMap，效果有点奇怪，性能下降，约束更多，可能会产生意外效果
/**
 * Base
 */

// texture
const textureLoader = new THREE.TextureLoader()
//烘培好的阴影纹理
const bakedShadow = textureLoader.load('textures/bakedShadow.jpg')
//预烘培阴影纹理，这个可以通过改变不透明度，移动位置来配合球体移动
const simpleShadow = textureLoader.load('textures/simpleShadow.jpg')

// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
//只有三种灯光支持阴影效果，PointLight, SpotLight, DirectionalLight


// Ambient light
//环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)
// 开启投射阴影
directionalLight.castShadow = true
//优化阴影贴纸
//如何访问阴影贴纸的宽高，在平行光阴影对象中，
// 有图像渲染率，一般设定为5，可以改进但是在大规模渲染时要小心
directionalLight.shadow.mapSize.set(1024, 1024)
//上面与下面相同，必须使用2的次方，mipmap映射
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
//避免阴影出现错误，因为缩小了渲染范围，所以边缘可以看到更多细节
//平行光阴影相机的上方设为2
directionalLight.shadow.camera.top = 2
//平行光阴影相机的右侧设为2
directionalLight.shadow.camera.right = 2
//平行光阴影相机的左侧设为-2
directionalLight.shadow.camera.left = - 2
//平行光阴影相机的下边设为-2
directionalLight.shadow.camera.bottom = - 2
//平行光阴影相机的远景范围为6
directionalLight.shadow.camera.far = 6
//平行光阴影相机近景范围为1
directionalLight.shadow.camera.near = 1
//调整平行光阴影半径，可能会产生模糊效果
directionalLight.shadow.radius = 10

//创建平行光相机助手，平行光阴影相机的助手
const DirectionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
//隐藏平行光相机助手
DirectionalLightCameraHelper.visible = false
//添加
scene.add(DirectionalLightCameraHelper)

//Spot light
const spotLight = new THREE.SpotLight(
    //颜色
    0xffffff,
    //强度
    0.3,
    //光照范围
    10,
    //光照范围（角度）
    Math.PI * 0.3)
//开启投射阴影
spotLight.castShadow = true
//优化阴影贴纸,调整阴影地图尺寸
spotLight.shadow.mapSize.set(1024, 1024)
//视野角度为30度
spotLight.shadow.camera.fov = 30
//调整阴影相机的远景和近景
spotLight.shadow.camera.far = 6
spotLight.shadow.camera.near = 1
//调整聚光灯位置，getWorldPosition为世界坐标
//在你的场景中，因为聚光灯直接添加到了场景（scene）中，
// 所以它的局部坐标和世界坐标实际上是相同的。
// 只有当对象有父对象时，局部坐标和世界坐标才会有区别。
spotLight.position.set(0, 2, 2)
scene.add(spotLight)
//添加到场景中的隐形对象
scene.add(spotLight.target)
//添加聚光灯阴影相机助手
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
//隐藏阴影相机助手
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)


//Point light
const pointLight = new THREE.PointLight(0xffffff, 1)
//开启投射阴影
pointLight.castShadow = true
//优化阴影贴纸尺寸
pointLight.shadow.mapSize.set(1024, 1024)
//阴影相机远景和近景，点光源不能设置视角大小，他是渲染周围一切的
pointLight.shadow.camera.far = 5
pointLight.shadow.camera.near = 0.1
//移动点光源
pointLight.position.set(-1, 1, 0)
scene.add(pointLight)
//添加点光源阴影相机助手
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)


/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
//由于球体无法接收阴影，因为上面没有任何物体，所以只能使用投射阴影
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
    //定义材质用来使用预烘焙阴影
    // new THREE.MeshBasicMaterial(
    //     {
    //         使用预烘焙阴影
    //         map: bakedShadow
    //     }
    // )
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

//平面可以接收阴影
plane.receiveShadow = true

scene.add(sphere, plane)
//创建一个球体阴影，高度要略高于另一个平面，要不然会报错，不知道该渲染哪个
const sphereShadow = new THREE.Mesh(
    //创建一个平面，用于接收阴影
    //缓冲几何体，因为这个平面可以接收阴影
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial(
        {
            color: 0x000000,
            // 设置透明
            transparent: true,
            // 设置透明度，透明贴图
            alphaMap: simpleShadow
        }
    )
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01
scene.add(sphereShadow)

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
//启用阴影贴纸
renderer.shadowMap.enabled = false
//更改阴影贴纸类型，半径在PCFSoftShadowMap不起作用
renderer.shadowMap.type = THREE.PCFSoftShadowMap



/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update sphere
    //让球体绕圆周移动
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    //让球弹起来，abs为绝对值函数，让sinx绝对为正的
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    // Update shadow
    // 更新球体阴影的位置
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    //根据球的高度，更新球体阴影的透明度
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()