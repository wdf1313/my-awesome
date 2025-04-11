# CSS Selector

## 基础选择器

### 元素选择器

选择指定类型的 HTML 元素

<CodeDemo
  html='
    <p>这是一个段落。</p>
    <p>这是另一个段落。</p>
    <div>这是一个 div 元素。</div>
  '
  css='p {
    color: blue;
    font-size: 16px;
  }'
/>

### 类选择器

选择具有特定 `class` 属性的元素

<CodeDemo 
  html='
    <p class="highlight">这是一个高亮的段落。</p>
    <p>这是一个普通段落。</p>
    <div class="highlight">这是一个高亮的 div。</div>
  '
  css='
    .highlight {
      background-color: yellow;
      padding: 10px;
    }
  '
/>

### ID 选择器

选择具有特定 `id` 属性的元素

<CodeDemo 
  html='
    <div id="header">这是页面的标题。</div>
    <p>这是一个普通段落。</p>
    <div>这是一个普通 div。</div>
  '
  css='
    #header {
      font-size: 24px;
      font-weight: bold;
      color: green;
    }
  '
/>

## 组合选择器

### 后代选择器

选择某个元素的后代元素

<CodeDemo 
  html='
    <div>
      <p>这是一个在 div 内的段落。</p>
      <p>这是另一个在 div 内的段落。</p>
    </div>
    <p>这是一个不在 div 内的段落。</p>
  '
  css='
    div p {
      color: blue;
    }
  '
/>

### 子元素选择器

选择某个元素的直接子元素

<CodeDemo 
  html='
    <ul>
      <li>列表项 1</li>
      <li>列表项 2</li>
      <ol>
        <li>嵌套列表项 1</li>
        <li>嵌套列表项 2</li>
      </ol>
    </ul>
  '
  css='
    ul > li {
      color: green;
    }
  '
/>

### 相邻兄弟选择器

选择紧接在某个元素后的兄弟元素

<CodeDemo 
  html='
    <h1>这是一个标题</h1>
    <p>这是紧接在标题后的段落。</p>
    <p>这是另一个段落。</p>
  '
  css='
    h1 + p {
      color: red;
    }
  '
/>

### 通用兄弟选择器

选择某个元素后的所有兄弟元素

<CodeDemo
  html='
    <h1>这是一个标题</h1>
    <p>这是标题后的第一个段落。</p>
    <p>这是标题后的第二个段落。</p>
    <div>这是一个 div 元素。</div>
    <p>这是标题后的第三个段落。</p>
  '
  css='
    h1 ~ p {
      color: purple;
    }
  '
/>

## 属性选择器

### 属性选择器

选择具有指定属性的元素

<CodeDemo
  html='
    <p title="paragraph">这是一个带有 title 属性的段落。</p>
    <p>这是一个普通段落。</p>
    <a href="#" title="link">这是一个带有 title 属性的链接。</a>
  '
  css='
    [title] {
      color: blue;
    }
  '
/>

### 属性值选择器

选择具有指定属性且属性值完全匹配的元素

<CodeDemo 
  html='
    <input type="text" placeholder="输入文本">
    <input type="submit" value="提交">
    <input type="button" value="按钮">
  '
  css='
    input[type="submit"] {
      background-color: green;
      color: white;
    }
  '
/>

### 属性值前缀选择器

选择属性值以指定字符串开头的元素

<CodeDemo 
  html='
    <a href="https://example.com">这是一个 HTTPS 链接。</a>
    <a href="http://example.com">这是一个 HTTP 链接。</a>
    <a href="/about">这是一个相对链接。</a>
  '
  css='
    a[href^="https://"] {
      color: red;
    }
  '
/>

### 属性值后缀选择器

选择属性值以指定字符串结尾的元素

<CodeDemo 
  html='
    <img src="image1.png" alt="PNG 图片">
    <img src="image2.jpg" alt="JPG 图片">
    <img src="image3.png" alt="另一个 PNG 图片">
  '
  css='
    img[src$=".png"] {
      border: 2px solid blue;
    }
  '
/>

### 属性值包含选择器

选择属性值包含指定字符串的元素

<CodeDemo 
  html='
    <button class="btn-primary">主要按钮</button>
    <button class="btn-secondary">次要按钮</button>
    <button class="submit-btn">提交按钮</button>
    <button class="cancel">取消按钮</button>
  '
  css='
    [class*="btn"] {
      padding: 10px;
      background-color: yellow;
    }
  '
/>

## 伪类选择器

### `:hover` 伪类

