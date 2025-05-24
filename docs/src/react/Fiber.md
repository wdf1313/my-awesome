# Fiber

## Fiber 的由来

在 React16 之前，使用的是 "Stack Reconciler" 栈协调器，采用同步递归的方式处理 UI 更新。

当组件更新时，React 会深度优先遍历整个组件树，生成新的虚拟 DOM。然后对比新旧虚拟 DOM 树，计算出需要更新的部分。最后同步应用到真实 DOM 上。

这种方式有个很大的问题：一旦开始渲染，整个渲染过程就无法中断。如果组件树很大，递归更新时间会长时间占用主线程。导致浏览器无法处理用户交互，造成卡顿，响应不及时等问题。

为了解决这些问题，React 团队在 React 16 推出了全新的架构 Fiber。

## Fiber 是什么

当我们写 React 组件并使用 JSX 时，React 在底层会将 JSX 转换为元素的对象结构，例如：

```jsx
const element = <h1>Hello, react</h1>
```

上述代码会被转换为以下形式：

```js
const element = React.createElement("h1", null, "Hello world")
```

为了将这个元素渲染到页面上，React 会创建一种内部实例，用来追踪该组件的所有信息和状态。在早起版本的 React 中称为“实例”或“虚拟 DOM 对象”，在 Fiber 架构中，新的工作单元就叫 Fiber。

Fiber 的核心是一个链表结构，每个 Fiber 节点代表一个 React 组件（或 DOM 节点）。

Fiber 节点之间通过指针连接，形成一棵 Fiber Tree，这颗树结构和 React 组件树一一对应。

源码里的 Fiber Node 结构

```js
function FiberNode(
  this: $FlowFixMe,
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode
) {
  // 基本属性
  this.tag = tag // 描述此Fiber的启动模式的值（LegacyRoot = 0; ConcurrentRoot = 1）
  this.key = key // React key
  this.elementType = null // 描述React元素的类型。例如，对于JSX<App />，elementType是App
  this.type = null // 组件类型
  this.stateNode = null // 对于类组件，这是类的实例；对于DOM元素，它是对应的DOM节点。

  // Fiber链接
  this.return = null // 指向父Fiber
  this.child = null // 指向第一个子Fiber
  this.sibling = null // 指向其兄弟Fiber
  this.index = 0 // 子Fiber中的索引位置

  this.ref = null // 如果组件上有ref属性，则该属性指向它
  this.refCleanup = null // 如果组件上的ref属性在更新中被删除或更改，此字段会用于追踪需要清理的旧ref

  // Props & State
  this.pendingProps = pendingProps // 正在等待处理的新props
  this.memoizedProps = null // 上一次渲染时的props
  this.updateQueue = null // 一个队列，包含了该Fiber上的状态更新和副作用
  this.memoizedState = null // 上一次渲染时的state
  this.dependencies = null // 该Fiber订阅的上下文或其他资源的描述

  // 工作模式
  this.mode = mode // 描述Fiber工作模式的标志（例如Concurrent模式、Blocking模式等）。

  // Effects
  this.flags = NoFlags // 描述该Fiber发生的副作用的标志（十六进制的标识）
  this.subtreeFlags = NoFlags // 描述该Fiber子树中发生的副作用的标志（十六进制的标识）
  this.deletions = null // 在commit阶段要删除的子Fiber数组

  this.lanes = NoLanes // 与React的并发模式有关的调度概念。
  this.childLanes = NoLanes // 与React的并发模式有关的调度概念。

  this.alternate = null // Current Tree和Work-in-progress (WIP) Tree的互相指向对方tree里的对应单元

  // 如果启用了性能分析
  if (enableProfilerTimer) {
    // ……
  }

  // 开发模式中
  if (__DEV__) {
    // ……
  }
}
```

当 React 开始工作时，它会沿着 Fiber 树形结构进行，试图完成每个 Fiber 的工作（例如，比较久的 props 与 新的 props，确定是否需要更新组件等）。如果主线程有更重要的工作，React 可以中断当前工作并返回执行主线线程上的任务。

所以说，Fiber 不仅仅是代表组件的内部对象，还是 React 的任务管理系统。

## Fiber 工作原理

Fiber 工作原理中最核心的点就是：可中断、可恢复、可分片，从而实现高性能的 UI 更新。

其原理可分为以下几个关键点：

1. **单元工作**

每个 Fiber 节点代表一个单元，所有 Fiber 节点共同组成了一个 Fiber 链表树（有链表属性，同时又有树的结构），这种结构让 React 可以细粒度控制节点的行为。

2. **链表属性**

`child`、`sibling` 和 `return` 字段构成了 Fiber 之间的链接关系，使 React 能够便利组件树并知道从哪里开始、继续或停止工作。

![Fiber Link](./images/fiber-link.png)

3. **双缓存技术**

React 内部会维护两颗 Fiber 树：current tree （当前树） 和 work-in-progress(WIP) tree（工作树）

每次更新时，React 会基于 current tree 创建一棵新的 WIP tree，包含了当前更新受影响的最高节点直至所有子孙节点，所有的变更都先作用在这颗工作树上。

