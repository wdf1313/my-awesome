# 防抖、节流

## 防抖 Debounce

触发事件后，等待 N 秒，如果 N 秒内没有再触发事件，则执行函数。

适用于：输入框搜索、窗口 resize、按钮点击（防止重复提交）等场景；

## 手写防抖函数

```js
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    clearoutTimer(timer) // 清除上一次回调函数
    timer = setTimeour(() => {
      fn.apply(this, args) // 使用 apply 保证 this 和 参数正确
    }, delay)
  }
}

const fn = (a, b) => {
  console.log(a + b)
}
const debounced = debounce(fn, 300)

window.addEventListener("resize", debounced(1, 2))
```

## 节流 Throttle

规定一个时间段内只执行一次函数，即使这个时间段内事件被触发多次，也只执行一次。

适用于：滚动加载、mousemove、scroll、resize、拖拽场景。
