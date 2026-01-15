import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
//光线投射器
//可以用来判断玩家前面是否有墙以及这面墙的距离，如果太近会阻止玩家前进
//可以测试，是否可以像射击游戏，测试激光枪是否击中敌人
//测试光标下是否有物体
//如果飞船对星星前进，可以发出警报，可以朝飞船前发射光线，如果有障碍物，发出警报提醒有障碍物
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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

//光线投射器
const raycaster = new THREE.Raycaster()
// //光线投射器的起点
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// //光线投射器的方向
// const rayDirection = new THREE.Vector3(10, 0, 0)
// //将光线方向向量标准化（归一化）
// //该方法将当前向量的长度设置为1，保持其原始方向不变
// //标准化后的向量称为单位向量，常用于表示方向而忽略大小
// rayDirection.normalize()
// raycaster.set(rayOrigin, rayDirection)
// //投射射线，测试单个对象
// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)
// //测试多个对象
// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)

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

// 鼠标
const mouse = new THREE.Vector2()
// 监听鼠标移动
window.addEventListener('mousemove', (event) => {
    // 将鼠标位置映射到-1到1之间
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = -(event.clientY / sizes.height * 2 - 1)
})
//点击
window.addEventListener('click', () => {
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1:
                console.log('click on object1')
                break
            case object2:
                console.log('click on object2')
                break
            case object3:
                console.log('click on object3')
                break
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
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let model = null
//实例化gltf加载器,model
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    '/models/Duck/glTF-Binary/Duck.glb',
    (gltf) => {
        model = gltf.scene
        //模型在scene中
        gltf.scene.position.y = -1.2
        scene.add(model)
    }
)

//lights
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new THREE.Clock()

//标识变量
let currentIntersect = null

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // //cast a ray
    //用摄像机来设置光线的投射
    raycaster.setFromCamera(mouse, camera)
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(1, 0, 0)
    // raycaster.set(rayOrigin, rayDirection.normalize())
    // //测试多个对象
    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)
    //让所有物体恢复成红色
    for (const object of objectsToTest) {
        object.material.color.set('#ff0000')
    }
    //让相交的物体变成蓝色
    for (const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }
    //检测鼠标进入和离开
    if (intersects.length) {
        //如果当前有相交对象
        if (!currentIntersect) {
            console.log('mouse enter')
        }
        currentIntersect = intersects[0]
    } else {
        //如果当前没有相交对象
        if (currentIntersect) {
            console.log('mouse leave')
        }
        currentIntersect = null
    }

    //检测鼠标进入和离开模型
    //raycaster.intersectObject(model)可以在这个model，加false这样就不会递归一层一层检测模型
    if (model) {
        const modelIntersects = raycaster.intersectObject(model)
        if (modelIntersects.length) {
            model.scale.set(1.2, 1.2, 1.2)
        } else {
            model.scale.set(1, 1, 1)
        }
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()