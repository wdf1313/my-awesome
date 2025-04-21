# 模块化规范

## ESModule

### Export 导出

#### 命名导出

```js
// 导出单个变量
export const name = 'Alice';
export function greet() { return 'Hello!'; }

const age = 30;
const job = 'Engineer';
export { age, job }; // 导出多个变量

// 导出时重命名
export { age as userAge, job as profession };
```

#### 默认导出

一个模块只能有一个 `default` 导出

```js
const user = { name: 'Alice', age: 30 };
export default user; // 默认导出对象

export default function() { return 'Default!'; } 
```

#### 重新导出

用于在一个文件中集中导出其它模块的默认导出，并可以重命名这些导出，常见于项目入口文件.

```js
export { name } from './module1.js';
// 从 module1.js 中导入其命名导出 name 然后在当前模块中重新导出 name

export { default as age } from './module2.js';
// 从 module2.js 中导入其默认导出 default 然后以命名导出的形式重新暴露出去，并重命名为 age
```

#### 仅加载模块（不导入）

```js
import './init.js'; // 用于执行初始化逻辑
```

### Import 导入

#### 命名导入

```js
// 按名称导入
import { name, greet } from './module.js';
console.log(name); // 'Alice'
greet(); // 'Hello!'

// 导入时重命名
import { name as userName, greet as sayHello } from './module.js';
```

#### 默认导入

```js
import user from './module.js'; // 名称可自定义
console.log(user.name); // 'Alice'
```

#### 混合导入

```js
import user, { name, greet } from './module.js';
```

#### 全部导入

```js
import * as utils from './module.js';
console.log(utils.name); // 'Alice'
utils.greet(); // 'Hello!'
```

#### 动态导入

返回 Promise

```js
import('./module.js').then(module => {
  console.log(module.name); // 'Alice'
});

// 或使用 async/await
const module = await import('./module.js');
```

### 使用 ESModule

#### 浏览器中

```html
<script type="module">
  import { greet } from './module.js';
  greet(); // 'Hello!'
</script>
```
#### NodeJS 中

```js
// 方法1：使用 .mjs 文件扩展名
// 方法2：在 package.json 中配置
{
  "type": "module" // 所有 .js 文件视为 ESM
}
```
