# 国际化

## 导读

本篇文档将详细介绍如何在 UmiJS 项目中实现国际化（i18n）支持，包括配置、使用、以及高级功能。

## 基本使用

UmiMax 内置了国际化（i18n）支持，基于 `react-intl` 依赖库。以下是实现国际化的步骤：

### 1. 配置国际化支持

在 `config/config.ts` 中进行如下配置：

```ts
export default {
  local: {
    default: "zh-CN", // 默认支持语言
    antd: true, // 是否开启 antd 国际化
    baseNavigator: true, // 是否启用浏览器语言检测
  },
}
```

### 2. 创建多语言文件

在项目中创建 `src/locales` 目录，并添加语言文件：

```
src
  + locales
    + zh-CN.ts
    + en-US.ts
  pages
```

### 3. 在组件中使用国际化

通过 `useIntl` Hook 使用国际化功能：

```tsx
import { useIntl } from "umi"

function Example() {
  const intl = useIntl()

  return (
    <div>
      <h1>{intl.formatMessage({ id: "navbar.home" })}</h1>
      <p>{intl.formatMessage({ id: "welcome" }, { name: "用户" })}</p>
    </div>
  )
}
```

### 4. 切换语言

使用 `setLocale` 方法切换语言：

```js
import { setLocale } from "umi"

// 切换为英文
setLocale("en-US", false) // 第二个参数表示是否刷新页面
```

## 实现原理

UmiJS 使用 `react-intl` 实现国际化，主要分为以下阶段：

1. **初始化阶段**：读取配置，加载语言文件，设置默认语言。
2. **运行时阶段**：通过 `IntlProvider` 提供国际化上下文和切换语言 API。
3. **构建阶段**：扫描 `src/locales` 目录，打包语言文件，生成映射关系。

## useIntl - React Hooks 方式

`useIntl` 是一个 React Hook，提供了以下常用方法：

