# 性能指标
## First Paint (FP)

**首次绘制**

浏览器首次在屏幕上**绘制像素**的时间点，即页面开始显示内容的时间

## First Contentful Paint (FCP)

**首次渲染绘**

指页面**首次**渲染出任何内容（如文本、图片、SVG 等）的时间。

FCP 反映了用户第一次看到页面内容的速度。

测量FCP的工具：lighthouse chrome DEvTools pageSpeed Insights

降低FCP的手段：延迟加载渲染阻塞资源html/css/js/字体文件，利用webpack插件对这些资源进行压缩

## Largest Contentful Paint（LCP）

**最大内容绘制**

指页面主视区内**最大内容元素**渲染完成时间。

直接影响用户的“页面加载完成”感知。

测量lcp的工具：PageSpeed Insights

优化lcp的手段：CDN负载均衡
## Time to Interactive（TTI）

**可交互时间**

指页面变得完全可交互（即用户可以点击、输入等到做且页面响应迅速）的时间。

TTI 反映了页面从加载到可用的速度。

## Total Blocking Time（TBT）

**总阻塞时间**

指 FCP 和 TTI 之间，主线程被任务阻塞超过 50ms 的总时间。

TBT 主要衡量页面在加载过程中由于 JavaScript 执行等原因导致的“卡顿”时间。

## Cumulative Layout Shift (CLS)

**累计布局偏移**

衡量页面在加载过程中发生的所有意外布局移动的总和。

反映了页面视觉稳定性，数值越低越好。

## Speed Index

**速度指数**

衡量页面内容在可视区域内显示的速度。

数值越低，说明内容越快显示出来。

## First Input Delay（FID）

**首次输入延迟**

指用户首次与页面交互（如点击按钮、链接等）到浏览器实际响应的时间。

FID 主要反应页面的响应速度。
