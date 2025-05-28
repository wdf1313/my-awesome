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
          { text: "prototype", link: "/js/prototype" },
          { text: "closure", link: "/js/closure" },
          { text: "functional-programming", link: "/js/functional-programming" },
          { text: "debounce-throttle", link: "/js/debounce-throttle" },
        ],
      },
      {
        text: "React",
        items: [
          { text: "JSX", link: "/react/jsx" },
          { text: "hooks", link: "/react/hooks" },
          { text: "Fiber", link: "/react/Fiber" },
        ],
      },
      {
        text: "Vue",
        items: [
          { text: "reactivity", link: "/vue/reactivity" },
          { text: "render pipeline", link: "/vue/render-pipeline" },
        ],
      },
      {
        text: "Frontend Engineer",
        items: [
          { text: "git", link: "/enginner/git" },
          { text: "module", link: "/enginner/module" },
          {
            text: "webpack",
            link: "/enginner/webpack",
            items: [
              { text: "loader", link: "/enginner/webpack-loader" },
              {
                text: "loader develop",
                link: "/enginner/webpack-loader-develop",
              },
              {
                text: "splitChunks",
                link: "/enginner/webpack-splitChunks",
              },
              { text: "terser", link: "/enginner/webpack-terser" },
              { text: "hmr", link: "/enginner/webpack-HMR" },
            ],
          },
          {
            text: "performance optimization",
            link: "/enginner/performance-optimization",
            items: [{ text: "Dom Fragment", link: "/enginner/dom-fragment" }],
          },
        ],
      },
      {
        text: "Next.js",
        items: [{ text: "next", link: "/next/README.md" }],
      },
      {
        text: "Network",
        items: [
          { text: "CORS", link: "/network/cors" },
          {
            text: "cross origin request",
            link: "/network/cross-origin-requests",
          },
          {
            text: "browser process/thread",
            link: "/network/browser-process-thread",
          },
          {
            text: "input url loading process",
            link: "/network/input-url-loading-process",
          },
          { text: "browser render", link: "/network/browser-render" },
          { text: "cache-straregy", link: "/network/cache-straregy" },
        ],
      },
      {
        text: "Project",
        items: [
          {
            text: "backend-authentication",
            link: "/project/backend-authentication",
          },
          {
            text: "internationalization",
            link: "/project/internationalization",
          },
          { text: "micro frontEnd", link: "/project/micro-frontend" },
          { text: "Qiankun", link: "/project/qiankun" },
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
