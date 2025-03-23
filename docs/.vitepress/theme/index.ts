import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme"

import "bootstrap-icons/font/bootstrap-icons.css" // 引入 Bootstrap Icons

import CodeDemo from "../components/CodeDemo.vue"

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("CodeDemo", CodeDemo)
  },
} satisfies Theme
