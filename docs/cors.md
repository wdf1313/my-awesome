# CORS 跨源资源共享

CORS (Cross-Origin Resource Sharing) 跨源资源共享是一种机制，它使用额外的 HTTP 头来告诉浏览器，允许运行在一个源 (domain) 上的 Web 应用访问来自不同源服务器上的指定资源。

- 同源策略是浏览器的安全机制，阻止不同源之间的交互
- CORS 是 W3C 标准，提供一种安全方式绕过同源策略的限制
- 需要服务器和客户端共同配合实现


## CORS 工作原理

CORS 通过新增一组 HTTP 头部字段来实现：

### 简单请求

满足一下所有条件：

- 方法为 GET、HEAD 或 POST
- 只包含安全的头部字段：Accept、Accept-Language、Content-Language、Content-Type
- Content-Type 为 `application/x-www-form-urlencoded`、`multipart/form-data` 或 `text/plain`


请求发送时浏览器自动添加 `Origin` 头部，服务器响应中包含 `Access-Control-Allow-Origin` 头部，浏览器检查响应头部，决定是否允许访问。

```js
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'text/plain',
  },
});
```

服务器响应必须包含

```http
Access-Control-Allow-Origin: https://your-site.com  // 或 *（但不能带 Cookie）
```

### 预检请求

不满足简单请求条件的请求，例如`PUT`、`DELETE`、`COntent-Type:application/json` 浏览器会先发送 OPTIONS 方法的预检请求，询问服务器是否允许该跨域请求。

```js
fetch('https://api.example.com/data', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': '123',
  },
});
```

浏览器先发送 `OPTIONS` 请求 

```http
OPTIONS /data HTTP/1.1
Origin: https://your-site.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Content-Type, X-Custom-Header
```

服务器响应
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://your-site.com
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: Content-Type, X-Custom-Header
Access-Control-Max-Age: 86400  // 缓存预检结果（单位：秒）
```

只有预检通过后，浏览器才会发送真正的 DELETE 请求。

### 附带身份凭证的请求

默认情况，在发送跨域请求时，浏览器不会发送身份凭证（如 cookie、HTTP认证）

设置跨域请求携带身份凭证。

```js
// XMLHttpRequest
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://example.com/api', true);
xhr.withCredentials = true;
xhr.send(null);

// Fetch API
fetch('https://example.com/api', {
  credentials: 'include'
});
```

服务器设置
```
Access-Control-Allow-Origin: https://your-domain.com  // 不能是 *
Access-Control-Allow-Credentials: true
```

浏览器会拒绝任何不携带 `Access-Control-Allow-Credentials: true` 标头的响应，且不会把响应提供给调用的页面。


## 参考

[【MDN】跨源资源共享（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/CORS)