# Three.js Journey

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

UV展开：像是打开一个折纸，每个顶点都会在正方形上有个二维坐标

![](F:\学习\three.js\课程\11-textures\笔记，picture\ScreenShot_2025-10-23_194247_820.png)

// 每个顶点还有UV坐标,UV坐标是二维的

geometry.attributes.uv是一个32位浮点缓冲属性，包含很多坐标

如果你要创建自己的几何体，就必须指定这些UV坐标

如果你在使用3D软件，你还需要设置这些坐标

博主项目是用Blender展开的



MIP映射亦可以称作MIP空间映射：通过不断创建半尺寸的纹理，直至缩小到1x1的纹理为止

有两种算法用于这些贴纸映射：

1.为缩小滤镜：当纹理的像素比渲染的像素小，这就是缩小滤镜起作用的地方

//调整这个均值滤波器，使纹理更平滑

// 设置纹理缩放,最邻近滤镜

colorTexture.minFilter = THREE.NearestFilter

![](F:\学习\three.js\课程\11-textures\笔记，picture\ScreenShot_2025-10-28_141356_280.png)

2.放大滤镜：当纹理的像素比渲染的像素大，这就是缩小滤镜起作用的地方

//调整这个均值滤镜，使纹理更平滑

//最邻近滤镜

colorTexture.magFilter = THREE.NearestFilter

![](F:\学习\three.js\课程\11-textures\笔记，picture\ScreenShot_2025-10-28_141904_477.png)

远处的物品或类似的东西，使用点滤波器会有更好的效果，帧率更高

当使用均值滤波器替换最邻滤波器时，我们不再让3GS和GPU处理MIP映射，禁用他们

// 纹理的mipmap,来提升性能

colorTexture.generateMipmaps = false

纹理的格式与优化：

1.纹理文件的大小，也就是图像的尺寸，也就是分辨率，以及我们嵌入纹理中的数据

可以使用**.jpg**，有损压缩，意味着图像会有些许变化，可能看到一些失真，但通常文件会变得非常小

**.png**就是无损压缩，能保留精确的数据，但这些值有时不完全正确，能得到接近的数值，但文件会比较大

**我们要尽量保持文件体积小，可以用任何网站或软件压缩图片，博主用的TinyPNG**

还用一种特别的压缩叫**BASIS**，其实是有损压缩，但会得到非常小的文件，对GPU更友好

2.尺寸大小：如果图像尺寸较小，文件就会更轻

，在webGL使用纹理时，这些纹理会被传送到GPU，而GPU是存在限制的，不能传送太大的纹理或同时传送数百个大纹理到GPU中，所以要尽量提供小的纹理，别忘了使用mipmap时，你需要将两倍的像素量存储到GPU中

同时因为我们使用了纹理映射，我们需要用能被二整除的纹理分辨率，因此**分辨率为2的幂次方**

3.数据方面的内容：**如果你想使用支持透明的纹理，我们会使用一个png文件，这个png问津是透明的**，我们会将它应用到材质的颜色属性中，但要注意某些情况，使用彩色版和透明版会更好

**法线通常为png格式**，因为能得到精确的像素值

最后，**有时你可以将不同的数据整合在一个纹理中，分别使用红，绿，蓝和透明通道**

在以下三个网站找纹理，也可以创建自己的纹理，可以拍照也可以Photoshop等二维软件，甚至可以通过Substance Designer创建程序纹理，专门用于通过节点创建纹理

![](F:\学习\three.js\课程\11-textures\笔记，picture\ScreenShot_2025-10-28_144745_138.png)