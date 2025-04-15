import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "HTML",
        link: "/html",
        items: [{ text: "defer、async", link: "/html/defer-async" }],
      },
      {
        text: "CSS",
        items: [
          { text: "css selector", link: "/css/selector" },
          { text: "responsive layout", link: "/css/responsive-layout" },
        ],
      },
      {
        text: "JS",
        items: [
          { text: "date-type", link: "/js/data-type" },
          { text: "var、let、const", link: "/js/var-let-const" },
          { text: "scope", link: "/js/scope" },
          { text: "closure", link: "/js/closure" },
          {
            text: "functional-programming",
            link: "/js/functional-programming",
          },
          // { text: "Markdown Examples", link: "/markdown-examples" },
          // { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
      {
        text: "Frontend Engineer",
        items: [
          { text: "git", link: "/enginner/git" },
          { text: "webpack loader", link: "/enginner/webpack-loader" },
          { text: "webpack plugin", link: "/enginner/webpack-plugin" },
        ],
      },
      {
        text: "Network",
        items: [
          { text: "CORS", link: "/network/cors" },
          {
            text: "cross origin request",
            link: "/network/cross-origin-requests",
          },
        ],
      },
      {
        text: "Bugs",
        items: [{ text: "setTimeout-error", link: "/bugs/setTimeout-error" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
  srcDir: "src",
})
