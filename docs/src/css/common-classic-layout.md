# 常见的一些网站布局

## 圣杯布局
概念：中间列宽度自适应，两侧边栏固定宽度，且中间列在HTML结构中优先渲染
实现方式 
``ts
<style>
    body{
        margin:0;
        padding:0;
        min-height:100vh;
        display:flex;
        flex-direction:column;
    }
    .header .footer{
        background:#ccc;
        padding:20px;
        text-align:center;

    }
   .container {
            display: flex;
            flex: 1;
        } 
        .main {
            flex: 1;
            background: #f9f9f9;
            padding: 20px;
            order: 2;//用来调整flex布局的顺序
        }
        
        .left {
            width: 200px;
            background: #ffcccc;
            padding: 20px;
            order: 1;
        }
        
        .right {
            width: 200px;
            background: #ccccff;
            padding: 20px;
            order: 3;
        }
        
</style>
<body>
<header>头部</header>
<div class="container">
<main class="main">主内容</main>
<aside class="left">左侧边栏</aside>
<aside class="right">右侧边栏</aside>
</div>
<footer></footer>
</body>
 
## 双飞翼布局
效果和圣杯布局相似，双飞翼布局在某些场景（）下更稳定。

``
<style>
    body{
        margin:0;
        padding:0;
        min-height:100vh;
        display:flex;
        flex-direction:column;
    }
    .header .footer{
        background:#ccc;
        padding:20px;
        text-align:center;

    }
   .container {
            display: flex;
            flex: 1;
        } 
        .main {
            flex: 1;
            background: #f9f9f9;
            padding: 20px;
            order: 2;//用来调整flex布局的顺序
            margin: 0 200px
        }
        .main-wrapper {
            flex: 1;
            order: 2;
        }
        .left {
            width: 200px;
            background: #ffcccc;
            padding: 20px;
            order: 1;
        }
        
        .right {
            width: 200px;
            background: #ccccff;
            padding: 20px;
            order: 3;
        }
        
</style>
<body>
<header>头部</header>
<div class="container">
<div class="main-wrapper"><main class="main">主内容</main></div>
<aside class="left">左侧边栏</aside>
<aside class="right">右侧边栏</aside>
</div>
<footer></footer>
</body>

