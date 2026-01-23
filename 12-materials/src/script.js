import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { min } from 'three/tsl'
// GUI
import * as dat from 'dat.gui'

// debug
//实例化gui
const gui = new dat.GUI()



//纹理贴图
//创建纹理加载器
const textureLoader = new THREE.TextureLoader()
//创建立方体纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader()
//颜色贴图
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
//透明贴图
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
//环境遮挡贴图
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
//高度贴图
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
//金属贴图
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
//法线贴图
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
//粗糙贴图
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
//材质贴图
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
//渐变贴图
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
//对渐变贴图设置为最邻滤镜
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
//因为我们使用了最邻近滤器，所以不需要设置MIP映射
gradientTexture.generateMipmaps = false

const environmentMapTexture = cubeTextureLoader.load([
    //提供各个方向的纹理，共六个
    // px: 右，正x方向
    'textures/environmentMaps/04/px.png',
    // nx: 左，负x方向
    'textures/environmentMaps/04/nx.png',
    // py: 上，正y方向
    'textures/environmentMaps/04/py.png',
    // ny: 下，负y方向
    'textures/environmentMaps/04/ny.png',
    // pz: 前，正z方向
    'textures/environmentMaps/04/pz.png',
    // nz: 后，负z方向
    'textures/environmentMaps/04/nz.png'
])

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
// Material材质
//const material = new THREE.MeshBasicMaterial()
// // 颜色贴图
// material.map = doorColorTexture
// // 颜色
// material.color = new THREE.Color('red')
//material.wireframe = true
// material.opacity = 0.5
//material.transparent = true
//material.alphaMap = doorAlphaTexture
//侧面显示，可以设置三种不同的值，分别为前侧，后侧和双面
//前侧为默认显示，为FromSide,后侧为BackSide，双面为DoubleSide
//material.side = THREE.DoubleSide

//网格法线材质:法线代表信息，包含面向的外部方向，
// 如对于球体，球体的法线会朝外，对于平面，法线会朝上,
// 网格法线材质显示这些方向
//const material = new THREE.MeshNormalMaterial()
//material.flatShading = true

// //把网格材质设置成新的自由网格材质球
// const material = new THREE.MeshMatcapMaterial()
// //设置材质球
// material.matcap = matcapTexture

// //网格深度材质，
// // 如果靠近相机近点时，网格深度材质会把几何体涂成白色，
// // 如果靠近远点时，网格深度材质会涂成黑色
// //可以用于制作雾效和预处理
// const material = new THREE.MeshDepthMaterial()

// //最简单的光反应材质，虽然Lambert材质球最简单，但是在几何体上会看到一些奇怪的图案
// const material = new THREE.MeshLambertMaterial()

// 网格Phong材质,效果一样，但是更复杂，线条边缘会更平滑，光线也反射了
//缺点：性能不如网格材质
// const material = new THREE.MeshPhongMaterial()
// // 设置高光材质的 Shininess 值，使光反射效果更佳
// material.shininess = 100
// //可以用高光来改变颜色，高光跟网络基本材质颜色一样，必须为三色
// material.specular = new THREE.Color(0xff0000)

// //网格转换材质,新建网格卡通材质
// const material = new THREE.MeshToonMaterial()
// //设置渐变贴图
// //mac滤镜在试图修正这个非常小的纹理，并把他拉伸，通过MIP映射模糊化处理，
// // 如果我们想避免这种情况，可以使用最邻滤镜，看26行
// material.gradientMap = gradientTexture


//标准网格材质，遵循物理渲染原则，就是PBR，模拟现实条件
//类似Lambert和fong材质，支持光照，但算法更逼真，拥有更优的参数
const material = new THREE.MeshStandardMaterial()
//金属度
material.metalness = 0.7
//粗糙度
material.roughness = 0.2
// material.map = doorColorTexture
// //环境遮挡贴图
// material.aoMap = doorAmbientOcclusionTexture
// //调整环境遮挡贴图强度
// material.aoMapIntensity = 1
// //置换贴图或高度贴图，是一样的
// //由于我们的几何体顶点不足，所以中央的平面没动，所以我们需要添加一些细节,
// // 所以添加各个几何体顶点数
// material.displacementMap = doorHeightTexture
// //位移缩放材质，用来将顶点移动，效果减弱
// material.displacementScale = 0.05
// //金属贴图
// material.metalnessMap = doorMetalnessTexture
// //粗糙度贴图
// material.roughnessMap = doorRoughnessTexture
// //法线贴图
// material.normalMap = doorNormalTexture
// //法线贴图缩放，效果更加细微
// material.normalScale.set(0.5, 0.5)
// //透明度设为true
// material.transparent = true
// //alpha贴图控制透明度
// material.alphaMap = doorAlphaTexture

//网格物理材质与网格标准材质一样，但是有更多的参数，
// 如果透明材质，请使用网格物理材质，如果不需要就不要用

//点材质可以用来创建粒子

//环境贴图是反映场景周围的图像，就能提供场景外的环境
//我们将使用环境贴图給物体打光，目前three.js只支持立方体贴图
//使用立方体纹理加载器加载环境贴图

//环境贴图
material.enMap = environmentMapTexture



//创建材质后再调整材质
//添加调试面板，金属度调试
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
//粗糙度调试
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
//环境遮挡贴图调试
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
//位移缩放贴图调试
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)

//我们也能使用AO贴图,AO贴图是环境遮挡贴图简称
const sphere = new THREE.Mesh(
    // Geometry 几何体，0.5为半径，64为横向分段数，64为纵向分段数
    new THREE.SphereGeometry(0.5, 64, 64),
    // Material材质
    material
)
// 设置球体的位置
sphere.position.x = -1.5

//通过设置属性来给几何体添加新属性,设置uv2，来应用环境遮挡在纹理上
//创建三个新的缓冲区属性
sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,
        //告诉缓冲属性,每个顶点有2个属性
        2
    ))
//创建平面
const plane = new THREE.Mesh(
    //1为宽度，1为高度,100为横向分段数，100为纵向分段数
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)

plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array,
        //告诉缓冲属性,每个顶点有2个属性
        2
    ))
//创建圆环
const torus = new THREE.Mesh(
    // Geometry 几何体，0.3为半径，64为横向分段数，128为纵向分段数
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)

torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array,
        //告诉缓冲属性,每个顶点有2个属性
        2
    ))
torus.position.x = 1.5

// 添加到场景
scene.add(sphere, plane, torus)

//因为光线对深度材质不起作用，在网格深度材质上也不起作用
//添加环境光,第一个参数是颜色，第二个参数是强度
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

//创建点光源
const pointLight = new THREE.PointLight(0xffffff, 0.5)
//设置点光源的位置
pointLight.position.x = 2
pointLight.position.z = 4
pointLight.position.y = 3
scene.add(pointLight)


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

// 动画
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // 更新objects
    sphere.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()