# Cookie、Web Storage、IndexedDB

Cookie、Web Storage、IndexDB 是浏览器提供的客户端存储方案，适用于不同的数据存储场景。

## Cookie

Cookie 大小限制约为 4KB，会自动随着请求发送到服务器。多用于存储会话标识（如 token）、用户信息等服务端需要读取的数据。

可设置过期时间；默认是临时的。

```js
document.cookie = "username=张三; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/"
```

## Web Storage

1. localStorage：**本地持久存储**，除非手动清除，否则永远存在；
2. sessionStorage：**会话级别存储**，标签页或窗口关闭后清除；

大小约为 5 MB，只在客户端使用，不与服务器发生通信。

API：

```js
// 存储数据 setItem
localStorage.setItem("user_name", "xiuyan")

// 读取数据
localStorage.getItem("user_name")

// 删除某一键名对应的数据 removeItem
localStorage.removeItem("user_name")

// 清空数据记录 clear
localStorage.clear()
```

## IndexDB

IndexDB 是浏览器提供的**本地数据库**，用于在客户端存储大量结构化数据。

可以把它理解为**浏览器中的 NoSQL 数据库**。它支持事务、索引、游标、版本管理等功能。是浏览器中最强大的离线存储方案之一。
