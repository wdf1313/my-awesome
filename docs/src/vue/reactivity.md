# vue 响应式原理

当数据发生变化时视图自动更新，无需手动操作 DOM

## `Object.defineProperty`

通过 `Object.defineProperty` **递归地**遍历对象属性，在属性被访问和修改时执行依赖收集和重新派发。

```js
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log(`获取 ${key}: ${val}`);
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log(`设置 ${key} 从 ${val} 到 ${newVal}`);
      val = newVal;
    }
  });
}
```

## 依赖收集与观察者模式

Dep 类：每个响应式属性都有一个 Dep 实例，用于存储所有依赖该属性的 Watcher

Watcher 类：代表一个依赖，当数据变化时会被通知

Observer 类：将一个普通对象转化成响应式对象

## 响应式流程

1. 初始化阶段
   - Vue 遍历 data 对象的所有属性
   - 使用 `Object.defineProperty` 将它们转换为 getter / setter
   - 每个属性创建一个 Dep 实例来管理依赖

2. 依赖收集

   - 当组件渲染时，访问数据属性会触发 getter
   - getter 会将当前的 Watcher（组件渲染函数）添加到 Dep 中

3. 派发更新

   - 当属性修改时，setter 会被触发
   - setter 通知 Dep，Dep 通知所有 Watcher
   - watcher 触发组件重新渲染

## 缺点

### 1. 无法检测 property 的添加或移除。

由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 data 对象上存在才能让 Vue 将它转换为响应式的。

```js
var vm = new Vue({
  data:{
    a:1
  }
})

// `vm.a` 是响应式的

vm.b = 2
// `vm.b` 是非响应式的
```

解决方案

```js
// 使用 Vue.set 或 this.$set
this.$set(this.user, 'age', 25);
```

### 2. 数组变化的检测问题

无法检测一下数组变动：
  - 直接通过索引设置项：`this.items[index] = newValue`
  - 修改数组长度：`this.items.length = newLength`

```js
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // 不是响应性的
vm.items.length = 2 // 不是响应性的
```

解决问题1的方法

```js
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)

// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

解决问题2的方法

```js
vm.items.splice(newLength)
```

Vue2 重写了 `push()`、`pop()`、`shift()`、`unshift()`、`splice()`、`sort()`、`reverse()` 因为它们会改变原始数组，都存在以上限制，所以要重写。

重写后保持了原有功能，在处理新增元素时，元素将转为响应式。并触发依赖该数组的所有 Watcher 更新。


:::tip
`Object.defineProperty` 对数组的监听存在固有局限性，是由于 JavaScript 语言本身的特性和设计权衡。

1. 数组索引不是"属性"的固有特性
在 JavaScript 中，数组的索引访问本质上就是对象属性的访问（arr[0] 等同于 arr['0']），但 Object.defineProperty 对数组索引的处理存在特殊问题：
- 性能代价过高：要为每个可能的数组索引都设置 getter/setter 会消耗大量内存
- 动态增长问题：数组可以动态增长，无法预先定义所有可能索引的 getter/setter
- 稀疏数组问题：JavaScript 允许稀疏数组（如 const arr = []; arr[1000] = 1），为所有可能的索引设置响应式不现实

2. length 属性的特殊性
数组的 length 属性有以下特点使其难以监听：
- 双向绑定行为：设置 arr.length = 0 会删除元素，修改元素也会影响 length
- 非配置性：根据 ECMAScript 规范，数组的 length 属性默认是 non-configurable
-隐式触发：许多数组操作会隐式修改 length，难以精确追踪变化
:::

1. 性能问题

对于大型对象，递归遍历将所有属性转换为响应式的过程会有性能开销。