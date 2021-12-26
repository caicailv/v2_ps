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

### vue 响应式源码

为每个在 data 中声明的属性都进行 object.definedproxy 进行代理

### vue 的 render 函数

实例化 vue 时,会调用 render 函数,render 函数的形成,有两种方式,一种是`template`自动生成的 render 函数,另一种是自己手写 render 函数(或者用 jsx 等插件,生成 render 函数)
`_render`函数是 vue 实例的一个私有方法,用来把实例渲染成虚拟 Node.

### VNode

vnode 是虚拟 dom 的构成单元,用来模拟一个真实 dom 元素

### createElement

render 函数最终会调用 createElement 来创建 Vnode

### 如何把虚拟的 vnode 映射到真实 dom (update)

Vue.\_update 是一个 vue 私有函数,vue 初始化,和每次 render 时,都会调用 update,
\_update 内部会调用 `Vue.__patch__`方法来做更新 dom 操作, 这个 patch,在不同的平台下,可以是不同的更新 api(weex),在 web 平台时,使用浏览器操作 dom 的 api 来更新 dom,`/src/platforms/web/runtime/patch`中,通过`createPatchFunction`方法来返回一个新的`patch函数`,

### get 到的一些小知识点

1.可以直接引入文件,并导出引入的文件暴露的东西

```js
export * from "xxx";
```

2.

```js
try {
  return data.call(vm, vm);
} catch (e) {
  handleError(e, vm, `data()`);
  return {};
} finally {
  popTarget();
}
```

3. string.charCodeAt 返回 Unicode 编码

```js
/**
 * 检查字符串是否以$ 或 _ 开头
 */
const c = (str + "").charCodeAt(0);
return c === 0x24 || c === 0x5f;
```

3. 定义 Vue 的 patch 方法时,使用了一个函数柯里化的技巧,使磨平平台差异的函数,直接返回,不需要每次调用时再去判断 if/else,即可直接使用

```js
function createPatchFunction({ nodeOps, modules }) {
  // 在这里用传入的参数,去判断是何平台
  return function patch() {};
}

// 创建patch完成,再次调用时,函数内部已经判断完成了平台,无需再次判断
export const patch: Function = createPatchFunction({ nodeOps, modules });
```