更新完成后，WIP 会复制其他节点，替换掉 current tree。

![Fiber Tree](./images/fiber-tree.png)

4. **State 和 Props**

`memoizedProps`、`pendingProps` 和 `memoizedState` 字段让 React 知道组件的上一个状态和即将应用的状态。通过比较这些值，React 可以决定组件是否需要更新，从而避免不必要的渲染，提高性能。

5. **副作用的追踪**

`flags` 和 `subtreeFlags` 字段标识 Fiber 及其子树中需要执行的副作用，例如 DOM 更新、生命周期方法调用等。React 会积累这些副作用，然后在 Commit 阶段一次性执行，从而提高效率。

## Fiber 工作流程

React 的 Fiber 架构将整个渲染流程分为两个主要阶段：

1. 调和（Reconcilation）阶段：根据最新的 state / props 生成新的 Fiber 树，并找出需要更新的地方。这个阶段是**可中断**的，可以被打断、恢复。
2. 提交（commit）阶段：将调和阶段收集到的变更一次性应用到真实 DOM 上，这个阶段是**不可中断**的，必须一次完成

### 调和阶段 Reconcilation

以函数组件为例，通常是因为 `useState`、`useReducer`、父组件 props 变化等触发更新。React 会从根节点（Root Fiber）开始，调度一次更新。

React 会基于当前 Fiber 树，创建一棵 work-in-progress tree。这棵树会复用大部分节点，只对有变更的部分做增删改。

#### 创建与标记更新节点 beginWork

1. 判断 Fiber 节点是否需要更新

```js
// packages/react-reconciler/src/ReactFiberBeginWork.js
// 以下只是核心逻辑的代码，不是beginWork的完整源码
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  if (current !== null) {
    // 这是旧节点，需要检查props和context是否有变化再确认是否需要更新节点
    const oldProps = current.memoizedProps
    const newProps = workInProgress.pendingProps

    if (oldProps !== newProps || hasLegacyContextChanged()) {
      didReceiveUpdate = true // props和context有变化，说明节点有更新
    } else {
      // 其它特殊情况的判断
    }
  } else {
    didReceiveUpdate = false // 这是新节点，要创建，而不是更新
  }

  workInProgress.lanes = NoLanes // 进入beginWork表示开始新的工作阶段，所以要把旧的workInProgress优先级清除掉

  switch (workInProgress.tag) {
    // 通过workInProgress的tag属性来确定如何处理当前的Fiber节点
    // 每一种tag对应一种不同的Fiber类型，进入不同的调和过程（reconcileChildren()）
    case IndeterminateComponent: // 尚未确定其类型的组件
    // ……
    case LazyComponent: // 懒加载组件
    // ……
    case FunctionComponent: // 函数组件
    // ……
    case ClassComponent: // 类组件
    // ……

    // 其它多种Fiber类型
    // case ……
  }
}
```

2. 判断 Fiber 子节点是更新还是复用

```js
// packages/react-reconciler/src/ReactFiberBeginWork.js
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any, // 要调和的新的子元素
  renderLanes: Lanes
) {
  if (current === null) {
    // 如果current为空，说明这个Fiber是首次渲染，React会为nextChildren生成一组新的Fiber节点
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    )
  } else {
    // 当current非空时，React会利用现有的Fiber节点（current.child）和新的子元素（nextChildren）进行调和
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    )
  }
}
```

`mountChildFibers` 和 `reconcileChildFibers` 最终会进入同一个方法`createChildReconciler`，执行 Fiber 节点的调和（处理诸如新的 Fiber 创建、旧 Fiber 删除或现有 Fiber 更新等操作）。而整个 `beginWork` 完成后，就会进入 `completeWork` 流程。

#### 收集副作用列表 completeUnitOfWork 和 completeWork

`completeUnitOfWork` 负责遍历 Fiber 节点，同时记录了有副作用节点的关系。

```js
// packages/react-reconciler/src/ReactFiberWorkLoop.js
// 以下只是核心逻辑的代码，不是completeUnitOfWork的完整源码
function completeUnitOfWork(unitOfWork: Fiber): void {
  let completedWork: Fiber = unitOfWork // 当前正在完成的工作单元
  do {
    const current = completedWork.alternate // 当前Fiber节点在另一棵树上的版本
    const returnFiber = completedWork.return // 当前Fiber节点的父节点

    let next
    next = completeWork(current, completedWork, renderLanes) // 调用completeWork函数

    if (next !== null) {
      // 当前Fiber还有工作要完成
      workInProgress = next
      return
    }
    const siblingFiber = completedWork.sibling
    if (siblingFiber !== null) {
      // 如果有兄弟节点，则进入兄弟节点的工作
      workInProgress = siblingFiber
      return
    }
    // 如果没有兄弟节点，回到父节点继续
    completedWork = returnFiber
    workInProgress = completedWork
  } while (completedWork !== null)

  // 如果处理了整个Fiber树，更新workInProgressRootExitStatus为RootCompleted，表示调和已完成
  if (workInProgressRootExitStatus === RootInProgress) {
    workInProgressRootExitStatus = RootCompleted
  }
}
```

