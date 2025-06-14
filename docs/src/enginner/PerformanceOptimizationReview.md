# 性能优化

## 回答思路

1.怎么检测性能 
   1.1根据检测到的性能问题，通过什么手段优化
2.网络优化：常见手段，优化案例
3.资源优化：常见手段，优化案例
4.构建优化webpack+vite(?)：常见手段，优化案例
3.react项目性能优化和 vue项目优化（?）：常见手段，优化案例

## 前端性能检测

 根据performanceAPI统计前端性能指标，例如统计出FCP,LCP,CLS,TTL，等性能指标**详情见performance-index.md**定位性能问题。

 但定位出的问题最终会回溯到这几个问题上：资源加载问题，解析问题，渲染问题
 网络优化手段,资源优化手段,以及构建打包优化这几个常见的优化手段，所以在针对定位的性能问题之前我们需要将常见的性能优化手段。。。

## 加载问题优化
 
1. 网络优化：
    CDN内容分发：将静态资源，音视频，等资源 放到最近的cdn服务器，可以减少加载速度 ，
    DNS预解析 ：设置dns-prefetch可以在dns解析
    http2/http3的使用
    缓存策略：强缓存和协商缓存策略
2. 资源优化：
    减少资源体积：gzip压缩，terser压缩css,cssnano进行压缩。
    图片资源的格式优化
3. 优化资源加载策略
    预加载关键资源，延迟加载非关键资源，使用fetchproiority标记关键资源
4. 缓存策略优化：强缓存协商缓存，servive缓存。
5. 利用webpack分包机制，智能拆包：splitchunks；详情见**webpack-splitChunks.md**

## 渲染问题优化
js->style->layout->paint->composite

1. css
    css是浏览器解析样式的基础，复杂的选择器会增加解析的时间，通过选择简单的css选择器
    启用css3动画触发GPU加速
    减少css表达式的使用
2. js
   requestAnimationFrame:利用requestAnimation专门为**执行动画**提供api,处理js动画，页面滚动.
   webWorker:将**复杂的计算任务**(数据处理，图像处理)，放在web Worker中执行，避免阻塞主线程，提高页面响应速度
   防抖(deounce):使用防抖函数处理一些高频操作，例如输入搜索，按钮重复提交等
   requestIdleCallback:可以根据浏览器的**空闲**时间来安排任务，执行一些非关键任务，例如统计日志预加载等操作.
3. dom优化
   避免大型复杂的布局，修改避免多次触发布局计算，减少页面重排重绘
   批量修改dom
   长列表虚拟滚动

## 构建优化策略 

1. 构建速度优化
   解析优化:通过缩小文件搜索返回，高性能loader解析优化
   多进程构建:thread-loodder并行处理
2. 打包体积优化
   tree shaking深度优化
   splitchuck拆包
   资源压缩terser
3. 缓存优化
   webpack5内置缓存
   loader缓存
4. 在webpack里配置一个分析插件例如速度分析插件，打包分析插件，进度可视化分析。
     
## react项目优化策略
1. 组件优化策略
   组件记忆化：通过react.memo函数进行新老props比对,使用usememe来计算缓存结果
   回调函数记忆化：通过usecallback减少函数创建，减少子组件不必要渲染
   useTransition的使用：来标记一个更新为不紧急的更新
   useDeferredValue:可以让我们延迟渲染不紧急的部分，类似于防抖但没有固定的延迟时间
   滥用effect
2. 状态管理优化策略
   精细化状态更新：setState(preState=>({...prev}))
3. 渲染性能优化
   服务端渲染
4. 懒加载策略 代码分割和加载优化
   利用lazy和suspense来实现加载优化
5. key的使用
6. 内存泄漏问题
   使用useEffect的返回函数来卸载清理全局的监听器计时器。防止内存泄漏影响性能
7. 针对react项目的监控分析工具
   react Profiler API