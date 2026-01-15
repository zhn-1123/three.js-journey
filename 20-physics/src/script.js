import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
//npm install --save cannon下载cannon.js,用来模拟物理效果
import * as CANNON from 'cannon-es'

//施加力的四种方法有，
// applyForce,施加力，在物理世界上她只是一个点
// applyImpulse,施加冲量，他增加的是速度，绕过力直接作用于速度
// applyLocalForce,局部力，需要局部位置
// applyLocalImpulse，局部冲量

//广义阶段
//我们有不同广义碰撞检测方案，网格化广义检测，将场景划分为网格，一个物体会和同意网格的其他物体一起测试，但是速度过快时会无效
//我们还有平移和修剪法

//约束
//距离约束：两个物体之间的距离，例如球体和球体之间的距离，或者球体和地面之间的距离
//铰链约束，只能像铰链门一样旋转
//固定约束，物体合并
//固定点约束，物体合并，但是只对一个点、

//物理世界主要依赖cpu,webgl依赖gpu,
// 可以用workerw线程解决，但是workers线程无法访问dom对象，只能访问cpu，
// 所以worker线程只能用来处理cpu任务

//canon.js卸载，npm uninstall --save cannon,安装新的canon.js，npm install --save cannon-es

//emo.js是一个知名库的移植版本叫Bullet.js,支持WebAssembly,对新手更好
//physi.js可以简化3.js项目中的物理实现使用Amo.js和标识符，还能原生支持workers
//理念是无需先创建网格再添加物体，只需创建Physi.js的箱体网格


/**
 * Debug
 */
const gui = new GUI()
// 创建一个GUI对象
const debugObject = {}
debugObject.createSphere = () => {
    //创建一个球体
    createSphere(
        Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3
    })
}
debugObject.createBox = () => {
    //创建一个球体
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        })
}
debugObject.reset = () => {
    //重置场景
    for (const object of objectsToUpdate) {
        //删除物理世界监听事件
        object.body.removeEventListener('collide', playHitSound)
        //删除物理世界对象
        world.removeBody(object.body)
        //删除物体网格
        scene.remove(object.mesh)
    }
    //从对象数组中删除对象
    objectsToUpdate.splice(0, objectsToUpdate.length)
}
// 创建一个按钮
gui.add(debugObject, 'createSphere')
// 创建一个按钮
gui.add(debugObject, 'createBox')
// 创建一个按钮
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//sound
//创建一个音频对象
const hitSound = new Audio('/sounds/hit.mp3')

//创建一个函数
const playHitSound = (collision) => {
    //获取碰撞冲击力信息
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    //判断碰撞强度，如果强度大于1.5
    if (impactStrength > 1.5) {
        //音量为随机
        hitSound.volume = Math.random()
        //停止音频
        hitSound.currentTime = 0
        // 播放音频
        hitSound.play()
    }

}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

// Physics
//创建物理世界
const world = new CANNON.World()
//初始化一个广义阶段，这是标准SAP进行的平移和修剪
world.broadphase = new CANNON.SAPBroadphase(world)
//睡眠检测，让不动的物体进入睡眠状态，提高性能
world.allowSleep = true
//设置物理世界重力,-9.82为重力
world.gravity.set(0, -9.82, 0)

//物理材质
//默认材质
const defaultMaterial = new CANNON.Material('default')

//模拟物理效果,塑料和混凝土接触效果
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    // 材质参数
    {
        // 摩擦，默认0.3
        friction: 0.1,
        // 弹力，默认0.3
        restitution: 0.7
    }
)
//添加材质
world.addContactMaterial(defaultContactMaterial)
//除了给每个物体添加材质外，还可以将接触材质设为默认接触材质
world.defaultContactMaterial = defaultContactMaterial


