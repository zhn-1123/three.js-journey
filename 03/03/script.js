//场景
const scene = new THREE.Scene();
//红色立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
//网格材质，参数设定颜色为红色
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//创建网格模型
const mesh = new THREE.Mesh(geometry, material);
//添加到场景中
scene.add(mesh);
//sizes
const sizes = {
  width: 800,
  height: 600
};
//创建相机（透视投影相机）
const camera = new THREE.PerspectiveCamera(
  // 视角范围（一般为45度-55度）
  75,
  //长宽比
  sizes.width / sizes.height,
);
//移动相机，默认坐标轴x轴右边为正，y轴上边为正，z轴朝向我为正
camera.position.z = 3
//camera.position.x = 2
//camera.position.y = 2


//添加到场景中
scene.add(camera);
//渲染器 Renderer
//创建画布,获取canvas元素
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
  //指定canvas元素，属性名与变量名一致可以省略
  canvas
});
//设置渲染器的尺寸
renderer.setSize(sizes.width, sizes.height);
//渲染场景和相机
renderer.render(scene, camera);