选择鼠标悬停时的元素

<CodeDemo 
  html='
    <button>悬停我</button>
  '
  css='
    button:hover {
      background-color: yellow;
    }
  '
/>

### `:focus` 伪类

选择获得焦点的元素（如表单输入框）

<CodeDemo 
  html='
    <input type="text" placeholder="点击我" />
  '
  css='
    /* 输入框获得焦点时改变边框颜色 */
    input:focus {
      border: 2px solid blue;
    }
  '
/>

### `:active` 伪类

选择被激活（例如鼠标点击）的元素

<CodeDemo 
  html='
    <button>点击我</button>
  '
  css='
    /* 点击按钮时改变背景色 */
    button:active {
      background-color: red;
    }
  '
/>

### `:first-child`、`:last-child` 伪类

选择第一个和最后一个子元素

<CodeDemo 
  html='
    <ul>
      <li>第一个列表项</li>
      <li>第二个列表项</li>
      <li>第三个列表项</li>
    </ul>
  '
  css='
    /* 选择第一个 <li> 元素 */
    li:first-child {
      color: green;
    }
    li:last-child {
      color: purple;
    }
  '
/>

### `:nth-child()` 伪类

选择父元素的第 n 个子元素

<CodeDemo 
  html='
    <ul>
      <li>第一个列表项</li>
      <li>第二个列表项</li>
      <li>第三个列表项</li>
      <li>第四个列表项</li>
    </ul>
  '
  css='
    /* 选择第二个 <li> 元素 */
    li:nth-child(2) {
      color: orange;
    }
    /* 选择所有偶数位置的 <li> 元素 */
    li:nth-child(even) {
      background-color: #f0f0f0;
    }
  '
/>


### `:not()` 伪类

选择不符合指定条件的元素

<CodeDemo 
  html='
    <p>这是一个段落。</p>
    <div>这是一个 div。</div>
    <span>这是一个 span。</span>
  '
  css='
    /* 选择所有不是 <p> 的元素 */
    :not(p) {
      font-weight: bold;
    }
  '
/>

### `:nth-of-type()` 伪类

选择父元素中特定类型的第 n 个子元素

<CodeDemo 
  html='
    <p>第一个段落。</p>
    <div>这是一个 div。</div>
    <p>第二个段落。</p>
    <p>第三个段落。</p>
  '
  css='
    /* 选择第二个 <p> 元素 */
    p:nth-of-type(2) {
      color: red;
    }
  '
/>

### :checked 伪类

选择被选中的表单元素（如复选框或单选按钮）

<CodeDemo 
  html='
    <input type="checkbox" id="check">
    <label for="check">选中我</label>
  '
  css='
    /* 选中复选框时改变标签颜色 */
    input:checked + label {
      color: green;
    }
  '
/>

## 伪元素选择器

### `::before`、`::after` 伪元素

在元素内容的前面、后面插入内容

<CodeDemo 
  html='
    <p>这是一个段落。</p>
    <p>这是另一个段落。</p>
  '
  css='
    /* 在 <p> 元素内容前插入一个图标 */
    p::before {
      content: "🌟";
      margin-right: 5px;
    }
    /* 在 <p> 元素内容后插入一个图标 */
    p::after {
      content: "✅";
      margin-left: 5px;
    }
  '
/>

### `::first-line`、`::first-letter` 伪元素

选择元素第一行文本

<CodeDemo 
  html='
    <p>这是一个段落。这段文字的第一行会被加粗并变为蓝色。</p>
    <p>这是另一个段落。它的第一行也会被加粗并变为蓝色。</p>
  '
  css='
    /* 选择 <p> 元素的第一行文本 */
    p::first-line {
      font-weight: bold;
      color: blue;
    }
    /* 选择 <p> 元素的第一个字母 */
    p::first-letter {
      font-size: 24px;
      color: red;
      font-weight: bold;
    }
  '
/>

### `::selection` 伪元素

选择用户选中的文本部分

<CodeDemo 
  html='
    <p>尝试选中这段文本。</p>
    <p>再试试选中这段文本。</p>
  '
  css='
    /* 设置用户选中文本的样式 */
    ::selection {
      background-color: yellow;
      color: red;
    }
  '
/>

### `::placeholder` 伪元素

选择输入框的占位符文本

<CodeDemo 
  html='
    <input type="text" placeholder="请输入内容">
  '
  css='
    /* 设置输入框占位符的样式 */
    input::placeholder {
      color: gray;
      font-style: italic;
    }
  '
/>