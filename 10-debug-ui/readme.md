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

![](F:\学习\three.js\课程\10-debug-ui\readme.picture\ScreenShot_2025-10-21_084602_088.png)

npm install --save dat.gui

Dat.GUI 已经有一段时间没有更新了，而且现在存在一些漏洞。 您不应安装“dat.gui”，而应安装“lil-gui”，因为它可以作为直接替换方案正常使用。 课程中的所有代码仍能正常运行，但界面将会有一些变化。

```
npm install lil-gui --save-dev
```