completeWork 在 completeUnitOfWork 中被调用，下面是 completeWork 的逻辑，主要是根据 tag 进行不同的处理，真正的核心逻辑在 bubbleProperties 里面

```js
// packages/react-reconciler/src/ReactFiberCompleteWork.js
// 以下只是核心逻辑的代码，不是completeWork的完整源码
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  const newProps = workInProgress.pendingProps
  switch (workInProgress.tag) {
    // 多种tag
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
      bubbleProperties(workInProgress)
      return null
    case ClassComponent:
      // 省略逻辑
      // ……
      bubbleProperties(workInProgress)
      return null
    case HostComponent:
      // 省略逻辑
      // ……
      return null
    // 多种tag
    // ……
  }
}
```

bubbleProperties 为 completeWork 完成了两个工作：1. 记录 Fiber 的副作用标志；2. 为子 Fiber 创建链表

```js
// packages/react-reconciler/src/ReactFiberCompleteWork.js
// 以下只是核心逻辑的代码，不是bubbleProperties的完整源码
function bubbleProperties(completedWork: Fiber) {
  const didBailout =
    completedWork.alternate !== null &&
    completedWork.alternate.child === completedWork.child // 当前的Fiber与其alternate（备用/上一次的Fiber）有相同的子节点，则跳过更新

  let newChildLanes = NoLanes // 合并后的子Fiber的lanes
  let subtreeFlags = NoFlags // 子树的flags。

  if (!didBailout) {
    // 没有bailout，需要冒泡子Fiber的属性到父Fiber
    let child = completedWork.child
    // 遍历子Fiber，并合并它们的lanes和flags
    while (child !== null) {
      newChildLanes = mergeLanes(
        newChildLanes,
        mergeLanes(child.lanes, child.childLanes)
      )

      subtreeFlags |= child.subtreeFlags
      subtreeFlags |= child.flags

      child.return = completedWork // Fiber的return指向父Fiber，确保整个Fiber树的一致性
      child = child.sibling
    }
    completedWork.subtreeFlags |= subtreeFlags // 合并所有flags（副作用）
  } else {
    // 有bailout，只冒泡那些具有“静态”生命周期的flags
    let child = completedWork.child
    while (child !== null) {
      newChildLanes = mergeLanes(
        newChildLanes,
        mergeLanes(child.lanes, child.childLanes)
      )

      subtreeFlags |= child.subtreeFlags & StaticMask // 不同
      subtreeFlags |= child.flags & StaticMask // 不同

      child.return = completedWork
      child = child.sibling
    }
    completedWork.subtreeFlags |= subtreeFlags
  }
  completedWork.childLanes = newChildLanes // 获取所有子Fiber的lanes。
  return didBailout
}
```

### 提交阶段 Commit

#### 遍历副作用列表 BeforeMutation

```js
// packages/react-reconciler/src/ReactFiberCommitWork.js
// 以下只是核心逻辑的代码，不是commitBeforeMutationEffects的完整源码
export function commitBeforeMutationEffects(
  root: FiberRoot,
  firstChild: Fiber
): boolean {
  nextEffect = firstChild // nextEffect是遍历此链表时的当前fiber
  commitBeforeMutationEffects_begin() // 遍历fiber，处理节点删除和确认节点在before mutation阶段是否有要处理的副作用

  const shouldFire = shouldFireAfterActiveInstanceBlur // 当一个焦点元素被删除或隐藏时，它会被设置为 true
  shouldFireAfterActiveInstanceBlur = false
  focusedInstanceHandle = null

  return shouldFire
}
```

#### 正式提交：CommitMutation

```js
// packages/react-reconciler/src/ReactFiberCommitWork.js
// 以下只是核心逻辑的代码，不是commitMutationEffects的完整源码
export function commitMutationEffects(
  root: FiberRoot,
  finishedWork: Fiber,
  committedLanes: Lanes
) {
  // lanes和root被设置为"in progress"状态，表示它们正在被处理
  inProgressLanes = committedLanes
  inProgressRoot = root

  // 递归遍历Fiber，更新副作用节点
  commitMutationEffectsOnFiber(finishedWork, root, committedLanes)

  // 重置进行中的lanes和root
  inProgressLanes = null
  inProgressRoot = null
}
```

#### 处理 layout effects：commitLayout

```js
// packages/react-reconciler/src/ReactFiberCommitWork.js
export function commitLayoutEffects(
  finishedWork: Fiber,
  root: FiberRoot,
  committedLanes: Lanes
): void {
  inProgressLanes = committedLanes
  inProgressRoot = root

  // 创建一个current指向就Fiber树的alternate
  const current = finishedWork.alternate
  // 处理那些由useLayoutEffect创建的layout effects
  commitLayoutEffectOnFiber(root, current, finishedWork, committedLanes)

  inProgressLanes = null
  inProgressRoot = null
}
```
