import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

//输出编码设置决定了渲染器的编码格式，默认输出编码是线性编码，我们需要将其设置为sRGB编码，以确保颜色显示正确
//伽马编码作用是为了让显示器能够更好地呈现图像的亮度和对比度，使得图像看起来更加自然和真实
//但是由于转换不同，可能得到错误的颜色结果，所以我们需要转换过来

//色调映射的目的是将高动态范围（HDR）图像映射到低动态范围（LDR）显示设备上，如0-1中的颜色值范围
//色调映射通过压缩亮度范围来实现这一点，从而保留图像的细节和对比度，防止过曝或欠曝现象
//伽马编码则像反过来，它通过非线性变换来调整图像的亮度和对比度，使得图像在显示设备上看起来更加自然和真实
//因此，色调映射和伽马编码是两个不同的概念，前者关注亮度范围的压缩，后者关注亮度和对比度的调整

//锯齿问题：在计算机图形学中，由于显示设备的分辨率有限，无法完美地表示连续的几何形状，导致边缘出现锯齿状的现象
//我们可以扩大渲染分辨率，然后再缩小回去，这样可以减少锯齿的出现，使图像看起来更加平滑和自然，这种叫超级采样抗锯齿（SSAA）
//但是这种方法会增加计算量，降低渲染性能，所以我们通常使用其他抗锯齿技术，如多重采样抗锯齿（MSAA）、快速近似抗锯齿（FXAA）等，这些方法在保持较高性能的同时，也能有效地减少锯齿现象


//msaa:多重采样抗锯齿，是一种通过在每个像素内采样多个点来减少锯齿现象的技术,但是他只在几何图形边缘起作用，对纹理细节没有影响
//fxaa:快速近似抗锯齿，是一种基于图像处理的抗锯齿技术，通过对整个图像进行模糊处理来减少锯齿现象,对纹理细节也有一定的影响
/**
* Loaders
*/
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
//立方体贴图加载器
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Base
 */
// Debug
const gui = new GUI()
//创建一个调试对象
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    //遍历场景中的所有子对象
    scene.traverse((child) => {
        //判断对象是否是 Mesh
        if (child.isMesh && !child.isPortalMesh) {
            // //更新其材质的环境贴图，scene.environment = environmentMap有这个代码，这里就不需要了
            // child.material.envMap = environmentMap
            //更新其材质的环境贴图强度
            child.material.envMapIntensity = debugObject.envMapIntensity
            //开启对象投射阴影
            child.castShadow = true
            //开启对象接收阴影
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/environmentMaps/0/px.png',
    '/environmentMaps/0/nx.png',
    '/environmentMaps/0/py.png',
    '/environmentMaps/0/ny.png',
    '/environmentMaps/0/pz.png',
    '/environmentMaps/0/nz.png'
])
scene.background = environmentMap
//将场景环境设为环境贴图
scene.environment = environmentMap
//设置环境贴图的编码格式为sRGB编码,模型其他种类的纹理不要用sRGB编码，否则会出现颜色偏差
environmentMap.encoding = THREE.sRGBEncoding
//环境贴图强度
debugObject.envMapIntensity = 5
//改变所有材质的环境贴图强度
gui
    .add(debugObject, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials)


// // Intensity
// scene.environmentIntensity = 1
// gui
//     .add(scene, 'environmentIntensity')
//     .min(0)
//     .max(10)
//     .step(0.001)

// // HDR (RGBE) equirectangular
// rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping

//     scene.background = environmentMap
//     scene.environment = environmentMap
// })



/**
 * Models
 */
// Helmet
gltfLoader.load(
    '/models/hamburger.glb',
    (gltf) => {
        gltf.scene.scale.set(0.3, 0.3, 0.3)
        gltf.scene.position.set(0, -4, 0)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)
        gui.add(gltf.scene.rotation, 'y')
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.001)
            .name('rotation')
        updateAllMaterials()
    }
)

// Lights
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(0.25, 3, -2.25)
//开启光源投射阴影
directionalLight.castShadow = true
//设置阴影贴图远距
directionalLight.shadow.camera.far = 15
//设置阴影贴图分辨率
directionalLight.shadow.mapSize.set(1024, 1024)
//由于精度问题，汉堡自身产生阴影，解决办法为调整阴影偏差和法线偏差
//保存汉堡阴影图时，沿着法线推动汉堡模型表面
// 也就是汉堡能制造的阴影变小了，从而避免了阴影伪影
//可能在平面上遇到这种阴影缺陷，那种用阴影偏差就可以解决
//directionalLight.shadow.bias = -0.0001，这样对阴影干扰更小
//调整法线偏差
directionalLight.shadow.normalBias = 0.05
scene.add(directionalLight)

// //方向光相机助手
// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')


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
    canvas: canvas,
    antialias: true //开启抗锯齿
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//开启物理光照模式，这样在不同软件中更容易保持一致的光照效果
renderer.physicallyCorrectLights = true
//设置输出编码为sRGB编码
renderer.outputEncoding = THREE.sRGBEncoding
//设置色调映射方式为
renderer.toneMapping = THREE.ACESFilmicToneMapping
//设置色调映射曝光度，默认1，值越大，图像越亮
renderer.toneMappingExposure = 3
//开启阴影贴图
renderer.shadowMap.enabled = true
//设置阴影贴图的类型为PCF软阴影
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMapping', {
    // 选择不同的色调映射算法
    // 无
    No: THREE.NoToneMapping,
    // 线性
    Linear: THREE.LinearToneMapping,
    // Reinhard
    Reinhard: THREE.ReinhardToneMapping,
    // 电影
    Cineon: THREE.CineonToneMapping,
    // ACES电影
    ACESFilmic: THREE.ACESFilmicToneMapping
}).onChange(() => {
    //每当更改色调映射算法时，重新渲染场景
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterials()
})
//调整色调映射曝光度
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001).name('曝光度')

//色调映射有多种算法可供选择，每种算法都有其独特的特点和适用场景
// renderer.toneMapping = THREE.NoToneMapping//不进行色调映射，适用于已经在0-1范围内的图像
// renderer.toneMapping = THREE.LinearToneMapping//线性色调映射，适用于需要线性调整亮度的图像
// renderer.toneMapping = THREE.ReinhardToneMapping//Reinhard色调映射，适用于需要平衡亮度和对比度的图像
// renderer.toneMapping = THREE.CineonToneMapping//Cineon色调映射，适用于电影和视频内容
// renderer.toneMapping = THREE.ACESFilmicToneMapping//ACES Filmic色调映射，适用于需要高动态范围和电影级质量的图像

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()