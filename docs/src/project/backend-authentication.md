# 后台管理项目登录、菜单权限

## 导读

本篇文档主要介绍后台管理项目中登录功能和权限管理的实现，包括以下内容：
1. **飞书扫码登录**：通过飞书 OAuth2.0 授权机制实现扫码登录。
2. **菜单权限管理**：基于 UmiMax 的动态菜单配置和权限控制。
3. **按钮权限管理**：通过自定义组件实现按钮级别的权限控制。
  

## 飞书扫码登录

用户通过飞书 APP 扫码，完成第三方系统的登录。利用飞书开放平台的 OAuth2.0 授权机制，前端生成二维码，用户扫码后在飞书授权，授权后成功跳转系统页面，前端拿到临时 code，调用后端完成登录。

### 实现流程

1. **前端生成二维码**

在 `config.js` 中引入飞书扫码登录 JS SDK，用于前端生成二维码，二维码内容是一个带有 `client_id`、`redirect_uri` 等参数的授权链接。

```js
export default defineConfig({
  headScripts: [
    {
      src: "https://lf1-cdn-tos.bytegoofy.com/goofy/lark/op/h5-js-sdk-1.5.32.js",
      async: true,
    },
  ],
})
```

将二维码挂载到页面上：

```js
const QRLoginRef = useRef(null)

useEffect(() => {
  QRLoginRef.current = window.QRLogin({
    id: "login_container",
    goto,
    width: "300",
    height: "300",
    style: "border: none;",
    onReady,
    onFailure,
  })
}, [])
```

2. **用户扫码授权**

用户使用飞书 APP 扫码，确认授权后，飞书会把用户带到先前配置的 `redirect_uri`，并在 URL 上带上临时的 `code` 和 `state`。

3. **前端检测回跳**

前端页面检测到 URL 上的 `code` 参数，自动向后端发送请求：

```js
const handleScanSuccess = useCallback(() => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get("code")
  const state = params.get("state")
  if (code && state) {
    handleLogin({ code, state })
  }
}, [])

useEffect(() => {
  handleScanSuccess()
}, [handleScanSuccess])
```

4. **后端用 code 换取用户信息**

后端通过飞书开放平台接口，用 `code` 换取用户的详细信息，并完成登录逻辑。


## 菜单、按钮权限

UmiMax 内置了权限支持，主要通过 `@umijs/plugin-access` 实现，需在 `config/config.ts` 中启用。

```js
export default {
  access: {},
}
```

登录成功后，查询当前用户的菜单权限，将用户信息（`currentUser`）和菜单信息（`menuInfo`）在 `getInitialState()` 中返回。

### 配置动态菜单

菜单数据结构如下：

```js
{
  // 一级菜单
  menuName: '数据中心',
  path: '/record-center',
  children: [
    {
      // 二级菜单
      menuName: '基础数据',
      path: '/record-center/base-data',
      component: 'src/record-center/base-data/index.tsx',
    }
  ]
}
```

在 `app.tsx` 中配置菜单权限：

```js
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    menu: {
      locale: true,
    },
  }
}
```

定义权限逻辑，在 `src/access.ts` 中：

```js
export default function(initialState) {
  const { currentUser, menuInfo } = initialState || {}
  // menu permissions map
  const permissionsMap = currentUser.permissions.reduce(
    (acc: any, curr: string) => {
      acc[curr] = true;
      return acc;
    },
    {},
  );

  return {
    ...permissionsMap
  }
}
```

在路由中配置 `access`：

```js
export default [
  {
    menuName: "数据中心",
    path: "/record-center",
    access: "recordCenter",
  },
]
```

---

### 配置按钮权限

在 `src/access.ts` 文件中默认导出一个方法，该方法会在项目初始化时被执行。

在这个方法中返回一个对象，并绑定一个 `hasAccess` 方法，用于判断当前用户是否具备当前页面按钮权限。

```js
// 递归遍历后端返回的菜单树，找到所有子菜单下的按钮权限码
function getPermCodeList(menuInfo) {
  if (!Array.isArray(menuInfo)) return []

  return menuInfo.reduce((acc: string[], item) => {
    const codes = [item.permCode]
    if (Array.isArray(item.children)) {
      codes.push(...getPermCodeList(item.children))
    }
    return [...acc, ...codes]
  }, [])
}

export default function (initialState) {
  const { currentUser, menuInfo } = initialState ?? {}
  const adminRoleInfo = (currentUser?.roleInfo || []).find((x) => x.roleId === 1)
  const isAdmin = !!adminRoleInfo // 是否为管理员
  const permCodeList = getPermCodeList(menuInfo) // 按钮权限

  return {
    hasAccess(code) {
      return isAdmin || permCodeList.includes(code)
    },
  }
}
```

封装 `<AuthControl>` 自定义组件：

```jsx
import { useAccess, Access } from "@umijs/max"

type AuthControlProps = {
  code: string,
  children: React.ReactNode,
}

const AuthControl: React.FC<AuthControlProps> = (props) => {
  const { code, children } = props
  const access = useAccess()

  return <Access accessible={access.hasAccess(code)}>{children}</Access>
}

export default AuthControl
```

使用时将需要鉴权的按钮通过 `children` 传入：

```jsx
<AuthControl code="basic:view">
  <Button onClick={() => handleClick()} />
</AuthControl>
```

通过以上配置，您可以实现基于菜单和按钮的权限管理，确保系统的安全性和灵活性。
