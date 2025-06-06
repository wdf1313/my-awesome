# Vue2.x 注意事项

## 不推荐在同一个元素上同时使用 v-for 和 v-if

主要原因：**执行优先级问题**

`v-for` 的优先级高于 `v-if`，意味着 Vue 会优先遍历数组/对象生成所有元素，然后对每个元素判断 `v-if` 是否为真，决定是否渲染。

这会导致本可以被过滤掉的数据也会被遍历和实例化，造成性能浪费。

推荐做法：如果需要条件渲染，先过滤数据，再用 `v-for` 渲染

```vue
<!-- 错误用法（不推荐） -->
<li v-for="item in items" v-if="item.isActive">{{ item.name }}</li>

<!-- 推荐用法 -->
<li v-for="item in activeItems">{{ item.name }}</li>

<script>
export default {
  computed: {
    activeItems() {
      return this.items.filter((item) => item.isActive)
    },
  },
}
</script>
```
