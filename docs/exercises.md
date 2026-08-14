# 练习建议

TypeScript 学习的难点不是语法本身，而是读懂类型错误并理解类型系统的行为。以下是按章节组织的练习建议：

## 基础类型（第四章）
1. 写一个函数，接收 `string | number`，安全地将其转为字符串返回
2. 定义一个 `User` 类型，其中 `email` 可选，写一个函数安全地打印用户信息
3. 用字面量类型定义一个 `Direction` 类型，限定为 `"up" | "down" | "left" | "right"`

## 函数（第五章）
1. 写一个泛型函数 `firstElement<T>`，返回数组的第一个元素（可能为 `undefined`）
2. 用函数重载实现：传入 `string` 返回 `string`，传入 `number[]` 返回 `number`
3. 写一个接受回调的函数，体会上下文类型推断

## 类型收窄（第七章）
1. 用 `typeof` 和 `in` 收窄联合类型
2. 定义一个可辨识联合 `Shape`，用 `switch` 实现 `area` 函数
3. 用穷尽性检查确保处理了所有分支

## 常见报错及解决
| 报错信息 | 含义 | 解决方法 |
|---------|------|---------|
| `Type 'undefined' is not assignable to type 'X'` | 值可能是 `undefined` | 添加 `if (x !== undefined)` 检查 |
| `Object is possibly 'undefined'` | 对象属性可能不存在 | 用可选链 `?.` 或先检查 |
| `Property 'X' does not exist on type 'Y'` | 访问不存在的属性 | 检查拼写，或用类型守卫收窄 |
| `Argument of type 'X' is not assignable to parameter of type 'Y'` | 参数类型不匹配 | 检查函数签名，或用类型断言 |
| `No overload matches this call` | 函数重载都不匹配 | 检查参数类型和数量 |
| `Unused '@ts-expect-error' directive.`（TS2578） | `@ts-expect-error` 下一行其实没有错误 | 删除该指令；确认你要抑制的错误确实存在 |
| `tsconfig.json is present but will not be loaded...`（TS5112） | 目录有 `tsconfig.json` 却在命令行指定了文件 | 去掉命令行文件参数（改用 `tsc`），或加 `--ignoreConfig` |

---
