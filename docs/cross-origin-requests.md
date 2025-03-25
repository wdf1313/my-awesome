# HTML 中如何实现跨域请求

## 跨域请求的定义

跨域请求是指浏览器从一个域名的网页向另一个域名的服务器服务器发起请求。由于浏览器的同源策略(Same-Origin Policy)，默认情况下，跨域请求会被阻止。

## 同源策略

同源策略要求协议、域名和端口号必须完全相同。如果其中任何一个不同，就会触发跨域限制。

## 实现跨域请求的常见方法

### CORS 跨域资源共享

CORS 是 W3C 标准，允许服务器声明**哪些源**可以访问资源。通过设置 HTTP 头（如 Access-Control-Allow-Origin），服务器可以控制跨域请求。

- 简单请求：使用 `GET`、`POST` 或 `HEAD`方法，且内容类型为 `application/x-www-form-urlencoded`、`multipart/form-data` 或 `text/plain`。
- 预请求：复杂请求（如 `PUT`、`DELETE` 或自定义头）会先发送 `OPTIONS` 请求进行预检。

```js
fetch('https://example.com/api', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### JSONP

JSONP 通过 `<script>` 标签绕过同源策略，利用回调函数处理跨域数据。服务器返回的数据包裹在回调函数中。

仅支持 `GET` 请求，安全性低，支持老式浏览器。

```html
<script>
  function handleResponse(data) {
    console.log(data);
  }
</script>

<script src="https://example.com/api?callback=handleResponse"></script>
```

### 代理服务器

通过同域服务器转发请求，避免跨域问题。前端请求同域服务器，服务器再请求目标服务器并返回数据。

在开发环境中，Webpack、Vite等工具提供代理功能

- Webpack 配置
```js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://example.com', // 目标服务器地址
        changeOrigin: true, // 修改请求头中的 Origin 为目标服务器地址
        pathRewrite: { '^/api': '' }, // 重写路径（可选）
      },
    },
  },
};
```

- Vite 配置
```js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

生产环境中，通常使用 Nginx 或 Node.js 等服务器软件实现代理

- Nginx 配置

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api/ {
        proxy_pass https://example.com/; // 目标服务器地址
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
- Node.js 实现，使用 `http-proxy-middleware` 

```js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({
  target: 'https://example.com', // 目标服务器地址
  changeOrigin: true,
  pathRewrite: { '^/api': '' }, // 重写路径（可选）
}));

app.listen(3000, () => {
  console.log('Proxy server is running on http://localhost:3000');
});
```

### WebSocket

WebSocket 协议不受同源策略限制，支持双向通信

### postMessage

`postMessage` 允许不同源的窗口间安全通信