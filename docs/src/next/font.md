# Next.js 字体加载优化

## 传统 Web 字体加载的三大痛点

1. 资源臃肿

全量字体文件常达 2-10MB，但页面实际使用自符不足 1%。需要手动生成子集，增加维护成本。

```css
/* 传统@font-face需兼容多格式 */
@font-face {
  font-family: "MyFont";
  src: url("font.woff2") format("woff2"), url("font.woff") format("woff"); /* 额外30%+体积 */
}
```

2. 渲染失控（FOIT/FOUT）

- FOIT（不可见文本闪烁）：Safari 等浏览器在字体加载钱隐藏文本
- FOUT（无样式文本闪烁）：Chrome / Firefox 先显示备用字体在切换，导致布局跳动。

3. 配置繁琐：需手动处理，预加载标签、多格式兼容、缓存策略、跨域配置。

## Next.js 字体解决方案 `next/font`

四行代码实现全优化

```js
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"], // 自动子集化
  display: "swap", // 消除FOIT/FOUT
  preload: true, // 自动注入预加载标签
})
export default function Page() {
  return <h1 className={inter.className}>优化后的文本</h1>
}
```
