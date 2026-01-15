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
用来构建最终网站以及最后你可以上线的资源
可以在dist目录找到这些资源，这些就是要上线的资源
```

我们不会用那个方案，如果需要可以用Vercel，更现代的解决方案

但是还有一些其他的替代方案：Netlify和GitHub Pages

GitHub,GitLab，Bitbucket,用于托管Git代码库的解决方案

安装vercel依赖，安装在电脑上，注意权限问题，我没安装，npm i vercel在项目里安装的

```
npm i -g vercel
设置"deploy": "vercel --prod"
npm run deploy时，会自动部署到网络
--prod，命令会直接部署到Vercel的生产环境
```