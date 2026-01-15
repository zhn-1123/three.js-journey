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

在这段视频以及后续的视频中，您可能会看到我使用“PlaneBufferGeometry”这样的写法来代替“PlaneGeometry”。 自 3.js 的第 125 版本起，那些“缓冲”几何体已被“非缓冲”几何体所取代，您在编写时应去掉“Buffer”这一部分。 抱歉

![](F:\学习\three.js\课程\12-materials\readme.picture\ScreenShot_2025-10-30_163700_692.png)

“MeshNormalMaterial”与“MeshBasicMaterial”具有许多相同的属性，例如“线框”、wireframe

“透明”、opacity

“不透明度”和“侧面”side

，此外还具有“平滑着色”flatShading

这一属性。