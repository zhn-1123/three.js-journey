import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//引入GLTFLoader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
//引入Draco加载器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import GUI from 'lil-gui'
import { mix } from 'three/tsl'

//3D格式有OBJ格式，FBX,STL,PLY,COLLADA,3DS,GLTF
//GLTF逐渐成为标准
//glTF,默认格式，里面有gltf为json文件，bin文件，为二进制文件，包含一些几何数据，png为图片，是其纹理，加载gltf文件其他会自动加载
//glTF-binary,二进制文件，更轻便，加载更容易，修改困难
//glTF-draco,类似gltf，但是缓冲数据是被压缩的，比gltf更小，加载更快，修改更方便，但是不能用gltf的动画，只能用draco的动画
//glTF-embedded,可读取的json文件,很大，唯一的优点是一个文件
//gltf用的是pbr 材质，基于物理的材质，更真实，需要环境光，会转换成网格标准格式


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//实例化DRACOLoader
//在文件中找到F:\学习\three.js\课程\21-imported-models\node_modules\three\examples\jsm\libs\draco，
// 复制draco放到static文件夹下，里面有webassembly文件，这段代码会在不同线程中运行，会用workers
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

//模型
const gltfLoader = new GLTFLoader()
//设置draco加载器
gltfLoader.setDRACOLoader(dracoLoader)
//加载，引入三个参数，模型路径，成功回调，失败回调
//models中的Duck要注意大写
// gltfLoader.load(
//     '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     //加载模型时，模型不会显示，得先加载他，并处理加载的内容
//     //因为从gitf导入到场景中属于递减循环，所以在里面用循环会出问题，需要解决
//     (gltf) => {
//         //我们有多种将鸭子模型添加到场景中的方法：
//         //将模型里的整个场景直接添加到我们的场景中
//         //将模型场景的子对象添加到我们的场景中，并忽略透视相机（PerspectiveCamera）
//         //添加到场景前先筛选子对象
//         //只添加网格模型（Mesh），最终得到的鸭子模型会出现缩放、位置和旋转异常的问题
//         //在3D软件中打开文件，清理后重新导出

//         //选取第一个子项，这样对象就会按比例应用
//         console.log(gltf.scene);
//         //用while循环添加
//         // while (gltf.scene.children.length) {
//         //     const child = gltf.scene.children[0];
//         //     scene.add(child);
//         // }
//         // //创建一个临时数组来添加,...为展开运算符，用来提取值
//         // const children = [...gltf.scene.children];
//         // for (const child of children) {
//         //     scene.add(child);
//         // }
//         scene.add(gltf.scene);
//     }
// )

// gltfLoader.load(
//     //Draco压缩，比默认版本更加轻量，通常应用于几何图形得缓冲数据
//     //如果不大就没必要
//     //需要加载Draco加载器
//     '/models/Duck/glTF-Draco/Duck.gltf',

//     (gltf) => {
//         scene.add(gltf.scene);
//     }
// )

//动画
let mixer = null

gltfLoader.load(

    '/models/Fox/glTF/Fox.gltf',

    (gltf) => {
        //创建动画混合器
        mixer = new THREE.AnimationMixer(gltf.scene)
        //剪辑动作和动画
        const action = mixer.clipAction(gltf.animations[2])
        //播放动画
        action.play()
        //缩放
        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene);
    }
)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    //最开始在外面定义为空，会没有东西，所以要等加载完
    if (mixer != null) {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()