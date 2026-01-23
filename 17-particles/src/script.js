import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/10.png')

// particles
// 点对象
// 创建球体的几何体
const particlesGeometry = new THREE.BufferGeometry(1, 32, 32); // 半径为1，宽度细分为32，高度为32
//在创建粒子系统时，创建的粒子数量为500个。
const count = 5000
//设置位置属性数组
const positions = new Float32Array(count * 3)
//设置颜色属性数组，红绿蓝
const colors = new Float32Array(count * 3)

//填充数组
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) *5
    // 设置颜色
    colors[i] = Math.random()
}
//添加属性
particlesGeometry.setAttribute(
    // 属性名
    'position', 
    // 属性值
    new THREE.BufferAttribute(positions, 3));

//添加颜色缓冲属性
particlesGeometry.setAttribute(
    // 属性名
    'color', 
    // 属性值
    new THREE.BufferAttribute(colors, 3));

// 点材质
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true // 根据距离调整大小
});
// particlesMaterial.color = new THREE.Color('#ff88cc');
particlesMaterial.transparent = true
//粒子系统的材质设置透明度贴图
particlesMaterial.alphaMap = particleTexture
/**
 * 设置粒子材质的 alphaTest 属性。
 * alphaTest 用于定义透明度测试的阈值，当像素的 alpha 值小于该阈值时，
 * 该像素将被丢弃，从而实现透明效果。此设置可以避免渲染过程中出现透明像素的深度冲突问题。
 */
// particlesMaterial.alphaTest = 0.001;

// 禁用深度测试，确保粒子不会因深度缓冲区而被遮挡。
// 这通常用于实现特定的视觉效果，例如透明度处理或避免粒子系统被场景中的其他物体遮挡。
//particlesMaterial.depthTest = false;
// 设置不写入深度缓冲区，从而实现透明效果。
particlesMaterial.depthWrite = false
// 设置混合模式为 THREE.AdditiveBlending，实现透明效果。三重加法混合
particlesMaterial.blending = THREE.AdditiveBlending;
//设置顶点颜色属性
particlesMaterial.vertexColors = true


// 创建粒子系统
 // {THREE.BufferGeometry} particlesGeometry - 粒子系统的几何体，定义了粒子的位置和其他属性。
 // {THREE.PointsMaterial} particlesMaterial - 粒子系统的材质，定义了粒子的外观，例如颜色、大小等。
 //{THREE.Points} 返回一个 THREE.Points 对象，该对象将几何体和材质结合，用于渲染粒子系统。
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    // particles.rotation.y = - elapsedTime * 0.1
    // 更新粒子位置
    for (let i = 0; i < count; i++) {
        // 获取粒子位置属性
        const i3 = i * 3
        const x = particlesGeometry.attributes.position.array[i3]
        // 更新y坐标移动
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    //位置属性需要更新，注意要加s
    particlesGeometry.attributes.position.needsUpdate = true
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()