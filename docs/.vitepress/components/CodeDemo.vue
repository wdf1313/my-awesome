<template>
  <div class="code-demo">
    <!-- 展示代码的执行效果 -->
    <div class="shadom-dom" ref="shadowDom"></div>

    <!-- 操作按钮 -->
    <div class="code-actions">
      <i class="bi bi-box" style="font-size: 1rem;" @click="openInCodepen"></i>
      <i class="bi bi-code" style="font-size: 1.25rem;" @click="toggleSourceCode" />
    </div>

    <!-- 展示源代码 -->
    <transition name="expand">
      <div v-if="showSourceCode" class="source-code">
        <pre><code>{{ formattedCode }}</code></pre>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"

const props = defineProps({
  html: { type: String, required: true },
  css: { type: String, required: true },
})

// 格式化代码的工具函数
const formatCode = (code) => {
  return code
    .trim() // 移除首尾空白
    .replace(/^\s+/gm, '') // 移除每行开头的空白
    .replace(/\n{3,}/g, '\n\n') // 将连续3个以上的换行替换为2个
}

const shadowDom = ref(null) // shadom Dom 实例
const showSourceCode = ref(false) // 是否显示源代码

// 格式化显示代码
const formattedCode = computed(() => {
  const formattedHtml = formatCode(props.html)
  const formattedCss = formatCode(props.css)
  return `${formattedHtml}\n\n<style>\n${formattedCss}\n</style>`
})

// 创建 shadowHost DOM 并注入 HTML 和 CSS
onMounted(() => {
  if (shadowDom.value) {
    const shadowRoot = shadowDom.value.attachShadow({ mode: "open" })
    const formattedHtml = formatCode(props.html)
    const formattedCss = formatCode(props.css)
    shadowRoot.innerHTML = `
      ${formattedHtml}
      <style>${formattedCss}</style>
    `
  }
})

// 显示代码
const toggleSourceCode = () => {
  showSourceCode.value = !showSourceCode.value
}

// 打开 codepen
const openInCodepen = () => {
  // 创建一个隐藏的表单
  const form = document.createElement('form')
  form.style.display = 'none'
  form.method = 'POST'
  form.action = 'https://codepen.io/pen/define'
  form.target = '_blank'

  // 准备提交到 Codepen 的数据
  const data = {
    html: formatCode(props.html),
    css: formatCode(props.css),
    js: '',
    html_pre_processor: 'none',
    css_pre_processor: 'none',
    js_pre_processor: 'none',
    editors: '110'
  }

  // 创建包含数据的 input
  const input = document.createElement('input')
  input.type = 'hidden'
  input.name = 'data'
  input.value = JSON.stringify(data)
  
  // 将 input 添加到表单中
  form.appendChild(input)
  
  // 将表单添加到文档中并提交
  document.body.appendChild(form)
  form.submit()
  
  // 清理表单
  document.body.removeChild(form)
}
</script>

<style scoped>
.code-demo {
  margin: 1rem 0;
  border-radius: 8px;
  border: 1px solid #eaecef;
}

.shadom-dom {
  padding: 1rem;
  border-bottom: 1px solid #eaecef;
}

.code-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 2rem;
  padding: 0 1rem;
  border-bottom: 1px solid #eaecef;
}

.bi {
  cursor: pointer;

  &:hover {
    color: #0366d6;
  }
}

.source-code {
  padding: 1rem;
  background-color: #f6f8fa;

  pre {
    margin: 0;
    padding: 0;
    background-color: transparent;
  }

  code {
    display: block;
    padding: 0;
    white-space: pre;
    font-family: Consolas, Monaco, 'Andale Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
  }
}
</style>
