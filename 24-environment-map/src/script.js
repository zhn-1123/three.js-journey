import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入RGBELoader用于加载HDR环境贴图
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
//导入EXRLoader用于加载EXR环境贴图
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
// //地面投影天空盒（examples 路径）
// import { GroundProjectedSkybox } from 'three/examples/jsm/objects/GroundProjectedSkybox.js'

//但官方推荐使用addons路径，因为它代表了更现代的模块组织方式。随着Three.js的发展，未来可能会逐步弃用examples/jsm路径。
//使用addons路径的好处包括：
//更清晰的模块分类和组织
//与Three.js核心代码更好的分离
//更好的模块独立性和维护性

//图层
//像类别一样使用，所有继承3D对象的类都可以使用图层，包括场景、相机、网格等。默认情况下，所有对象都在图层0上。
//但如果你把相机设置在特定层如图层1层2上，那么它将只渲染图层1图层2上的对象，忽略其他图层的对象。
//图层允许你将对象分组，并通过相机选择性地渲染这些组。例如，你可以将某些对象放在一个图层上，而将其他对象放在另一个图层上，然后配置相机只渲染特定的图层。
//这样可以实现复杂的渲染效果，比如仅渲染特定对象、创建多视图场景等。



//加载器
const gltfLoader = new GLTFLoader()
//立方体纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader()
//HDR环境贴图加载器
const rgbeLoader = new RGBELoader()
//EXR环境贴图加载器
const exrLoader = new EXRLoader()
//纹理加载器
const textureLoader = new THREE.TextureLoader()


/**
 * Base
 */
// Debug
const gui = new GUI()
//全局对象
const global = {}
// // 添加一个变量来存储环境贴图
// let environmentMap = null

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//更新材质函数
const updateAllMaterials = () => {
    //遍历场景中的所有子元素
    scene.traverse((child) => {
        //如果子元素是网格且材质是标准网格材质，则更新其环境贴图强度并启用阴影
        if (child.isMesh && child.material.isMeshStandardMaterial
            // child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial
        ) {
            //开启环境贴图对物体的影响
            child.material.envMap = environmentMap; // 添加这行，为每个材质设置envMap
            child.material.envMapIntensity = global.envMapIntensity
        }
    })
}

//HDR环境贴图(EXR)
// exrLoader.load('/environmentMaps/nvdiaCanvas-4k.exr', (environmentMap) => {
//     //告诉three.js他是等距圆柱投影的环境贴图
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping
//     //将环境贴图应用到场景中
//     scene.background = environmentMap
//     //将环境贴图应用到场景中
//     scene.environment = environmentMap
// })

//环境贴图
//背景模糊
scene.backgroundBlurriness = 0.2
//背景强度,也就是曝光度
scene.backgroundIntensity = 5
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001)
//设置全局强度
global.envMapIntensity = 1
gui.add(global, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials)

// //LDR立方体纹理，LDR表示低动态范围图像，HDR表示高动态范围图像
//EXR仍属于hdr但是编码不同
// //我们通常称HDRI的i为图像，色彩范围值高，只有一个文件
// const environmentMap = cubeTextureLoader.load([
//     '/environmentMaps/2/px.png',
//     '/environmentMaps/2/nx.png',
//     '/environmentMaps/2/py.png',
//     '/environmentMaps/2/ny.png',
//     '/environmentMaps/2/pz.png',
//     '/environmentMaps/2/nz.png'
// ])
// //将环境贴图应用到场景中
// scene.background = environmentMap
// //将环境贴图应用到场景中
// scene.environment = environmentMap

//HDR(RGBE)环境贴图RGBE表示红绿蓝和强度，加载更慢
// rgbeLoader.load('/Blender-2k.hdr', (environmentMap) => {
//     //告诉three.js他是等距圆柱投影的环境贴图
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping
//     //将环境贴图应用到场景中
//     scene.background = environmentMap
//     //将环境贴图应用到场景中
//     scene.environment = environmentMap
// })

// //LDR环境贴图
// const environmentMap = textureLoader.load('/equirectangular_map_1768546525768.jpg')
// environmentMap.mapping = THREE.EquirectangularReflectionMapping
// //文件采用的是sRGB色彩空间，默认情况下，three.js认为色域是线性的，需要转换为线性空间
// environmentMap.colorSpace = THREE.SRGBColorSpace
// //将环境贴图应用到场景中
// scene.background = environmentMap
// scene.environment = environmentMap

// //新的地面投影的环境贴图
// rgbeLoader.load('/environmentMaps/2/2k.hdr', (environmentMap) => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping
//     scene.background = environmentMap
//     //实例化地面投影天空盒
//     const skybox = new GroundProjectedSkybox(environmentMap)
//     skybox.scale.setScalar(50) // 设置天空盒的大小
//     scene.add(skybox)
//     skybox.height = 11  //初始高度
//     skybox.radius = 120  //初始半径
//     //调整半径和高度
//     gui.add(skybox, 'radius',1,200,0.1).name('skyboxRadius')
//     gui.add(skybox, 'height',1,200,0.1).name('skyboxHeight')
// })

//实时环境贴图
const environmentMap = textureLoader.load('/equirectangular_map_1768546525768.jpg')
environmentMap.mapping = THREE.EquirectangularReflectionMapping
//文件采用的是sRGB色彩空间，默认情况下，three.js认为色域是线性的，需要转换为线性空间
environmentMap.colorSpace = THREE.SRGBColorSpace
//将环境贴图应用到场景中
scene.background = environmentMap
scene.environment = environmentMap

//甜甜圈
const holyDonut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({
        color: new THREE.Color(10, 4, 2),
    })
)
holyDonut.layers.enable(1) // 启用在图层1
holyDonut.position.y = 3.5
scene.add(holyDonut)

//立方体渲染
//用来放置渲染的纹理
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    //默认我们没有hdr值，只会有LDR值，HDR有半浮点和浮点（32位来覆盖广泛的数值）类型
    type: THREE.HalfFloatType
})
//将立方体渲染目标设置为环境,这样场景中的物体就会被渲染到这个立方体纹理中,仅用来照明
scene.environment = cubeRenderTarget.texture

//立方体摄像机
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1) // 设置立方体摄像机只渲染图层1上的对象

//tourusKnot
const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: 0,
        metalness: 1,
        color: '0xaaaaaa'
    })
)
knot.position.set(-4, 4, 0)
scene.add(knot)


//模型
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    const model = gltf.scene
    model.scale.set(10, 10, 10)
    model.position.set(0, 0, 0)

    // 等待模型添加到场景后再更新材质，这样环境贴图强度就能生效
    scene.add(model)

    // 更新模型中所有材质的环境贴图
    updateAllMaterials()
})
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
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
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
    // Time
    const elapsedTime = clock.getElapsedTime()

    //实时更新环境贴图
    if (holyDonut) {
        holyDonut.rotation.x = Math.sin(elapsedTime) * 2
        //更新立方体摄像机
        cubeCamera.update(renderer, scene)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()