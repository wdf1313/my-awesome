# useContext

在 React 中，如果需要把某个数据从顶层组件传递到很多层级很深的子组件，通常需要一层一层地通过 props 传递。这会导致代码冗长、维护困难，也让中间层的组件变得臃肿（它们本身可能并不需要这些数据，只是负责“中转”）。

`useContext` 用来解决**组件间数据传递繁琐（props drilling）**的问题。它让子组件可以直接获取上层通过 Context 提供的数据，而不需要每一层都通过 props 传递。

## 基础用法

1. **创建 Context**

使用 `React.createContext` 创建一个 context 对象：

```jsx
const MyContext = React.createContext(defaultValue)
```

这里的 `defaultValue` 是当组件不在任何 Context Provider 内部时的默认值。`defaultValue` 可以用 null，但 React 官方建议提供一个有意义的默认值，这样可以让调用 `useContext` 的组件更安全。

2. **使用 Context Provider**

为了在组件树中使用 context，需要用 `MyContext.Provider` 组件包裹，并通过 `value` 属性传递共享的数据：

```jsx
<MyContext.Provider value={someValue}>{/* 子组件 */}</MyContext.Provider>
```

3. **在组件中访问 Context**

在函数组件中使用 `useContext` hook 来访问 context 的值：

```jsx
function MyComponent() {
  const contextValue = useContext(MyContext)
  return <div>{contextValue}</div>
}
```

### 简单示例

下面这个示例中，`App` 组件通过 `ThemeContext` 传递主题，`ThemeButton` 是 `App` 的孙组件：

```jsx
import React, { useContext, createContext } from "react"

// 1. 创建 Context
const ThemeContext = React.createContext("light")

function App() {
  return (
    // 2. 使用 Context Provider
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  )
}

function Toolbar() {
  return (
    <div>
      <ThemeButton />
    </div>
  )
}

function ThemeButton() {
  // 3. 在组件中访问 Context
  const theme = useContext(ThemeContext)
  return <button>{theme} theme</button>
}

export default App
```

## 动态 Context 值

如果 context 的值需要动态变化，可以这样写：

```jsx
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light")

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
      {children}
    </ThemeContext.Provider>
  )
}
```

### 更新对象

如果 context 需要传递对象（如用户信息和修改方法）：

```jsx
import React, { useContext, useState } from "react"

// 1. 创建 Context
const CurrentUserContext = React.createContext(null)

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  return (
    // 2. 使用 Context Provider
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <Toolbar />
    </CurrentUserContext.Provider>
  )
}

function Toolbar() {
  return (
    <div>
      <LoginButton />
    </div>
  )
}

function LoginButton() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext)

  if (currentUser !== null) {
    return <p>You logged in as {currentUser.name}.</p>
  }

  return (
    <Button
      onClick={() => {
        setCurrentUser({ name: "Advika" })
      }}
    >
      Log in as Weijunext
    </Button>
  )
}

export default App
```

## 性能优化

当 `Provider` 的 `value` 属性发生变化时，所有使用了 `useContext` 的组件都会重新渲染。如果 `value` 经常变化，或者消费者组件很多，会引起大量不必要的渲染。

可以通过以下方法优化：

### 粒度化 Context

如果 context 包含了许多不同的状态值，建议将它们拆分成更小的 context。例如，不要只有一个大的 AppContext，而是拆成 UserContext、ThemeContext 等。这样当某一部分数据变化时，只有依赖那部分数据的组件会重新渲染。

```jsx
import { createContext, useContext, useState } from "react"

const ThemeContext = createContext(null)
const CurrentUserContext = createContext(null)

export default function MyApp() {
  const [theme, setTheme] = useState("light")
  const [currentUser, setCurrentUser] = useState(null)
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
        <Toolbar />
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          Toggle Theme
        </button>
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  )
}
```

### 使用 `useMemo` 和 `useCallback` 优化 value

为了避免 `value` 变化导致子孙组件频繁重新渲染，可以用 `useMemo` 和 `useCallback` 对参数和方法进行缓存，减少无意义的更新。

```jsx
import { useCallback, useMemo, useState } from "react"

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null)

  const login = useCallback((response) => {
    storeCredentials(response.credentials)
    setCurrentUser(response.user)
  }, [])

  const contextValue = useMemo(
    () => ({
      currentUser,
      login,
    }),
    [currentUser, login]
  )

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  )
}
```
