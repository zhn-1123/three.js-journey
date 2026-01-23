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

![](F:\学习\three.js\课程\09-geometries\readme.picture\ScreenShot_2025-10-20_202509_837.png)

我们需要创建自己的顶点，同时我们还要生成粒子并在这些粒子中嵌入不同的数据，这节课的几何体都来自于BufferGeometry,在里面有平移旋转粒子等等

不过我们通常只是创建几何体然后移动网络，也就是通过几何体可以创建并移动网格

![](F:\学习\three.js\课程\09-geometries\readme.picture\ScreenShot_2025-10-20_204452_584.png)

根据宽度，高度，深度的分段控制每个面上的三角形的数量，设置地形的时候会用到，像是山脉什么的，需要很多个顶点，会有对应的三角形，可以移动三角形，也就是移动顶点来带动三角形

![](F:\学习\three.js\课程\09-geometries\readme.picture\ScreenShot_2025-10-20_204728_838.png)

因为三角形可以共用多个顶点，所以需要提供索引，如第一个三角形用的哪些顶点这样子