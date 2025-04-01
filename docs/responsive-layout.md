# 响应式布局

响应式布局 (Responsive Design)是指网页能够自适应不同设备屏幕尺寸的布局方式，无论用户使用手机、平板还是桌面电脑访问网站，内容都能以最合适的方式呈现。

## 视口 viewport

```html
<meta name="viewport" conent="width=device-width, initial-scale=1.0">
```
该 meta 标签告诉浏览器使用设备的宽度作为视口宽度，并且初始缩放比例为 1.0。

### 媒体查询 Media Queries

仅在浏览器和设备的环境与你指定的规则相匹配的时候 CSS 才会真的被应用

```css
/* 默认样式 - 移动优先 */
.container {
  width: 100%;
}

/* 平板设备 */
@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}

/* 桌面设备 */
@media (min-width: 992px) {
  .container {
    width: 970px;
  }
}

/* 大屏幕设备 */
@media (min-width: 1200px) {
  .container {
    width: 1170px;
  }
}
```

## 布局 

### Flexbox

### Grid

## 相对单位

#### em - 相对于当前元素的字体大小

```css
p {
  font-size: 16px;
  padding: 2em; /* 32px (16×2) */
}

div {
  font-size: 10px;
  padding: 2em; /* 20px (10×2) */
}
```

`em` 单位在嵌套使用时会产生**累积计算**的效果，`em` 单位总是相对于当前元素的 `font-size` 值来计算的。

```html
<div class="parent">
  父元素
  <div class="child">
    子元素
    <div class="grandchild">
      孙元素
    </div>
  </div>
</div>
```

```css
.parent {
  font-size: 16px;
  padding: 2em; /* 16px × 2 = 32px */
}

.child {
  font-size: 1.5em; /* 16px × 1.5 = 24px */
  padding: 2em; /* 24px × 2 = 48px */
}

.grandchild {
  font-size: 0.8em; /* 24px × 0.8 = 19.2px */
  padding: 2em; /* 19.2px × 2 = 38.4px */
}
```


#### rem(root em) - 相对于跟元素 html 的字体大小

```css
html {
  font-size: 16px;
}

p {
  font-size: 1rem; /* 16px */
  padding: 2rem; /* 32px */
}
```

#### vm(viewport-width)、vh(viewport-height) 相对于视口宽度、高度

```css
div {
  width: 50vw; /* 视口宽度的一半 */
}

.header {
  height: 10vh; /* 视口高度的10% */
}
```

## 图片和媒体的响应式处理

### 