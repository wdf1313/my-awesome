# 后台管理项目登录、菜单权限

## 飞书扫码登录

用户通过飞书 APP 扫码，完成第三方系统的登录。利用飞书开放平台的 OAuth2.0 授权机制，前端生成二维码，用户扫码后再飞书授权，授权后成功跳转系统页面，前端拿到临时 code，调用后端完成登录。

### 实现流程

1. **前端生成二维码**

在 `config.js` 中引入飞书扫码登陆 JS SDK，用于前端生成二维码，二维码内容是一个带有 client_id、redirect_uri 等参数的授权链接。

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

将二维码挂在到页面上

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

用户使用飞书 APP 扫码，确认授权后，飞书会把用户带到先前配置的 `redirect_uri`，并在 URL 上带上临时的 code 和 state

3. **前端检测回跳**

前端页面检测到 URL 上 code 参数，自动向后端发送请求

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

## 菜单、按钮权限

在 `UmiMax` 项目下[配置权限](https://umijs.org/docs/max/access#%E6%89%A9%E5%B1%95%E7%9A%84%E8%B7%AF%E7%94%B1%E9%85%8D%E7%BD%AE)需要在`config/config.ts` 中启用

```js
export default {
  access: {},
}
```

登录成功查询当前用户菜单权限，将用户信息（currentUser）菜单信息（menuInfo）在 `getInitialState()` 中返回。

### 配置动态菜单

菜单数据结构如下

```js
{
  // 一级菜单
  menuName: '数据中心',
  path: '/record-center',
  children: [
    {
      // 二级菜单
      menuName: '基础数据',
      path: '/record-center/base-data'
    }
  ]
}
```

在 `app.tsx` 中配置菜单权限

```js
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    menu: {
      locale: true,
    },
  }
}
```

定义权限逻辑，在 `src/access.ts` 中

```js
export default function(initialState:) {
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

在路由中配置 access

```js
export default [
  {
    menuName: "数据中心",
    path: "/record-center",
    access: "recordCenter",
  },
]
```

### 配置按钮权限

在 `src/accrss.ts` 文件默认导出一个方法，导出的方法会在项目初始化时被执行。

在这个方法中返回一个对象，我在这个对象中绑定了一个 `hasAccess` 方法用于判断当前用户是否具备当前页面按钮权限。

```js
// 递归遍历后端返回有权限的菜单树，找到所有子菜单下的按钮权限码
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
  const adminRoleInfo = (currentInfo?.roleInfo).find((x) => x.roleId === 1)
  const isAdmin = _.isEmpty(adminRoleInfo) // 是否为管理员
  const perCodeList = getPermCodeList(menuInfo) // 按钮权限

  return {
    hasAccess(code) {
      return isAdmin || permCodeList.includes(code)
    },
  }
}
```

封装 `<AuthControl>` 自定义组件

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

使用时将需要鉴权的按钮通过 children 传入

```jsx
<AuthControl code="basic:view">
  <Button onClick={() => handleClick()} />
</AuthControl>
```