// //spherePhysicBody,0.50为半径
// const sphereShape = new CANNON.Sphere(0.5)
// const sphereBody = new CANNON.Body({
//     // 质量
//     mass: 1,
//     // 添加物理世界对象位置
//     position: new CANNON.Vec3(0, 3, 0),
//     // 添加物理世界对象形状
//     shape: sphereShape,
//     // // 添加物理世界对象材质
//     // material: defaultMaterial
// })
// //设置局部力
// sphereBody.applyLocalForce(
//     // 要施加的力向量，此处为(150, 0, 0)表示在x轴正方向施加150单位的力
//     new CANNON.Vec3(250, 0, 0),
//     // 力的作用点位置，此处为(0, 0, 0)表示在物体的中心点施加力
//     new CANNON.Vec3(0, 0, 0))
// world.addBody(sphereBody)
//floorPhysicBody
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
// //设置物理世界对象材质
// floorBody.material = defaultMaterial
//设置质量为0
floorBody.mass = 0
//设置物理世界对象形状
floorBody.addShape(floorShape)
//旋转，只支持四元数
floorBody.quaternion.setFromAxisAngle(
    // 旋转轴
    new CANNON.Vec3(-1, 0, 0),
    // 旋转角度
    Math.PI * 0.5)
//设置物理世界对象位置
world.addBody(floorBody)


// /**
//  * Test sphere
//  */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//工具函数
// 创建需要更新数据数组
const objectsToUpdate = []
// 球体
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
// 材质
const sphereMaterial = new THREE.MeshStandardMaterial({
    // 金属
    metalness: 0.3,
    // 粗糙度
    roughness: 0.4,
    // 环境贴图
    envMap: environmentMapTexture,
    // 环境贴图强度
    envMapIntensity: 0.5
})
const createSphere = (radius, position) => {

    //three.js mesh
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    //网格缩放,将网格的球体按照半径进行缩放，使其与物理世界对象保持一致
    mesh.scale.set(radius, radius, radius)
    //网络投射阴影
    mesh.castShadow = true,
        //指定的位置向量复制到网格对象的坐标位置
        mesh.position.copy(position),
        scene.add(mesh)

    //物理世界对象
    const shape = new CANNON.Sphere(radius)
    //物理世界对象参数
    const body = new CANNON.Body({
        //质量
        mass: 1,
        //物理世界对象位置
        position: new CANNON.Vec3(0, 3, 0),
        //物理世界对象形状
        shape: shape,
        //物理世界对象材质
        material: defaultMaterial
    })
    //物理世界对象位置 
    body.position.copy(position)
    //添加碰撞监听
    body.addEventListener('collide', playHitSound)
    //添加物理世界对象
    world.addBody(body)

    //保存到待更新对象里
    objectsToUpdate.push({
        mesh,
        body
    })
}

createSphere(0.5, { x: 0, y: 3, z: 0 })

//盒子
//盒子几何体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// 材质
const boxMaterial = new THREE.MeshStandardMaterial({
    // 金属
    metalness: 0.3,
    // 粗糙度
    roughness: 0.4,
    // 环境贴图
    envMap: environmentMapTexture,
    // 环境贴图强度
    envMapIntensity: 0.5
})
const createBox = (width, height, depth, position) => {

    //three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    //网格缩放,将网格的球体按照半径进行缩放，使其与物理世界对象保持一致
    mesh.scale.set(width, height, depth)
    //网络投射阴影
    mesh.castShadow = true,
        //指定的位置向量复制到网格对象的坐标位置
        mesh.position.copy(position),
        scene.add(mesh)

    //物理世界对象
    const shape = new CANNON.Box(
        //因为立方体的长宽高是从立方体中心开始计算的
        new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    //物理世界对象参数
    const body = new CANNON.Body({
        //质量
        mass: 1,
        //物理世界对象位置
        position: new CANNON.Vec3(0, 3, 0),
        //物理世界对象形状
        shape: shape,
        //物理世界对象材质
        material: defaultMaterial
    })
    //物理世界对象位置 
    body.position.copy(position)
    //添加碰撞监听
    body.addEventListener('collide', playHitSound)
    //添加物理世界对象
    world.addBody(body)

    //保存到待更新对象里
    objectsToUpdate.push({
        mesh,
        body
    })
}


/**
 * Animate
 */
const clock = new THREE.Clock()
// 上一次时间
let oldElapsedTime = 0
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // 计算时间间隔
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    // Update physics world
    // //施加力，像风一样，x轴负向，向左移动，作用于球
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

    world.step(
        //固定时间戳，运行每秒60帧
        1 / 60,
        //从上一步开始经过的时间
        deltaTime,
        //迭代次数
        3)
    // //更新球体位置
    // sphere.position.copy(sphereBody.position)

    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        //同步物理体和渲染网格的旋转状态。
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()