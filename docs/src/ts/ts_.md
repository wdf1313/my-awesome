##  ts 中 any,never,unknown,null & underfined 和void的区别

- any :动态类型变量，失去类型检查的作用
- never 永远不存在的值的类型
- unknown 任意类型的值可以赋给 unknown 但unknown智能给 unknown ,any
- null & undefined 只能复制给 void 或者他们自己。

## ts中的type 和 interface 的区别

相同点:
- 都可以描述为对象和函数
- 都允许拓展
不同点：
- type 可以声明基本类型 联合类型 元组
- type 可以使用 typeof 获取实例类型进行赋值
- 多个相同的interfact可以自动合并

## 简述工具类型 Exclude,Omit,Merge,Intersetion ,OverWrite的作用
 
 - Exclude<T,U>从T中排出可分配给U的元素
 - Omit<T,K>忽略T中某些元素
 - Merge<o1,o2>将两个对象属性合并
 - Overwrite<T,U>用U中属性覆盖T中属性

 ## 范型概念
  发型是参数化类型技术，允许在定义函数，借口或者类不预先制定具体类型，而在使用时在制定

