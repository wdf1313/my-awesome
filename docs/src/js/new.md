# new 关键字

使用 `new` 关键字调用一个构造函数时内部会做以下事情：

1. 创建一个新的对象：JS 会自动创建一个空对象 `{}`，这个对象会作为实例；
2. 继承原型：新对象 `__proto__`（或`[[Prototype]]`）会被设置为构造函数的 `prototype` 属性；
3. 绑定 this：构造函数内部的 `this` 会指向这个新创建的对象；
4. 执行构造函数代码：JS 会用新对象作为 `this`，执行构造函数里的代码。可以在里面给 `this` 添加属性或方法；
5. 返回新对象：

   - 如果构造函数没有返回对象类型的值（如对象、数组、函数），则返回上面创建的新对象。
   - 如果构造函数显式返回了一个对象类型的值，则返回这个对象，而不是新创建的对象。
   - 如果返回的是基本类型（如数字、字符串），则忽略，还是返回新对象。

### 手写 `new` 方法

```js
function myNew(Constructor, ...args) {
  // 1. 创建一个新对象，并将原型指向构造函数
  const obj = Object.create(Constructor.prototype)
  // 2. 执行构造函数，将 this 绑定到新对象
  const result = Constructor.apply(obj, args)
  // 3. 判断构造函数返回值
  return (typeof result === "object" && result !== null) ||
    typeof result === "function"
    ? result
    : obj
}
```
