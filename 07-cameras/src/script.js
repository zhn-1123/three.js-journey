import * as THREE from 'three'
//引入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//创建一个的常量作为对象存储
const cursor = {
    x: 0,
    y: 0
}
//光标
//监听鼠标移动
window.addEventListener('mousemove', function (event) {
    //获取鼠标位置
    //console.log(e.clientX, e.clientY)
    //让他变成一个-0.5到0.5的数值
    cursor.x = event.clientX / sizes.width - 0.5
    //事件客户端中y向下为正，但在three.js中y向上为正,需要做反向调整
    //我将事件客户端的y值取反
    cursor.y = -(event.clientY / sizes.height - 0.5)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
//正交相机与透视相机的区别：正交相机，无论距离远近，物体尺寸保持不变
const camera = new THREE.PerspectiveCamera(
    //垂直视角角度
    75,
    //宽高比
    sizes.width / sizes.height,
    //近距参数，任何比近距或比远距更远的都不会显示，
    //在之间的话只能看到物体的一部分
    //不能设置太极限的值,会引起z冲突
    1,
    //远距参数
    1000
)

//为了保持宽高比，以适用于我们的画布和渲染，要不然画布尺寸会把立方体拉长
// 宽高比
// const aspectRatio = sizes.width / sizes.height
// //正交相机
// const camera = new THREE.OrthographicCamera(
//     //如果左右上下设置过大的话，会出现物体缩小
//     //左
//     -1 * aspectRatio,
//     //右
//     1 * aspectRatio,
//     //上
//     1,
//     //下
//     -1,
//     //近距
//     1,
//     //远距
//     1000
// )

//camera.position.x = 2
//camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

//添加控制器,括号里需要添加加载的相机和提供的DOM元素,用来监听鼠标事件的参考点
const controls = new OrbitControls(camera, canvas)
//启用阻尼,就是有加速度那种感觉，但需注意，这个阻尼效果会减慢动画的帧数，所以不能用这个来创建动画
//注意，控制器需要每帧更新，在tick函数中
controls.enableDamping = true

// //默认状态下控制器看向场景中心，用controls.target可以改变
// controls.target.y = 1
// //更新控制器
// controls.update()

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // // Update objects
    // mesh.rotation.y = elapsedTime;

    // // Update camera，更新相机
    // camera.position.x = cursor.x * 3
    // //camera.position.z = 
    // camera.position.y = cursor.y * 3

    // //让立方体随着鼠标水平旋转一周
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera.position.y = cursor.y * 5
    // //以立方体为中心,new THREE.Vector3()，创建一个三维向量对象，不填默认0，0，0
    // //camera.lookAt(new THREE.Vector3())

    // // //以立方体为中心
    // camera.lookAt(mesh.position)

    // 更新控制器
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
//控制器controls知识点
//飞行控制器（FlyControls）
//FlyControls 启用了一种类似于数字内容创建工具（例如Blender）中飞行模式的导航方式。 
//你可以在3D空间中任意变换摄像机，并且无任何限制（例如，专注于一个特定的目标）。

//第一人称控制器（FirstPersonControls）
//该类是 FlyControls 的另一个实现。
//FirstPersonControls 允许用户通过键盘或鼠标控制相机。

//指针锁定控制器（PointerLockControls）
//该类的实现是基于Pointer Lock API的。 
// 对于第一人称3D游戏来说， PointerLockControls 是一个非常完美的选择。

//轨道控制器（OrbitControls）
//Orbit controls（轨道控制器）可以使得相机围绕目标进行轨道运动。
//要使用这一功能，
//就像在/examples（示例）目录中的所有文件一样， 
//您必须在HTML中包含这个文件。

//轨迹球控制器（TrackballControls）
//TrackballControls 与 OrbitControls 相类似。
//然而，它不能恒定保持摄像机的up向量。 
//这意味着，如果摄像机绕过“北极”和“南极”，则不会翻转以保持“右侧朝上”。

//变换控制器（TransformControls）
//该类可提供一种类似于在数字内容创建工具（例如Blender）中对模型进行交互的方式，来在3D空间中变换物体。
// 和其他控制器不同的是，变换控制器不倾向于对场景摄像机的变换进行改变。
//TransformControls 期望其所附加的3D对象是场景图的一部分。

//拖放控制器（DragControls）
//该类被用于提供一个拖放交互。



