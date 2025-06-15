## 交叉类型
T & U
## 联合类型
T｜ U
## 类型别名
type some=boolean|string
## 类型索引
``` typescript
intetface Button{
    type :string
    text: string
}

type buttonKeys=keyof Button//"type"|text
```
## 类型约束
``` typescript
intetface Button=string |number|boolen

type buttonKeys=keyof Button//"type"|text
```

## 类型映射