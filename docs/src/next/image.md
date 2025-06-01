# Next.js 提供的 Image 组件

现代 Web 开发中，图片优化是提升网站性能的关键因素之一。Next.js 提供的 Image 组件不仅简化了图片处理流程，还带来了显著的性能提升。

## Image 组件内置的性能优化

1. 自动图片优化：自动将图片转为现代图片格式（WebP/AVIF）
2. 智能尺寸调整：根据设备生成合适尺寸的图片
3. 懒加载：默认只加载视口内的图片
4. 防止布局偏移：自动预留图片空间，避免 CLS（Cumulative Layout Shift）
5. 自动添加 `alt` 属性

## 如何使用 Image 组件

```jsx
<Image
  src="/photo.jpg"
  alt="描述"
  width={500} // 必填
  height={300} // 必填
  quality={75} // 图片质量，默认 75
  priority={true} // 是否优先加载
  loading="lazy" // 加载方式：lazy/eager
  layout="fill" // 填充模式
  objectFit="cover" // 填充方式：cover/contain/fill
  placeholder="blur" // 模糊占位符
/>
```
