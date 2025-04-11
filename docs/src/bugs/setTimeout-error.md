# setTimeout、setInterval 误差问题

`setTimeout` 和 `setInterval` 的误差主要是由于浏览器的 **事件循环(Event Loop)** 和 **后台标签页的节流策略**有关。

## 事件循环优先级

JavaScript 是单线程的，定时器的回调函数需要等到主线程空闲时才会执行。

如果主线程长时间任务阻塞（如密集计算、同步 I/O 操作）定时器的回调会被延迟执行。

```js
setTimeout(() => console.log("延迟执行"), 100)
// 主线程繁忙时，实际执行时间可能远大于 100ms
```

## 最小延迟限制

浏览器对嵌套的 `setTimeout` 和 `setInterval` 有最小延迟限制（通常为 4ms），即使设置为 0ms，也可能被强制延迟。

```js
// 即使设置为 0，实际延迟可能为 4ms
setTimeout(() => console.log("延迟"), 0)
```

## 系统时钟精确度

浏览器依赖操作系统的时钟精度，而系统时钟可能受其他进程影响（如高负载时）。

## 切换其它 tab 计时器变慢\暂停

为了节省资源，现代浏览器会对后台标签页的定时器进行节流：

- `setTimeout/setInterval` 的最小延迟会被强制降低频率（例如从 100ms 降到 1000ms）。
- 如果标签页处于完全不可见状态（如切换到其他 Tab），某些浏览器甚至会暂停定时器。

## 解决方案

1. 监听 `visibilitychange` 事件修复后台节流

```js
class Timer {
  constructor() {
    this.startTime = Date.now()
    this.elapsedTime = 0
    this.timer = null

    // 监听页面可见性变化
    document.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange.bind(this)
    )
  }

  start() {
    if (!this.timer) {
      this.startTime = Date.now() - this.elapsedTime
      this.timer = setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime
        this.updateDisplay()
      }, 1000)
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      // 页面隐藏时记录时间并停止计时器
      this.elapsedTime = Date.now() - this.startTime
      this.stop()
    } else {
      // 页面可见时重新开始计时
      this.start()
    }
  }

  updateDisplay() {
    const seconds = Math.floor(this.elapsedTime / 1000)
    console.log(`计时：${seconds}秒`)
  }
}

## Web worker



const timer = new Timer()
timer.start()
```
