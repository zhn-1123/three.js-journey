import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//创建一个组
const group = new THREE.Group()
//移动组
group.position.y = 1
//注意要先缩放再旋转，
group.scale.y = 2
group.rotation.y = 1


//添加组到场景中
scene.add(group)
// Object
// 我们可以在网络实例化时直接实例化几何体，也可以在创建对象时直接添加
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
//添加到组中
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
//添加到组中
group.add(cube2)
cube2.position.x = -2

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
//添加到组中
group.add(cube3)
cube3.position.x = 2
//放在结尾就不生效了，因为我是在移动物体前就渲染了（移动画布）
//mesh.position.x = 0.7
//mesh.position.y = -0.6
//mesh.position.z = -2
//用set方法可以批量设置向量
//mesh.position.set(0.7, -0.6, -1)
//scene.add(mesh)
//缩放
//mesh.scale.x = 2
//mesh.scale.y = 0.5
//mesh.scale.z = 0.5
//set方法批量设置
//mesh.scale.set(2, 0.5, 0.5)
//旋转，可以用旋转属性或者四元数属性，Math.PI是派
//注意旋转轴顺序，先做y轴旋转，再做x轴旋转
//这个代码就控制了旋转轴先后顺序
//mesh.rotation.reorder('YXZ')
//mesh.rotation.y = Math.PI / 4
//mesh.rotation.z = Math.PI / 4

// 向量长度（场景中心到物体的距离）
//console.log(mesh.position.length())
// 向量归一化,归一化后，向量的长度为1
//mesh.position.normalize()
//轴辅助工具,括号中可以指定轴长度
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.x = 1
camera.position.y = 1
scene.add(camera)
//摄像机对准物体,如果不这样正常显示，因为摄像机默认对准原点
//camera.lookAt(mesh.position)

//摄像机到物体的距离
//console.log(mesh.position.distanceTo(camera.position))

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
