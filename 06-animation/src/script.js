import * as THREE from 'three'
//引入gsap库
import gsap from 'gsap'

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 2
camera.position.y = 2
camera.position.z = 2
camera.lookAt(mesh.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate动画
// 时钟实例化
//const clock = new THREE.Clock()

//用gsap库创建动画，
// to方法创建动画，提供两个参数，动画化的的对象，对象：指定个属性的目标值
gsap.to(mesh.position, {
    // duration: 动画持续的时间
    duration: 1,
    // 延迟时间
    delay: 1,
    //缓动效果
    //ease: 'power1.inOut',
    x: 3
})

// 获取时间
//let time = Date.now()
// tick函数
const tick = () => {
    //时间戳表示从1970年1月1日0时0分0秒开始到当前时间所经过的秒数
    //获取时间差
    //const currenttime = Date.now()
    //const daltaTime = currenttime - time
    //time = currenttime
    //mesh.rotation.y += 0.01*daltaTime
    // 获取时钟对象返回的时间间隔，也就是经过时间
    //const elapsedTime = clock.getElapsedTime()

    // 更新对象
    //mesh.position.x += 0.01，画布向右移动
    //mesh.rotation.y = elapsedTime;

    //沿y轴每秒转一圈
    //mesh.rotation.y = elapsedTime*Math.PI*2;
    //正切函数移动
    //mesh.position.y = Math.sin(elapsedTime);

    //将正弦函数和余弦函数应用在不同的坐标轴，他就会绕圆圈
    //也可以是相机移动
    //mesh.position.x = Math.cos(elapsedTime);
    //mesh.position.y = Math.sin(elapsedTime);

    // 渲染
    renderer.render(scene, camera)

    // Call tick again on the next frame
    //requestAnimationFrame(tick)让浏览器在下一帧调用tick函数
    window.requestAnimationFrame(tick)
}
//调用tick
tick()