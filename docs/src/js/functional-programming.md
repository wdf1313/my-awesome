# 函数式编程

函数式编程是一种编程范式，它强调：

- 纯函数：无副作用，输出仅依赖输入
- 不可变数据：数据一旦创建，不可修改
- 高阶函数：函数可以作为参数或返回值
- 函数组合：组合多个简单函数构建复杂逻辑

## 函数式编程的优点

- 可测试性，更好写单元测试
- 可维护性
- 并发
- 简洁

## 纯函数

纯函数是指相同的输入永远得到相同的输出，并且没有副作用的函数。

副作用是指函数在执行时：

1. 修改外部状态，如全局变量，输入参数，数据库
2. 依赖外部变量，如读取全局变量，系统时间
3. 执行 I/O 操作，如网络请求，文件读写

### 避免副作用的策略

#### 1. 用返回值代替直接修复

```js
// ❌ 直接修改原数组
const addItem = (array, item) => {
  array.push(item)
  return array
}

// ✅ 返回新数组
const pureAddItem = (array, item) => [...array, item]
```

```js
// ❌ 修改外部状态
const impureIncrement = () => ++counter

// ✅ 纯函数 
cont pureIncrement = (num) => num + 1
counter = pureIncrement(counter) // 通过返回新值更新
```

#### 2.隔离副作用

将副作用限制在程序特定部分（如入口函数，边缘模块）

以用户登录举例

```js
// ❌ 副作用混在逻辑中
const login = (username, password) => {
  const user = {username}
  localStorage.setItem('user', JSON.stringify(user)) // 副作用 (I/O)
  return user
}

// ✅ 分离副作用
const pureLogin = (username) => ({username})

// 在程序入口处处理副作用
const user = pureLogin('Alice')
localStorage.setItem('user', JSON.stringify(user))
```

#### 3.依赖注入

将外部依赖（如数据库，API）作为参数传入，而非直接调用

```js
// ❌ 直接依赖 Date (非纯函数)
const getCurrentTime = () => new Date().toISOString()

// ✅ 将时间作为参数传入
const formatTime = (date) => date.toISOString()
const now = new Date()
formatTime(now) // 纯函数
```

```js
// ❌ 直接调用 fetch 
const fetchUser = (id) => fetch(`/users/${id}`).then(res => res.json())

// ✅ 将 fetch 函数作为参数传入

const pureFetchUser = (fetch, id) => fetch(`/users/${id}`).then(res => res.json());

// 测试时可以注入模拟的 fetch
const mockFetch = (url) => Promise.resolve({ json: () => ({ id: 1, name: 'Alice' }) });
pureFetchUser(mockFetch, 1); // 可测试的纯逻辑

```

#### 4.使用 Monad 封装副作用

通过容器，如 Promise、IO Monad 管理副作用

``` js
// ❌ 直接读取文件
const readFile = (path) => fs.readFileSync(path, 'utf-8')

// ✅ 用 IO Monad 封装 （伪代码）
const IO = (action) => ({
  run: action,
  map: (f) => IO(() => f(action()))
})

const pureReadFile = (path) => IO(() => fs.readFIleSync(path, 'utf-8'))

// 副作用被延迟执行
const program = pureReadFile('data.txt').map(content => content.toUpperCase());
program.run(); // 实际执行副作用

```

#### 5.避免共享状态

用不可变数据替代可变共享状态

```js
// ❌ 直接修改共享状态
const cart = { items: [] };
const addToCart = (item) => {
  cart.items.push(item); // 副作用
  return cart;
};

// ✅ 不可变数据
const pureAddToCart = (cart, item) => ({
  ...cart,
  items: [...cart.items, item],
});

// 使用方式
const newCart = pureAddToCart(cart, { id: 1, name: 'Book' });
```


## 高阶函数

## 函数组合