- [`formatMessage`](https://formatjs.github.io/docs/react-intl/api#formatmessage)：翻译文本，支持插值变量 `{variable}`。
- [`formatNumber`](https://formatjs.github.io/docs/react-intl/api#formatnumber)：数字格式化（普通数字、货币、百分比）。
- [`formatDate`](https://formatjs.github.io/docs/react-intl/api#formatdate) & [`formatTime`](https://formatjs.github.io/docs/react-intl/api#formattime)：日期和时间格式化，支持多种预设格式。

::: tip
如果 `formatTime` 和 `formatDate` 无法满足需求，可以使用 `date-fns`，它对时间处理更加友好。
:::

以下是一个完整的示例：

```ts
// src/locales/zh-CN.ts
export default {
  welcome: "欢迎，{name}！",
  "user.count": "共有{count, number}位用户",
  price: "价格：{price, number, CNY}",
  "date.birthday": "生日：{date, date, long}",
  "time.current": "当前时间：{time, time, short}",
  messageCount:
    "{count, plural, =0 {没有消息} one {你有1条消息} other {你有#条消息}}",
}

// src/locales/en-US.ts
export default {
  welcome: "Welcome, {name}!",
  "user.count": "{count, number} users in total",
  price: "Price: {price, number, USD}",
  "date.birthday": "Birthday: {date, date, long}",
  "time.current": "Current time: {time, time, short}",
  messageCount:
    "{count, plural, =0 {No messages} one {You have 1 message} other {You have # messages}}",
}

import React from "react"
import { useIntl } from "umi"
import { Card, Space, Typography } from "antd"

const { Text, Title } = Typography

const IntlDemo = () => {
  const intl = useIntl()

  // 1. 基础文本格式化
  const welcomeMessage = intl.formatMessage({ id: "welcome" }, { name: "张三" })

  // 2. 数字格式化
  const userCount = intl.formatMessage({ id: "user.count" }, { count: 4523 })

  // 3. 货币格式化
  const price = intl.formatNumber(299.99, {
    style: "currency",
    currency: "CNY",
  })

  // 4. 日期格式化
  const now = new Date()
  const formattedDate = intl.formatDate(now, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  // 5. 时间格式化
  const formattedTime = intl.formatTime(now, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  return (
    <Card title="useIntl 格式化示例">
      <Space direction="vertical" size="middle">
        <div>
          <Title level={5}>1. 基础文本插值</Title>
          <Text>{welcomeMessage}</Text>
        </div>

        <div>
          <Title level={5}>2. 消息中的数字格式化</Title>
          <Text>{userCount}</Text>
        </div>

        <div>
          <Title level={5}>3. 货币格式化 (formatNumber)</Title>
          <Text>直接格式化: {price}</Text>
          <br />
          <Text>
            通过消息格式化:{" "}
            {intl.formatMessage({ id: "price" }, { price: 299.99 })}
          </Text>
        </div>

        <div>
          <Title level={5}>4. 日期格式化 (formatDate)</Title>
          <Text>直接格式化: {formattedDate}</Text>
          <br />
          <Text>
            通过消息格式化:{" "}
            {intl.formatMessage({ id: "date.birthday" }, { date: now })}
          </Text>
        </div>

        <div>
          <Title level={5}>5. 时间格式化 (formatTime)</Title>
          <Text>直接格式化: {formattedTime}</Text>
          <br />
          <Text>
            通过消息格式化:{" "}
            {intl.formatMessage({ id: "time.current" }, { time: now })}
          </Text>
        </div>

        <div>
          <Title level={5}>6. 复数</Title>
          <Text>
            {intl.formatMessage({ id: "messageCount" }, { count: 0 })}
          </Text>
          <br />
          <Text>
            {intl.formatMessage({ id: "messageCount" }, { count: 1 })}
          </Text>
          <br />
          <Text>
            {intl.formatMessage({ id: "messageCount" }, { count: 2 })}
          </Text>
        </div>
      </Space>
    </Card>
  )
}

export default IntlDemo
```

输出结果：中文环境下

```txt
1. 基础文本插值
   欢迎，张三！

2. 消息中的数字格式化
   共有4,523位用户

3. 货币格式化
   直接格式化: ¥299.99
   通过消息格式化: 价格：299.99

4. 日期格式化
   直接格式化: 2023年5月15日星期一
   通过消息格式化: 生日：2023年5月15日

5. 时间格式化
   直接格式化: 14:30:45
   通过消息格式化: 当前时间：14:30

6. 复数
   没有消息
   你有1条消息
   你有2条消息

```

英文环境下

```txt
1. Basic text interpolation
   Welcome, 张三!

2. Number formatting in messages
   4,523 users in total

3. Currency formatting
   Direct format: $299.99
   Via message: Price: 299.99

4. Date formatting
   Direct format: Monday, May 15, 2023
   Via message: Birthday: May 15, 2023

5. Time formatting
   Direct format: 14:30:45
   Via message: Current time: 2:30 PM

6. 复数
   No messages
   You have 1 message
   You have 2 messages
```

## getIntl - 非 React 环境

`getIntl` 是一个普通函数，可以在非 React 环境中使用：

```ts
import { getIntl } from "umi"

// 在普通函数中使用
function getWelcomeMessage(name) {
  const intl = getIntl()
  return intl.formatMessage({ id: "welcome.message" }, { name })
}
```

## 从右到左 RTL

阿拉伯语、波斯语等语言的阅读方向是从右到左（RTL）。以下是适配 RTL 的方法：

### 1. 设置 HTML 根节点的 `dir` 属性

```html
<html lang="ar" dir="rtl"></html>
```

### 2. CSS 支持 RTL

使用逻辑属性替代方向性属性：

| LTR 写法           | 建议替换为            | RTL 自动适配 |
| ------------------ | --------------------- | ------------ |
| `margin-left`      | `margin-inline-start` | ✅           |
| `margin-right`     | `margin-inline-end`   | ✅           |
| `text-align: left` | `text-align: start`   | ✅           |
| `float: left`      | `float: inline-start` | ✅           |

### 3. Flex 布局适配

```css
html[dir="rtl"] .your-container {
  flex-direction: row-reverse;
}
```

### 4. 第三方组件支持

例如，Ant Design 支持通过 `direction="rtl"` 属性适配 RTL。

## 规范翻译键名 keys 的命名规范

1. 分层结构（模板.页面.功能?.）

```json
{
  "dashboard.header.title": "Dashboard",
  "dashboard.header.welcome": "Welcome, {name}",
  "user.profile.edit": "Edit Profile",
  "user.profile.save": "Save Changes"
}
```

2. 配合 lint 工具校验翻译 key 是否存在，比如 eslint-plugin-i18n-json
