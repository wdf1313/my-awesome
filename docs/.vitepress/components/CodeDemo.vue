<template>
  <div class="code-demo">
    <!-- 展示代码的执行效果 -->
    <div class="shadom-dom" ref="shadowDom"></div>

    <!-- 操作按钮 -->
    <div class="code-actions">
      <i class="bi bi-code" @click="toggleSourceCode" />
    </div>

    <!-- 展示源代码 -->
    <transition name="expand">
      <div v-if="showSourceCode" class="source-code">
        <pre>
          <code>{{ formattedCode }}</code>
        </pre>
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

const shadowDom = ref(null) // shadom Dom 实例
const showSourceCode = ref(false) // 是否显示源代码

// 格式化显示代码
const formattedCode = computed(() => {
  return `${props.html}\n\n<style>${props.css}</style>`
})

// 创建 shadowHost DOM 并注入 HTML 和 CSS
onMounted(() => {
  if (shadowDom.value) {
    const shadowRoot = shadowDom.value.attachShadow({ mode: "open" })
    shadowRoot.innerHTML = `
      ${props.html}
      <style>${props.css}</style>
    `
  }
})

const toggleSourceCode = () => {
  showSourceCode.value = !showSourceCode.value
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
  justify-content: flex-end;
  height: 2rem;
  padding: 0 1rem;
  border-bottom: 1px solid #eaecef;
}

.bi {
  cursor: pointer;
  font-size: 1.25rem;

  &:hover {
    color: #0366d6;
  }
}

.source-code {
  & > code {
    width: 100%;
  }
}
</style>
