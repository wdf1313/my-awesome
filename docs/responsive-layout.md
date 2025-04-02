# 响应式布局

响应式布局 (Responsive Design)是指网页能够自适应不同设备屏幕尺寸的布局方式，无论用户使用手机、平板还是桌面电脑访问网站，内容都能以最合适的方式呈现。

## 视口 viewport

```html
<meta name="viewport" conent="width=device-width, initial-scale=1.0">
```
该 meta 标签告诉浏览器使用设备的宽度作为视口宽度，并且初始缩放比例为 1.0。

## 媒体查询 Media Queries

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

#### CSS 控制缩放

确保图片始终不超过容器宽度保持比例：

```css
img {
  max-width: 100%;
  height: auto
}
```

#### 高分辨率屏幕适配 srcset

使用 `srcset` 提供多分辨率图片，浏览器根据设备像素比选择：

```html
<img src="image-1x.jpg" srcset="image-2x.jpg 2x, image-3x.jpg 3x" alt="示例图片">
```
提供不同分辨率的图片，让浏览器根据设备像素比（DPR）自动选择。

- image-2x.jpg 2x：当设备 DPR ≥ 2（如 Retina 屏）时加载此高清图。

- image-3x.jpg 3x：当设备 DPR ≥ 3（如超高清屏）时加载此更高清图。

#### 基于视口宽度的适配 srcset + sizes

根据设备宽度自动选择最佳图片，结合 sizes 定义布局中的图片显示宽度

```html
<img src="small.jpg"
     srcset="medium.jpg 1000w, large.jpg 2000w"
     sizes="(max-width: 600px) 100vw, 50vw"
     alt="响应式图片">
```
` srcset="medium.jpg 1000w, large.jpg 2000w"` 提供不同尺寸的图片，并告诉浏览器他们的实际宽度（w = 像素宽度）。

- `medium.jpg 1000w` 实际宽度是 1000 像素

- `large.jpg 2000w` 实际宽度是 2000 像素。

> 如果布局宽度是 `500px`，且设备 DPR = 1 浏览器可能会选择 `medium.jpg` 因为 1000w 足够覆盖 500px * 1。  
> 如果布局宽度是 1000px 且设备 DPR = 2 浏览器可能选择 `large.jpg`，需要 1000px * 2 = 2000px。

`sizes="(max-width: 600px) 100vw, 50vw"` 定义图片在不同视口宽度下的布局宽度

`(max-width: 600px) 100vw, 50vw`：如果屏幕宽度 ≤ 600px，图片占据 100% 视口宽度（100vw）。否则（屏幕宽度 > 600px），图片占据 50% 视口宽度。

> 手机（375px 宽）：sizes 匹配 100vw → 布局宽度 = 375px。浏览器可能选择 medium.jpg（1000w 足够覆盖 375px × 2 DPR = 750px）。  
> 平板（768px 宽）：sizes 匹配 50vw → 布局宽度 = 384px。浏览器可能选择 medium.jpg（1000w 足够覆盖 384px × 2 DPR = 768px）。  
> 桌面（1200px 宽）：sizes 匹配 50vw → 布局宽度 = 600px。如果 DPR=1，可能选择 medium.jpg（1000w > 600px），如果 DPR=2，可能选择 large.jpg（2000w > 1200px）。 

#### `<Picture>` Art Direction 艺术指导

`picture` 元素允许开发者根据不同的设备屏幕尺寸（通过媒体查询）提供不同的图片资源，从而实现**艺术指导 (Art Direction)**

```html
<picture>
  <source media="(min-width: 1200px)" srcset="desktop-large.jpg">
  <source media="(min-width: 768px)" srcset="tablet.jpg">
  <img src="mobile.jpg" alt="自适应图片">
</picture>
```

`<picture>` 元素作为容器，包裹多个 `<source>` 和一个默认的 `<img>`，让浏览器根据条件选择最合适的图片。

每个 `<source>` 定义了一个图片候选，浏览器会从上到下匹配，使用第一个符合条件的 `<source>` 的图片。

`<source media="(min-width: 1200px)" srcset="desktop-large.jpg">`

- media="(min-width: 1200px)"：媒体查询，匹配 屏幕宽度 ≥ 1200px 的设备（如大桌面显示器）。

- srcset="desktop-large.jpg"：符合条件的设备加载 desktop-large.jpg（通常是高分辨率、宽屏优化的图片）。

`<source media="(min-width: 768px)" srcset="tablet.jpg">`

- media="(min-width: 768px)"：匹配 屏幕宽度 ≥ 768px 但 < 1200px 的设备（如平板或小桌面）。

- srcset="tablet.jpg"：加载 tablet.jpg（可能是中等尺寸、适合横屏的图片）。











