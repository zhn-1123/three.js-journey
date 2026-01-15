import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
//导入字体加载器
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
//导入文本几何体
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { Wireframe } from 'three/examples/jsm/Addons.js'
/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//轴辅助工具
const axesHelper = new THREE.AxesHelper()
//添加
scene.add(axesHelper)
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/4.png')

//字体加载器fontloder
//自 Three.js 的第 133 版本起，FontLoader 类就必须…… 应这样进口：
//从“three/examples/jsm/loaders/FontLoader.js”中导入{FontLoader}
//并且以这种方式进行实例化： const fontLoader = new fontLoader （）
//实例化

const fontLoader = new FontLoader();
//加载字体
fontLoader.load(
    '/font/helvetiker_regular.typeface.json',
    //触发函数
    (font) => {
        //创建文字几何体
        //自 Three.js 版本 133 起，要使用 TextGeometry 类，
        //必须像这样进行导入： 
        //从“three/examples/jsm/geometries/TextGeometry.js”中导入{TextGeometry}
        const textGeometry = new TextGeometry(
            //文本，特殊字符可能需要转义
            'Hello Three.js',
            //参数
            {//字体
                font: font,
                //尺寸
                size: 0.5,
                //深度
                depth: 0.2,
                //曲线分段数
                curveSegments: 5,
                //是否开启曲面细分，全部启用斜面效果
                bevelEnabled: true,
                //斜角厚度
                bevelThickness: 0.03,
                //斜角尺寸
                bevelSize: 0.02,
                //斜角偏移
                bevelOffset: 0,
                //斜角分段数
                bevelSegments: 4
            }
        )
        // //计算包围盒
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     //x轴平移，min: 包围盒的最小坐标点
        //     //max: 包围盒的最大坐标点,
        //     // -0.02是因为斜角宽度为0.02，所以要减去0.02
        //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //     //y轴平移
        //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     //z轴平移
        //     //-0.03是因为斜角宽度为0.03，所以要减去0.03
        //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
        // )
        //更简单方法，使用文字几何中心
        textGeometry.center()


        //创建新的文本材质
        const material = new THREE.MeshMatcapMaterial(
            //更换matcap材质
            { matcap: matcapTexture }
        )
        //创建网格
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        //创建一个甜甜圈0.3, 0.2, 20, 45分别为宽，高，分段数，旋转角度
        //优化，将甜甜圈放在循环外
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        //计算时间
        console.time("donuts")
        for (let i = 0; i < 100; i++) {

            //将甜甜圈放到甜甜圈组
            const donut = new THREE.Mesh(donutGeometry, material)
            //随机位置
            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10
            //随机旋转
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            //随机缩放
            const scale = Math.random()
            //x,y,z随机缩放
            donut.scale.set(scale, scale, scale)
            scene.add(donut)
        }
        console.timeEnd("donuts")
    }
)



// /**
//  * Object
//  */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()