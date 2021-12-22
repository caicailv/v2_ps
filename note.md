### 自己搭建 vue 开发环境

首先,如果不通过 vue-cli 去搭建 vue 环境,而是通过 webpack 自己去搭建,则需要

1. 有 dev 环境(webpack 的 dev)
2. 安装 vue 并且安装对应的 vue-loader(解析.vue 文件), vue-loader 还依赖一个 vue-template-compiler(把模板转换成 ast)

### vue 对象的声明

首先需要先找到源头,vue 对象从何处来?  
首先我们通过 package.json 文件可以知道,当引入 vue 包时,引入的是`dist/vue.runtime.esm.js`, build 命令指向了`scripts/build.js`,该文件中的资源来源于` require('./config').getAllBuilds()`,顺藤摸瓜,找到了`dist/vue.runtime.esm.js`对应的入口文件为`src/platforms/web/entry-runtime.js`.
追根溯源,能找到`src/platforms/web/runtime/index.js`,在此文件中,为引入的 vue 对象做了不同平台下,添加不同的 utils 的操作,包括一些启动 vue 的提示.
继续追查 vue 对象至 `src/core/index.js`,再到`src/core/instance/index`,此处声明了 vue 的函数,在此处也混入了很多 vue 的方法,下文一一说明

### 解析 vue 的 options

initState 中,将传入的 options 的`data, props , methods, computed, watch`分别解析,挂载

### get 到的一些小知识点

1.可以直接引入文件,并导出引入的文件暴露的东西

```js
export * from "xxx";
```

2.
