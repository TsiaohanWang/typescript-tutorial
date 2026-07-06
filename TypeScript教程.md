# TypeScript 系统教程：从编程基础到工程实践

> 适用读者：有编程基础（Python/Java/C++等），但未学过 JavaScript 的学生
> 参考来源：https://www.typescriptlang.org/docs/
> 本教程基于 TypeScript 5.x 编写。TypeScript 6.0 于 2026 年发布，部分编译选项默认值发生了变化（如 `strict` 默认为 `true`、`target` 默认为 `es2025`），但核心语法和类型系统保持不变。详见附录 A。

---

## 第一章：开篇 —— 什么是 TypeScript

### 1.1 JavaScript 的困局

JavaScript 诞生于 1995 年，最初只是网页的小脚本语言。20 多年后，它已成长为前后端通吃的全平台语言。然而，JS 有一个先天问题：**动态类型**。

看这段代码：

```javascript
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}
greet("Brendan"); // 忘了传 date 参数
```

这段代码运行后，输出的是 `Hello Brendan, today is undefined!` —— 没有报错，只是结果不对。更糟糕的：

```javascript
const message = "Hello!";
message(); // TypeError: message is not a function
```

这类错误只在**运行时**才能发现。如果测试覆盖不全，就带着 bug 上线了。

### 1.2 TypeScript 的解决思路

TypeScript 是微软开发的**静态类型检查器**，它在代码**运行之前**（静态阶段）检查类型是否正确。

```typescript
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
// @ts-expect-error —— Date() 返回的是 string，不是 Date 对象
greet("Maddison", Date());
// 编译时报错：Argument of type 'string' is not assignable to parameter of type 'Date'
```

**关键理解**：TypeScript 不是另一门语言，它是 JavaScript 的**超集**——几乎所有的 JS 代码都是合法的 TS 代码。TS 只是在 JS 之上增加了一层**类型系统**。极少数 JS 语法（如 `with` 语句）在 TS 中被禁止，因为它们在严格模式下本身就不合法或无法进行类型检查。

### 1.3 类型 vs. 其他语言的对比

如果你学过 Java/C#：

| 概念 | Java/C# | TypeScript |
|------|---------|------------|
| 类型系统 | 名义类型（Nominal） | **结构类型**（Structural） |
| 运行时类型信息 | 存在（reified） | **编译时擦除**（erased） |
| 类型定义位置 | `int x = 0`（类型在左） | `let x: number = 0`（类型在右） |

**结构类型**意味着：只要两个对象有同样的属性结构，它们就是兼容的，不需要显式的继承或接口实现。

```typescript
interface Point { x: number; y: number; }
interface Named { name: string; }

const obj = { x: 0, y: 0, name: "Origin" };
// obj 同时满足 Point 和 Named —— 不需要任何 extends 声明
```

如果你学过 Python：

| 概念 | Python | TypeScript |
|------|--------|------------|
| 类型检查 | 外部工具静态检查（mypy/pyright）+ 运行时 duck typing | 编译时（structural typing） |
| 类型注解 | `def greet(name: str) -> None:` | `function greet(name: string): void` |
| 可选 | 3.5+ 通过 typing 模块 | 语言原生支持 |

### 1.4 核心原则

1. **类型注解不改变运行时行为** —— 编译后所有类型信息被擦除，只剩纯 JS
2. **类型是可选的** —— 你可以渐进式地给 JS 代码加类型
3. **不阻挡你** —— 即使有类型错误，TS 默认仍然生成 JS 文件

---

## 第二章：环境搭建 + 你的第一个 TS 程序

### 2.1 安装

前提条件：安装 [Node.js](https://nodejs.org/)（包含 npm 包管理器）。

```bash
# 创建项目目录并初始化
mkdir my-ts-project && cd my-ts-project
npm init -y

# 在当前项目中安装 TypeScript 编译器（-D 表示开发依赖）
npm install -D typescript

# 使用当前项目的 TypeScript 编译器
npx tsc --version
```

> **为什么不用全局安装？** 全局安装（`npm install -g typescript`）会导致不同项目可能使用不同版本的 TS 编译器，造成"在我电脑上能跑"的问题。项目本地安装确保团队成员和 CI 环境使用同一版本。

### 2.2 第一个程序

创建一个文件 `hello.ts`：

```typescript
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

编译：

```bash
npx tsc hello.ts
```

运行后在同一目录下生成 `hello.js`。查看内容，你会发现类型注解被擦除了：

```javascript
function greet(person, date) {
  console.log("Hello " + person + ", today is " + date.toDateString() + "!");
}
greet("Maddison", new Date());
```

> **注意**：直接运行 `tsc hello.ts`（没有 tsconfig.json）时，默认编译目标是 ES3/ES5，模板字符串会被转换为字符串拼接。如果想保留模板字符串，需要指定目标版本：
>
> ```bash
> npx tsc --target ES2015 hello.ts
> ```
>
> 后续章节会介绍 `tsconfig.json`，届时只需运行 `npx tsc` 即可按项目配置编译。

TypeScript 的编译流程：

```text
.ts 源码
  ↓ tsc 编译（类型检查 + 语法转换）
.js 输出（类型信息被擦除）
  ↓ Node.js / 浏览器运行
运行结果
```

> TS 负责检查类型和生成 JS；Node.js 或浏览器负责真正运行 JS。这就是为什么 TS 的类型在运行时"消失"了。

用 Node 运行：

```bash
node hello.js
# 输出：Hello Maddison, today is <当前日期>!
```

### 2.3 编译选项

```bash
# 严格模式（生产环境推荐）
tsc --strict hello.ts

# 指定目标 JS 版本
tsc --target es2015 hello.ts

# 有错时不生成 JS 文件
tsc --noEmitOnError hello.ts
```

### 2.4 tsconfig.json —— 项目级配置

```bash
tsc --init
```

这会生成一个 `tsconfig.json`，包含所有编译选项。之后只需运行 `tsc` 即可。

推荐的最小配置：

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### 2.5 VSCode 编辑器支持

VSCode 内置 TypeScript 支持，安装后即可获得：
- 类型错误实时提示（红色波浪线）
- 自动补全
- 悬停查看类型
- 重构、跳转定义

> **新手提示**：入门阶段可以先用 TypeScript Playground（https://www.typescriptlang.org/play/）在线练习，无需安装。

---

## 第三章：快速 JS 补课

> 对已有编程基础的同学，这里只讲 JS 独特的地方，不讲什么是变量/循环/函数。

### 前置知识：JS 特有的概念

在开始之前，先了解几个 JS 特有的概念，它们在其他语言中不太常见：

**Hoisting（变量提升）**：JS 引擎在执行代码前，会先把 `var` 和 `function` 声明"提升"到作用域顶部。这意味着你可以在声明之前使用它们（值为 `undefined`）。`let` 和 `const` 也会进入作用域，但在声明语句执行前处于**暂时性死区**（TDZ），不能像 `var` 那样在声明前读到 `undefined`。

```javascript
// 以下是 JavaScript 行为示例（不是 TS 推荐写法）
console.log(a);  // undefined（var 被提升了，但值是 undefined）
var a = 1;

console.log(b);  // ReferenceError: Cannot access 'b' before initialization
let b = 2;       // let/const 有 TDZ，声明前访问会报错
```

**闭包（Closure）**：函数可以"记住"它被创建时的词法环境。即使外部函数已经返回，内部函数仍然可以访问外部函数的变量。

```typescript
function makeCounter() {
  let count = 0;  // 这个变量被闭包"捕获"
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}
const counter = makeCounter();
counter.increment();  // 1
counter.increment();  // 2
counter.getCount();   // 2 —— count 变量仍然存在
```

**原型链（Prototype Chain）**：JS 对象通过原型（prototype）实现继承，而不是像 Java/C++ 那样的类继承。每个对象都有一个内部链接指向另一个对象（它的原型），形成一条链。访问属性时沿链向上查找，直到找到或到达 `null`。ES6 的 `class` 语法只是原型链的语法糖。

**事件循环（Event Loop）**：JS 是单线程的，但通过事件循环实现异步。代码从调用栈（Call Stack）执行，异步操作（如网络请求、定时器）由浏览器/Node 的宿主环境处理，完成后将回调放入任务队列，等调用栈清空后再执行。

### 3.1 变量声明：`let` 和 `const`

```typescript
let x = 10;    // 可变变量（对应其他语言的 var）
const y = 20;  // 不可变变量（对应 final/const）
```

- `let` 是块级作用域（block-scoped），类似于其他语言的局部变量
- `const` 也是块级作用域，且声明后不能重新赋值
- **不要使用 `var`**（它是函数级作用域，有 hoisting 问题，现代 JS 不推荐使用）

> ⚠️ **`const` 不等于"深度不可变"**：`const` 只保证变量不能重新赋值，但对象/数组的内容仍然可以修改：
>
> ```typescript
> const user = { name: "Alice" };
> user.name = "Bob";  // OK——修改对象属性
> // user = { name: "Tom" };  // Error——不能重新赋值
> ```
>
> 如果需要深度不可变，可以用 `as const`（见第四章）或 Object.freeze()。

对比其他语言：

```typescript
// Java: int x = 10;
// Python: x = 10
// TS: let x: number = 10; （或简写为 let x = 10;，类型会自动推导）
```

### 3.2 基本类型

```typescript
{
  const name: string = "Alice";
  const age: number = 25;       // 没有 int/float 之分，都是 number
  const isOk: boolean = true;   // 小写！不是 Boolean
  const nothing: null = null;
  const notDefined: undefined = undefined;
}
```

> ❗ **重要**：类型名是小写 `string`、`number`、`boolean`，不是 `String`、`Number`、`Boolean`。大写版本是特殊的内置类型，几乎用不到。

### 3.3 模板字符串（Template Literals）

用反引号代替引号，`${}` 嵌入表达式：

```typescript
{
  const name = "World";
  const greeting = `Hello ${name}, 2 + 3 = ${2 + 3}!`;
  console.log(greeting); // Hello World, 2 + 3 = 5!
}
```

对比 Python: `f"Hello {name}"`
对比 Java: `"Hello " + name`

### 3.4 箭头函数

```typescript
// 传统函数
function add(a: number, b: number): number {
  return a + b;
}

// 箭头函数（相当于 lambda）
const addArrow = (a: number, b: number): number => a + b;

// 多行的箭头函数需要花括号 + return
const addArrowMulti = (a: number, b: number): number => {
  const result = a + b;
  return result;
};

// 只有一个参数时可以省略括号（但标注类型时仍需括号）
const double = (n: number): number => n * 2;
// 无类型注解时：
// const double = n => n * 2;
```

对比 Python: `lambda a, b: a + b`
对比 Java: `(a, b) -> a + b`

### 3.5 严格相等 `===`

JS 中有 `==` 和 `===` 两种相等运算符：

```typescript
// TypeScript 会阻止不同类型间的直接比较（因为这种比较通常是逻辑错误）：
// @ts-expect-error —— TS 不允许 number 和 string 直接比较
5 == "5";   // JS 运行结果: true  （隐式类型转换后比较）
// @ts-expect-error —— TS 不允许 number 和 string 直接比较
5 === "5";  // JS 运行结果: false （类型不同直接返回 false）
```

**始终使用 `===` 和 `!==`**，除非你明确知道自己在做什么。

### 3.6 对象字面量

```typescript
const user = {
  name: "Alice",
  age: 25,
  greet() {        // 简写方法（相当于 greet: function() { ... }）
    console.log(`Hi, I'm ${this.name}`);
  }
};

// 访问属性
console.log(user.name);   // Alice
console.log(user["name"]); // 也可以用字符串键访问
```

对比 Java: 需要先定义 class，再 new 实例
对比 Python: dict 类似但属性访问用 `[]`

### 3.7 数组

```typescript
const nums: number[] = [1, 2, 3];
// 或 const nums: Array<number> = [1, 2, 3];

// 常用方法
nums.push(4);                    // 末尾添加
nums.pop();                      // 末尾删除
nums.forEach((n) => console.log(n)); // 遍历
const doubled = nums.map((n) => n * 2); // 映射（返回新数组）
const evens = nums.filter((n) => n % 2 === 0); // 过滤
```

### 3.8 解构赋值

```typescript
// 对象解构
{
  const user = { name: "Alice", age: 25 };
  const { name, age } = user;      // 提取为同名的局部变量
  console.log(name, age);
}

// 数组解构
{
  const [first, second] = [10, 20, 30];
  console.log(first, second);      // 10 20
}

// 函数参数解构
{
  function greet({ name, age }: { name: string; age: number }) {
    console.log(`${name} is ${age} years old`);
  }
}
```

---

## 第四章：基础类型系统

### 4.1 类型注解语法

TypeScript 中类型写在**变量/参数名后面**，用冒号分隔：

```typescript
// 变量注解
{
  let name: string = "Alice";
}

// 函数参数注解+返回值注解
function greet(name: string): void {
  console.log(`Hello, ${name}`);
}

function add(a: number, b: number): number {
  return a + b;
}
```

> **与其他语言对比**：
> - Java: `String name = "Alice";`（类型在左边）
> - Python: `name: str = "Alice"`（类型在右边，但不强制检查）
> - TS: `let name: string = "Alice"`（类型在右边，且强制检查）

### 4.2 原始类型

```typescript
const str: string = "hello";     // 字符串
const num: number = 42;          // 数字（包括整数和浮点数）
const bool: boolean = true;      // 布尔值
const big: bigint = 100n;        // 大整数（ES2020+）
const sym: symbol = Symbol("key"); // 唯一标识符
```

---

### 4.3 `object` 类型

`object` 表示任何**非原始值**（不是 `string`/`number`/`boolean`/`bigint`/`symbol`/`null`/`undefined` 的值）：

```typescript
const obj: object = { key: "value" };
const arr: object = [1, 2, 3];
// const prim: object = 42;  // Error
```

> ❗ 注意是 `object`（小写），不是 `Object`（大写）。`Object` 是 JS 内置构造函数类型，包含所有能调用 `toString()` 等的值，约束更宽松，实际编码中几乎不该使用。

### 4.4 数组

```typescript
// 两种等价写法
const arr1: number[] = [1, 2, 3];
const arr2: Array<number> = [1, 2, 3];

// 多维数组
const matrix: number[][] = [[1, 2], [3, 4]];
```

### 4.5 联合类型（Union Types）

联合类型用 `|` 表示一个值可以是几种类型之一。实际编程中，一个值往往不只有一种可能——用户 ID 可能是数字（数据库自增）也可能是字符串（UUID），函数参数可能接受数组或单个值。联合类型让你精确描述这种"多选一"的场景：

```typescript
// id 可以是 string 或 number
function printId(id: number | string) {
  console.log(`Your ID is: ${id}`);
}

printId(101);     // OK
printId("202");   // OK
// printId({ id: 123 });  // Error: { id: number } 不在联合类型中
```

有了联合类型，TS 只允许**所有成员共有**的操作。如果你想在某个分支中使用特定类型的方法，需要用条件语句将类型收窄到具体成员——这就是**类型收窄**（Narrowing），将在第七章详细讲解：

```typescript
function printId(id: number | string) {
  // id.toUpperCase();  // Error: number 没有 toUpperCase 方法
  // 需要用条件语句收窄类型后才能使用特定操作
  if (typeof id === "string") {
    console.log(id.toUpperCase());  // OK：这里 id 已被收窄为 string
  } else {
    console.log(id);                // OK：这里 id 已被收窄为 number
  }
}
```

> **与其他语言对比**：Python 用 `Union[int, str]`（需从 `typing` 模块导入），Java/C++ 不直接支持、通常用接口+多态实现类似效果，而 TS 的 `number | string` 语法简洁且原生支持。

### 4.6 类型别名（Type Aliases）

当同一个类型在多处使用时，直接写完整类型既冗长又容易出错。`type` 关键字允许你给任意类型起一个名字，之后用这个名字来引用——一处定义、多处引用，修改时也只需改一个地方：

```typescript
// 命名联合类型——避免重复写 number | string
type ID = number | string;

// 命名对象类型——描述一个坐标点的形状
type Point = {
  x: number;
  y: number;
};

// 命名函数类型——统一事件处理函数的签名
type Handler = (event: string) => void;

// 使用别名让函数签名更清晰
function printCoord(pt: Point) {
  console.log(pt.x, pt.y);
}

// 注意：别名只是"外号"，不是新类型
let myId: ID = 42;     // OK
myId = "abc";          // 也 OK——ID 就是 number | string
```

> **与 `interface` 的区别**：`type` 可以为任何类型起名（联合类型、原始类型、函数类型等），而 `interface` 只能描述对象类型。详见第六章。

### 4.7 `any` —— 逃生舱

`any` 是 TypeScript 中最宽松的类型——它可以赋值为任何类型，也可以调用任何方法、访问任何属性，编译器不会报错。当你从纯 JS 迁移到 TS，或者使用没有类型定义的第三方库时，`any` 让你不必一次性给所有代码加类型，是一条渐进式引入类型的"逃生通道"。但另一方面，`any` 等于关闭了该值的所有类型检查，拼写错误、参数遗漏、类型不匹配等问题都不会被发现，和写纯 JS 没有区别：

```typescript
let value: any = 42;
value = "hello";     // OK：any 可以赋值为任何类型
value.toUpperCase(); // 不会报错——但运行时如果 value 是数字就会崩溃
value.foo.bar.baz;   // 也不会报错——完全放弃了检查
```

使用 `noImplicitAny` 编译选项可以阻止**隐式**的 `any`（即没写类型注解且 TS 推断不出时默认为 `any` 的情况）：

```json
// tsconfig.json
{
  "compilerOptions": {
    "noImplicitAny": true
  }
}
```

> **建议**：新项目始终开启 `noImplicitAny`。如果实在不知道某个值的类型，优先用 `unknown` 而不是 `any`。

### 4.8 `unknown` —— 安全的 any

`unknown` 和 `any` 一样可以接收任何类型的值，但关键区别在于——你**不能直接使用** `unknown` 类型的值，必须先用类型守卫（如 `typeof` 检查）收窄类型后才能操作它。这让 `unknown` 成为 `any` 的安全替代品：允许接收任意值，但强制你在使用前先确认类型：

```typescript
let value: unknown = 42;
value = "hello";

// value.toUpperCase();  // Error: 不能直接使用 unknown

// 必须先收窄类型
if (typeof value === "string") {
  console.log(value.toUpperCase()); // OK：此时 value 已被确认为 string
}
```

**`any` vs `unknown` 对比**：

| 特性 | `any` | `unknown` |
|------|-------|-----------|
| 可以赋值为任何类型 | ✓ | ✓ |
| 可以直接调用方法 | ✓（不检查） | ✗（必须先收窄） |
| 类型安全性 | 无 | 有 |

### 4.9 `void`、`never` 和 `undefined`

这三个类型都与"没有值"有关，但使用场景截然不同。

**`void` —— 函数不返回值**

`void` 表示函数的返回值不会被使用。大多数不写 `return` 的函数，返回类型都可以标注为 `void`。它和 `undefined` 的区别在于：`void` 是告诉调用者"不要使用返回值"，而 `undefined` 是一个具体的值。

```typescript
// void 表示这个函数的返回值没有意义
function log(msg: string): void {
  console.log(msg);
}

// 一个常见误区：返回类型为 void 的函数，其实现可以返回 undefined
// 但调用者不应该使用这个返回值
type VoidFn = () => void;
const f: VoidFn = () => true;  // 允许——void 忽略返回值
const result = f();             // result 的类型是 void，不是 boolean
```

**`never` —— 函数永远不会返回**

`never` 表示函数永远不会正常结束。两种典型场景：抛出异常（函数终止）或无限循环（函数永不返回）。和 `void` 的区别：`void` 表示"函数正常结束但没有返回值"，`never` 表示"函数根本不会正常结束"。

```typescript
// 抛出异常——函数在 throw 之后就终止了，不可能有返回值
function throwError(msg: string): never {
  throw new Error(msg);
}

// 无限循环——永远执行下去，不会返回
function infiniteLoop(): never {
  while (true) { }
}
```

`never` 还有一个重要用途：穷尽性检查（Exhaustiveness Checking）。当你处理联合类型的所有分支后，剩余类型应该是 `never`——如果还有未处理的分支，TS 会在编译时报错。详见第七章。

**`undefined` —— 作为类型使用**

`undefined` 既是一个值，也是一个类型。当它作为类型使用时，通常出现在可选参数的场景中——`name?: string` 的实际类型是 `string | undefined`，表示"可能有值，也可能是 undefined"：

```typescript
function printName(name?: string): void {
  // name 的类型是 string | undefined
  // 必须检查后才能安全使用
  if (name !== undefined) {
    console.log(name.toUpperCase());
  }
}
```

### 4.10 字面量类型（Literal Types）

`string`、`number` 这类宽泛类型表示"任意字符串"或"任意数字"。但有时你需要更精确的约束——比如一个参数只能是 `"left"`、`"right"` 或 `"center"` 三个值之一。字面量类型让你用具体的值本身作为类型，组合起来就能限定一个值的可选范围：

```typescript
// 字符串字面量联合——方向只能是这四个值之一
type Direction = "left" | "right" | "up" | "down";

// 数字字面量联合——骰子只能是 1-6
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// boolean 其实就是 true | false 的别名
type IsActive = true | false;
```

实际使用中，最常见的场景是用字面量联合限定函数参数：

```typescript
function setAlignment(align: "left" | "center" | "right") {
  // align 只能是这三个字符串之一
}
setAlignment("left");      // OK
// setAlignment("middle"); // Error: "middle" 不在允许的字面量中
```

**字面量推断**：TS 会把 `const` 声明的变量推断为字面量类型，但对象属性会被**拓宽**为宽泛类型。这是因为 TS 需要同时支持读取和写入——对象属性将来可能被重新赋值为其他值，所以不能假定它永远是某个字面量：

```typescript
const req = { url: "https://example.com", method: "GET" };
// req.method 的类型是 string，不是 "GET"
// 因为 TS 允许后续写 req.method = "POST"，所以不能窄化为字面量

function handleRequest(url: string, method: "GET" | "POST") { }

// @ts-expect-error
handleRequest(req.url, req.method);
// Error: string 不能赋值给 "GET" | "POST"
```

解决方法是用 `as const` 断言。`as const` 告诉 TS"这个对象的所有属性都是只读的，类型就是字面量本身"，从而阻止拓宽：

```typescript
const req2 = { url: "https://example.com", method: "GET" } as const;
// req2.method 的类型是 "GET"（字面量类型），不再是 string
// req2 整体也是只读的，不能修改任何属性
handleRequest(req2.url, req2.method);  // OK
```

### 4.11 `as const` —— 断言字面量类型

上一节的字面量推断问题揭示了一个普遍需求：你经常需要让一个对象的所有属性都被推断为字面量类型，而不是被拓宽为宽泛类型。`as const` 就是为此而生的。

**`as const` 做了两件事**：

1. **阻止类型拓宽**：把每个属性的类型锁定为字面量本身，而不是 `string`、`number` 这样的宽泛类型
2. **标记为只读**：整个对象（包括嵌套对象和数组）的所有属性都变为 `readonly`，不能修改

```typescript
// 没有 as const——属性被拓宽为宽泛类型
const obj1 = { x: 10, y: "hello" };
// obj1 的类型是 { x: number; y: string }

// 有 as const——属性被锁定为字面量类型
const obj2 = { x: 10, y: "hello" } as const;
// obj2 的类型是 { readonly x: 10; readonly y: "hello" }
// obj2.x = 20;  // Error: 只读属性不能修改
```

**数组也会被锁定**：

```typescript
const arr1 = [1, 2, 3];
// arr1 的类型是 number[]——可以 push、pop、修改元素

const arr2 = [1, 2, 3] as const;
// arr2 的类型是 readonly [1, 2, 3]——固定长度、固定类型、不可修改
// arr2.push(4);  // Error: readonly 数组没有 push 方法
// arr2[0] = 99;  // Error: 不能修改只读元素
```

**嵌套对象也会递归锁定**：

```typescript
const config = {
  api: { url: "https://example.com", timeout: 5000 },
  debug: true,
} as const;
// config.api.url 的类型是 "https://example.com"（字面量），不是 string
// config.api 和 config 本身都是 readonly
```

**常见用法**：

```typescript
// 1. 限定函数参数为固定值集合（配合枚举替代方案）
const Direction = { Up: 0, Down: 1, Left: 2, Right: 3 } as const;
type Direction = (typeof Direction)[keyof typeof Direction];
// Direction 的类型是 0 | 1 | 2 | 3

// 2. 创建不可变的配置对象
const defaultConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
} as const;
// defaultConfig.apiUrl 的类型是 "https://api.example.com"，不是 string

// 3. 让元组类型更精确
const pair = ["hello", 42] as const;
// pair 的类型是 ["hello", 42]——固定长度、固定位置类型
// pair[0].toUpperCase();  // OK：TS 知道 pair[0] 是 "hello"
```

> **`as const` vs `readonly`**：`readonly` 只标记属性为只读，不阻止类型拓宽（`readonly x: number`）。`as const` 既标记为只读，又锁定为字面量类型（`readonly x: 10`）。`as const` 是 `readonly` 的"完全体"。

### 4.12 `enum` —— 枚举类型

当一个变量只能取几个固定的值时，用字符串字面量（如 `"up"` / `"down"`）容易拼错，也缺乏自动补全。枚举（`enum`）为这组固定的值提供有意义的名字。与大多数 TS 特性不同，`enum` 不是纯类型层面的——编译后会生成真实的 JS 对象，因此有运行时开销：

```typescript
// 数字枚举：成员自动从 0 开始编号
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right,   // 3
}

// 也可以手动指定起始值
enum StatusCode {
  OK = 200,
  NotFound = 404,
  InternalError = 500,
}

// 字符串枚举：每个成员必须显式赋值为字符串
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

// 使用枚举值
function move(direction: Direction) {
  console.log(Direction[direction]); // 反向映射：0 → "Up"（仅数字枚举支持）
}
move(Direction.Up);  // 输出 "Up"
```

> ⚠️ **反向映射**（`Direction[direction]`）仅对数字枚举有效。字符串枚举**不会**生成反向映射。反向映射是数字枚举特有的运行时行为——编译后生成的对象同时支持 `Direction.Up → 0` 和 `Direction[0] → "Up"` 两种查找。

**`enum` vs `as const`**：`enum` 会生成真实的 JS 对象，有运行时开销。如果你只需要一组命名常量而不需要反向映射，可以用 `as const` + 联合类型替代，输出更接近原生 JS：

```typescript
// 方式 1：enum（编译后生成额外的 JS 对象和反向映射）
enum EnumDirection {
  Up, Down, Left, Right,
}

// 方式 2：as const（编译后只保留一个普通对象，类型部分被擦除）
const DirectionMap = { Up: 0, Down: 1, Left: 2, Right: 3 } as const;
type DirectionValue = (typeof DirectionMap)[keyof typeof DirectionMap];
// DirectionValue 的类型是 0 | 1 | 2 | 3
```

> 枚举是 TypeScript 特有的功能——它不是纯类型层面的，编译后会生成真实的 JS 对象。官方文档建议"了解它存在，但除非确定需要，否则谨慎使用"。如果你只需要一组命名常量而不需要反向映射，可以用 `as const` 替代。更多细节见：https://www.typescriptlang.org/docs/handbook/enums.html

---

## 第五章：函数类型

### 5.1 参数类型和返回值类型

TypeScript 允许你为函数的每个参数和返回值指定类型。参数类型写在参数名后面，返回值类型写在参数列表的 `)` 后面：

```typescript
// 完整注解：name 是 string，age 是 number，返回 string
function greet(name: string, age: number): string {
  return `Hello, my name is ${name}, I'm ${age}`;
}

// 大多数情况下返回值类型可以省略，TS 会自动推断
function add(a: number, b: number) {
  return a + b;  // 返回类型自动推断为 number
}
```

> **最佳实践**：对于简单的函数，省略返回值类型让代码更简洁；对于公开的 API 或复杂的函数，显式标注返回值类型可以防止意外修改返回值。

### 5.2 可选参数与默认参数

不是每个参数每次调用都必须传。可选参数用 `?` 标记，表示调用时可以省略；默认参数用 `= 值` 指定，省略时自动使用默认值：

```typescript
// 可选参数（用 ?）—— greeting 可传可不传
function greetOptional(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}`;
  // ?? 是"空值合并"运算符：只有左边是 null/undefined 时才用右边的值
}

greetOptional("Alice");           // "Hello, Alice"
greetOptional("Alice", "Hi");     // "Hi, Alice"

// 默认参数——greeting 不传时自动用 "Hello"
function greetDefault(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}`;
}

// 可选参数必须放在必选参数之后
function f(a: string, b?: number, c?: boolean): void { }
// f("hello")        // OK
// f("hello", 42)    // OK
// f("hello", 42, true) // OK
// f(?, "hello")     // Error：必选参数不能在可选参数后面
```

### 5.3 剩余参数

剩余参数（Rest Parameters）用 `...` 语法让函数接收任意数量的参数，这些参数被打包成一个数组。当你不知道调用者会传多少个参数时，剩余参数比定义大量可选参数更灵活：

```typescript
// ...nums 把所有传入的数字收集到 nums 数组中
function sum(...nums: number[]): number {
  return nums.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3);     // 6
sum(10, 20);       // 30
sum();             // 0
```

### 5.4 函数类型表达式

函数类型表达式用 `(参数) => 返回值` 的语法描述一个函数的形状。当你需要把函数作为参数传递（回调函数）或存储在变量中时，就需要这种方式：

```typescript
// 把函数签名声明为类型
type GreetFn = (name: string, age: number) => string;

// 用类型注解约束变量
const greet: GreetFn = (name, age) => {
  return `Hi ${name}, age ${age}`;
  // 参数类型可以从 GreetFn 推断，不必重复写
};

// 也可以直接用在函数参数中
function doSomething(fn: (x: number) => void) {
  fn(42);
}
```

### 5.5 回调函数的参数类型

上下文类型（Contextual Typing）是 TypeScript 的一项特性——当你把一个函数作为参数传递给另一个函数时，TS 会根据目标函数的签名自动推断回调参数的类型。这让你不必在每个回调中重复写类型注解，同时仍能享受类型检查的好处：

```typescript
// 数组的 forEach 方法签名是 (callback: (value: T) => void) => void
// TS 知道数组元素是 string，所以自动推断 name 的类型
const names = ["Alice", "Bob", "Eve"];
names.forEach((name) => {
  console.log(name.toUpperCase()); // name 自动推断为 string——不需要写 (name: string)
});
```

### 5.6 函数重载

函数重载允许一个函数根据不同的参数类型和数量有不同的签名。TypeScript 的重载是**编译时**的——你在函数上方写多个签名声明，下方写一个统一的实现。有些函数根据输入不同，返回值类型也不同，用联合类型无法精确表达，这时就需要重载：

```typescript
// 重载签名（只有声明，没有实现）——定义了两种合法的调用方式
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;

// 实现签名（外部不可见）——处理所有重载分支
function makeDate(arg1: number, arg2?: number, arg3?: number): Date {
  if (arg2 !== undefined && arg3 !== undefined) {
    return new Date(arg1, arg2, arg3);
  }
  return new Date(arg1);
}

makeDate(1234567890);        // OK：匹配第一个重载
makeDate(2024, 6, 30);       // OK：匹配第二个重载
// @ts-expect-error
makeDate(2024, 6);           // Error：没有匹配的重载（1 个或 3 个参数，不能 2 个）
```

> **注意**：实现签名在外部不可见——调用者只能看到上面的重载签名。重载的实现签名必须与所有重载签名兼容。

### 5.7 调用签名（Call Signatures）

在 JavaScript 中，函数也是对象——可以拥有属性。TypeScript 的**调用签名**（Call Signature）允许描述一个既可调用又带有属性的对象：

```typescript
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
```

对比普通的**函数类型表达式**：

```typescript
type SimpleFn = (x: number) => boolean;    // 箭头语法（函数类型表达式）
type WithProp = { (x: number): boolean };   // 对象语法（调用签名）
```

调用签名可以包含额外属性，函数类型表达式不能。

### 5.8 构造签名（Construct Signatures）

有些函数需要和 `new` 一起使用（构造器）。构造签名用 `new` 关键字表示：

```typescript
interface SomeObject {
  name: string;
}

type SomeConstructor = {
  new (s: string): SomeObject;
};

function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```

同时提供普通调用和构造调用：

```typescript
interface CallOrConstruct {
  (n?: number): string;
  new (s: string): Date;
}
```

> **与 Java 对比**：Java 的类既是类型又是构造函数。TS 中函数和构造器需要用不同的签名分别描述。

### 5.9 泛型函数（Generic Functions）

函数可以使用泛型（详见第九章），TS 会自动推断类型参数：

```typescript
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const el = firstElement(["a", "b", "c"]);  // string | undefined
const num = firstElement([1, 2, 3]);       // number | undefined
```

### 5.10 回调函数的参数最佳实践

定义回调类型时，**始终声明所有会被传递的参数**，而不是让它们可选：

```typescript
// ❌ 错误设计——让调用者以为可以少传参数
function myForEachBad(arr: any[], callback: (item: any, index?: number) => void) {
}

// ✅ 正确设计——声明所有会被传递的参数
function myForEachGood(arr: any[], callback: (item: any, index: number) => void) {
}

// 调用时实际传 2 个参数，但 TS 允许省略未使用的参数
myForEachGood([1, 2], (item) => console.log(item));  // OK
```

**原则**：回调签名描述的是**函数会怎么调用**（传递哪些参数），而不是调用者需要多少个参数。

### 5.11 `void` 与 `undefined` 的区别

```typescript
type VoidFn = () => void;

const f: VoidFn = () => true;   // OK——void 返回值会被忽略
const v = f();                   // v 的类型是 void，不是 boolean

// void vs. undefined
function f1(): void { return; }          // OK
function f2(): void { return undefined; }  // OK
function f3(): undefined { return; }       // OK
// @ts-expect-error —— strictNullChecks 下 null 不能赋值给 void
function f4(): void { return null; }       // strictNullChecks 下报错
```

`void` 表示函数的返回值不会被使用（被忽略），`undefined` 表示函数返回 `undefined` 这个具体值。

关键区别：**`() => void` 类型的函数实现可以返回任何值，但该值会被忽略**。这一特性使回调类型的兼容性更宽松：

```typescript
type VoidCb = () => void;

const cb1: VoidCb = () => true;      // ✅ 返回 boolean 也被允许
const cb2: VoidCb = () => "hello";   // ✅ 返回 string 也被允许

// 真正使用时，返回值被忽略
const result = cb1();  // result 的类型是 void，不是 boolean
```

这也是 `[1, 2, 3].forEach(() => true)` 能通过类型检查的原因——`forEach` 期待 `() => void`，而 `() => true` 兼容此类型。

### 5.12 函数重载的编写指南

优先使用**联合类型**而不是重载：

```typescript
// ❌ 不必要的重载——可用联合类型替代
{
  function len(s: string): number;
  function len(arr: any[]): number;
  function len(x: any): number {
    return x.length;
  }
  // @ts-expect-error
  len(Math.random() > 0.5 ? "hello" : [1, 2, 3]);
}

// ✅ 使用联合类型参数
{
  function len(x: string | any[]): number {
    return x.length;
  }
  len(Math.random() > 0.5 ? "hello" : [1, 2, 3]);  // OK
}
```

重载的实现签名在外部不可见：

```typescript
function fn(x: boolean): void;
function fn(x: string): void;
function fn(x: boolean | string) {
  console.log(x);
}

fn(true);   // OK（匹配第一个）
fn("hi");   // OK（匹配第二个）
// @ts-expect-error
fn(42);     // Error——没有匹配的重载
```

### 5.13 剩余参数与展开（Rest / Spread）

```typescript
// 剩余参数
function multiply(n: number, ...m: number[]): number[] {
  return m.map(x => n * x);
}
multiply(3, 1, 2, 3, 4);  // [3, 6, 9, 12]

// 展开（需要 const 断言让类型推断为元组）
const args = [8, 5] as const;
const angle = Math.atan2(...args);  // OK
```

### 5.14 参数解构的类型注解

```typescript
// 解构 + 类型注解
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  return a + b + c;
}

// 用 type 声明类型更清晰
type ABC = { a: number; b: number; c: number };
function sum2({ a, b, c }: ABC) {
  return a + b + c;
}
```

### 5.15 async 函数与 Promise 类型

TypeScript 原生支持 `async/await`，返回值类型用 `Promise<T>` 标注：

```typescript
interface Data {
  [key: string]: unknown;
}

async function fetchData(url: string): Promise<Data> {
  const res = await fetch(url);
  return res.json() as Promise<Data>;
}

// 不写 async 时
function getData(): Promise<string[]> {
  return Promise.resolve(["a", "b"]);
}
```

TypeScript 会根据 `return` 语句自动推断 `Promise` 内部的类型，但官方建议为公开的 async 函数显式标注返回值类型。

### 5.16 声明 `this` 的类型

在回调函数中，可通过第一个参数标注 `this` 的类型（该参数不是真实参数，仅在 TS 中使用）：

```typescript
interface User {
  name: string;
  admin: boolean;
}

interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

function getDB(): DB {
  return {
    filterUsers(filter: (this: User) => boolean): User[] {
      return []; // 模拟实现
    },
  };
}

const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```

> ⚠️ `this` 参数只能用 `function` 关键字，不能用箭头函数（箭头函数的 `this` 由词法作用域决定）。

---

## 第六章：对象类型、类型别名与接口

### 6.1 对象类型注解

对象类型描述了一个对象应该有哪些属性、每个属性是什么类型。你可以直接内联写在参数注解中，也可以用 `type` 或 `interface` 命名后复用。描述对象的"形状"是 TypeScript 最核心的用途之一——它让你在调用函数前就知道该传什么样的对象：

```typescript
// 内联对象类型：pt 必须有 x 和 y，都是 number
function printCoord(pt: { x: number; y: number }) {
  console.log(`x: ${pt.x}, y: ${pt.y}`);
}

printCoord({ x: 3, y: 7 });  // OK
// printCoord({ x: 3 });      // Error: 缺少 y 属性
```

### 6.2 可选属性

用 `?` 标记的属性表示该属性可以不存在。现实中的对象往往不是所有属性都有值——比如用户信息中，昵称是必填的，但真实姓名可能是空的。读取可选属性时，类型是 `T | undefined`，需要先检查才能安全使用：

```typescript
function printName(obj: { first: string; last?: string }) {
  // 方法 1：可选链 ?.（推荐——简洁安全）
  console.log(obj.last?.toUpperCase());
  // 如果 obj.last 是 undefined，整个表达式返回 undefined，不会报错

  // 方法 2：手动检查
  if (obj.last !== undefined) {
    console.log(obj.last.toUpperCase());
  }
}

printName({ first: "Bob" });                // OK：last 是可选的
printName({ first: "Alice", last: "Alisson" });  // OK
```

### 6.3 只读属性

`readonly` 修饰符标记一个属性为只读——创建后不能重新赋值。这只在编译时检查，运行时不影响行为。它既是防止意外修改的保护措施，也是一种文档——告诉阅读代码的人"这个值不应该被修改"：

```typescript
interface Point {
  readonly x: number;  // 只读：创建后不能修改
  y: number;           // 可读可写
}

const p: Point = { x: 10, y: 20 };
p.y = 30;             // OK
// @ts-expect-error
p.x = 5;              // Error: Cannot assign to 'x' because it is a read-only property
```

> **注意**：`readonly` 只防止重新赋值（`p.x = 5`），不防止修改对象内部的属性（如 `p.point.x = 5` 如果 point 是对象的话）。

### 6.4 Type 别名

`type` 关键字为类型起一个名字，之后可以用这个名字来引用。当同一个类型在多处使用时，避免重复写完整的类型定义，详见第四章 4.6 节：

```typescript
// 命名对象类型
type Point = {
  x: number;
  y: number;
};

// 命名联合类型
type ID = number | string;

// 命名函数类型
type Handler = (event: string) => void;

function printCoord(pt: Point) {
  console.log(pt.x, pt.y);
}
```

### 6.5 Interface 声明

`interface` 是另一种命名对象类型的方式，语法与 `type` 类似但有一些关键区别。`interface` 支持声明合并（同名的 interface 自动合并），这在扩展第三方库的类型时非常有用：

```typescript
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log(pt.x, pt.y);
}
```

### 6.6 type vs interface：关键差异

| 特性 | type | interface |
|------|------|-----------|
| 扩展（继承） | `&` 交叉类型 | `extends` |
| 合并声明 | ❌ 不可重复声明 | ✅ 同名的 interface 自动合并 |
| 适用范围 | 任何类型（原始类型、联合、函数等）| 仅对象类型 |
| 错误信息 | 有时显示为匿名类型 | 总是显示名字 |

```typescript
// Interface 扩展
{
  interface Animal { name: string; }
  interface Bear extends Animal { honey: boolean; }
}

// Type 扩展
{
  type Animal = { name: string; };
  type Bear = Animal & { honey: boolean; };
}

// Interface 合并声明
{
  interface Box { title: string; }
  interface Box { content: string; }  // OK：两个声明合并为一个
}

// Type 不可重复声明
{
  // @ts-expect-error
  type Box = { title: string; };
  // @ts-expect-error
  type Box = { content: string; };  // Error：Duplicate identifier
}
```

### 6.7 索引签名

当对象的属性名不确定时：

```typescript
interface StringArray {
  [index: number]: string;  // 索引签名：数字索引返回字符串
}

interface Dictionary {
  [key: string]: unknown;   // 字符串索引
}
```

### 6.8 多余属性检查（Excess Property Checks）

当使用**对象字面量**时，TypeScript 会额外检查是否有类型中未声明的属性：

```typescript
interface Person {
  name: string;
  age?: number;
}

// ❌ 对象字面量的多余属性检查
// @ts-expect-error
const p: Person = { name: "Alice", age: 25, email: "alice@example.com" };
// Error: Object literal may only specify known properties

// ✅ 先赋值给变量再赋值给 Person——不会触发检查
const obj = { name: "Alice", age: 25, email: "alice@example.com" };
const p2: Person = obj;  // OK
```

这种检查只对**对象字面量**生效，对已有变量引用不会触发。它有助于在赋值时捕获拼写错误。

### 6.9 扩展类型（Extending Types）

```typescript
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}

// 多继承
interface Colorful { color: string; }
interface Circle { radius: number; }
interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = { color: "red", radius: 5 };
```

type 用交叉类型实现扩展：

```typescript
type BasicAddress = { street: string; city: string; };
type AddressWithUnit = BasicAddress & { unit: string };
```

### 6.10 交叉类型（Intersection Types）

```typescript
interface Colorful { color: string; }
interface Circle { radius: number; }

type ColorfulCircle = Colorful & Circle;
// { color: string; radius: number; }
```

合并有冲突属性的类型时：

```typescript
interface A { x: number; }
interface B { x: string; }
type C = A & B;
// C 的 x 类型为 never（number & string 的交集为空）
```

### 6.11 泛型对象类型

```typescript
interface Box<T> {
  contents: T;
}

const box: Box<string> = { contents: "hello" };

// Array<T> 是内置的泛型对象类型
type NumberArray = Array<number>;   // 等价于 number[]
type StringArray = Array<string>;   // 等价于 string[]

// ReadonlyArray<T>——不可修改的数组
type ReadonlyNumArr = ReadonlyArray<number>;
const arr: ReadonlyNumArr = [1, 2, 3];
// arr.push(4);  // Error
// arr[0] = 0;   // Error
```

### 6.12 元组类型（Tuple Types）

元组是固定长度、每项类型已知的数组：

```typescript
type Pair = [string, number];
const alice: Pair = ["Alice", 25];

// 可选元素
type OptPair = [string, number?];
const a: OptPair = ["hello"];
const b: OptPair = ["hello", 42];

// 剩余元素
type StringNumberBooleans = [string, number, ...boolean[]];

// 只读元组
type Point = readonly [number, number];
const p: Point = [1, 2];
// p[0] = 0;  // Error
```

> **与 Python 对比**：Python 的 tuple 是运行时不可变对象。TS 的元组类型对应固定长度、类型各异的**数组**，运行时就是 JS 数组——`readonly` 只是编译时约束。

---

## 第七章：联合类型、字面量类型与类型收窄

### 7.1 联合类型

表示一个值可以是几种类型之一：

```typescript
function printId(id: number | string) {
  console.log(`Your ID is: ${id}`);
}

printId(101);     // OK
printId("202");   // OK
// printId({ id: 123 });  // Error
```

### 7.2 类型收窄（Narrowing）概述

有了联合类型，TS 只允许**所有成员共有**的操作：

```typescript
function printId(id: number | string) {
  // id.toUpperCase();  // Error: 只有 string 有，number 没有
}
```

需要用条件语句**收窄**类型。收窄的核心机制是**类型守卫**（Type Guards）——表达式在运行时检查某些东西，TS 根据检查结果在分支中推断出更精确的类型。这个过程称为**控制流分析**（Control Flow Analysis）。

#### 7.2.1 `typeof` 类型守卫

```typescript
function printId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());  // id: string
  } else {
    console.log(id);                // id: number
  }
}
```

`typeof` 返回的值是有限的集合：`"string"`、`"number"`、`"bigint"`、`"boolean"`、`"symbol"`、`"undefined"`、`"object"`、`"function"`。

⚠️ `typeof null` 返回 `"object"`——这是 JS 的历史遗留问题，需要注意。

#### 7.2.2 Truthiness 收窄

JavaScript 中以下值为 **falsy**：

```
false, 0, 0n, "", null, undefined, NaN
```

利用 truthiness 可以过滤掉 `null` 和 `undefined`：

```typescript
function getFirst(arr?: string[]) {
  // arr: string[] | undefined
  if (arr) {
    // arr: string[]（排除了 undefined）
    return arr[0];
  }
  return undefined;
}
```

但要注意 falsy 值中可能有合法数据：

```typescript
// 使用 truthiness 收窄 OR 逻辑的常见写法：
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    // 先通过 truthiness 排除了 null
    // strs: string[]
    strs.forEach(s => console.log(s));
  } else if (typeof strs === "string") {
    // strs: string
    console.log(strs);
  }
}
```

#### 7.2.3 等值收窄（Equality Narrowing）

```typescript
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // 当 x === y，它们的类型交集为 string
    // x: string, y: string
    x.toUpperCase();
  }
}
```

`== null` 同时排除 `null` 和 `undefined`：

```typescript
function greet(name: string | null | undefined) {
  if (name == null) {
    // name: null | undefined
    console.log("No name provided");
  } else {
    // name: string
    console.log(name.toUpperCase());
  }
}
```

> `== null` 是少数推荐使用 `==` 而非 `===` 的场景，它同时检查 `null` 和 `undefined`。

#### 7.2.4 `in` 运算符收窄

```typescript
interface Fish { swim(): void; }
interface Bird { fly(): void; }

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();  // animal: Fish
  }
  return animal.fly();     // animal: Bird
}
```

#### 7.2.5 `instanceof` 收窄

```typescript
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toISOString());  // x: Date
  } else {
    console.log(x.toUpperCase());  // x: string
  }
}
```

#### 7.2.6 赋值收窄（Assignment Narrowing）

当变量被重新赋值时，TS 根据赋值表达式收窄类型：

```typescript
let x: string | number = "hello";
// x: string

x = 42;
// x: number（类型被重新收窄）
```

#### 7.2.7 `Array.isArray` 收窄

```typescript
function welcome(x: string[] | string) {
  if (Array.isArray(x)) {
    console.log(x.join(" and "));  // x: string[]
  } else {
    console.log(x);                // x: string
  }
}
```

#### 7.2.8 类型谓词（Type Predicates）

自定义类型守卫，用 `parameterName is Type` 语法：

```typescript
interface Fish { swim(): void; }
interface Bird { fly(): void; }

function getPet(): Fish | Bird {
  return { swim() { console.log("swim"); } };
}

function isFish(pet: Fish | Bird): pet is Fish {
  return "swim" in pet;
}

const pet: Fish | Bird = getPet();
if (isFish(pet)) {
  pet.swim();  // pet: Fish
} else {
  pet.fly();   // pet: Bird
}
```

断言函数风格（`asserts` 关键字）：

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Not a string");
  }
}

function process(value: unknown) {
  assertIsString(value);
  value.toUpperCase();  // value: string
}
```

### 7.3 可辨识联合（Discriminated Union）

这是 TypeScript 中极度重要的模式。联合的每个成员包含一个**字面量类型**字段（"标识符" / discriminant），TS 根据该字段收窄整个对象：

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}
```

等价于其他语言的**代数数据类型**（ADT）或**标记联合**（Tagged Union）：

> - Rust: `enum Shape { Circle { radius: f64 }, Rectangle { width: f64, height: f64 } }`
> - Python: `Union` + `@dataclass`
> - C++: `std::variant` + `std::visit`

用 `if` 也可以：

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  }
  if (shape.kind === "rectangle") {
    return shape.width * shape.height;
  }
  return (shape.base * shape.height) / 2;
}
```

### 7.4 穷尽性检查（Exhaustiveness Checking）与 `never`

处理完联合的所有变体后，剩余类型应该是 `never`（不可能发生）。用 `never` 做编译时检查，可以保证你处理了联合类型的每一个变体：

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}

// 如果以后扩展 Shape：
// | { kind: "square"; side: number };
// TS 在 default 分支报错：Type 'Square' is not assignable to type 'never'
// ——提示你更新 area 函数
```

这就是**穷尽性检查**——保证处理了联合类型的每一个变体。

### 7.5 字面量类型

特定值本身也是一种类型：

```typescript
// 字符串字面量类型
type Direction = "left" | "right" | "up" | "down";

// 数字字面量类型
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// 布尔字面量类型
type IsActive = true | false;  // 这其实就是 boolean
```

**实用场景**：限定函数参数为固定值集合：

```typescript
function setAlignment(align: "left" | "center" | "right") {
  // ...
}
setAlignment("left");      // OK
// setAlignment("middle"); // Error
```

### 7.6 字面量推断问题

```typescript
const req = { url: "https://example.com", method: "GET" };
// req.method 被推断为 string，不是 "GET"

function handleRequest(url: string, method: "GET" | "POST") { }

// @ts-expect-error
handleRequest(req.url, req.method);
// Error: string 不能赋值给 "GET" | "POST"
```

两种解法：

```typescript
// 解法 1：为 method 字段添加字面量断言
const req = { url: "https://example.com", method: "GET" as "GET" };

// 解法 2：使用 as const 约束整个对象
const req2 = { url: "https://example.com", method: "GET" } as const;
// 所有属性都被推断为字面量类型
```

---

## 第八章：类型推导与断言

### 8.1 类型推导

TypeScript 能自动推断类型，不需要每次都写注解：

```typescript
{
  let name = "Alice";      // 自动推断为 string
  let age = 25;             // 自动推断为 number
  let isCool = true;        // 自动推断为 boolean
  let items = [1, 2, 3];    // 自动推断为 number[]
}

// 函数返回值自动推断
{
  function add(a: number, b: number) {
    return a + b;           // 自动推断返回类型为 number
  }
}
```

**最佳实践**：类型能推断出来时就省略注解，保持代码简洁。

### 8.2 类型断言（Type Assertions）

当你比 TS 更了解值的类型时：

```typescript
// 场景：DOM API 返回 HTMLElement，但你很清楚它是 HTMLCanvasElement
const canvas = document.getElementById("main_canvas") as HTMLCanvasElement;

// 尖括号语法（.tsx 文件中不能用）
const canvas2 = <HTMLCanvasElement>document.getElementById("main_canvas");
```

**不能**断言为不兼容的类型：

```typescript
// ❌ 不能直接断言为不兼容的类型
{
  // @ts-expect-error
  const x = "hello" as number;
}
// ✅ 必须先转为 any/unknown
{
  const x = "hello" as unknown as number;
}
```

### 8.3 `@ts-expect-error` —— 抑制类型错误

当你确信 TS 的判断有误，或暂时不想处理某个错误时：

```typescript
// @ts-expect-error
const result: string = 42;  // 这行不会报错

// 如果下一行没有错误，@ts-expect-error 本身会提示"未使用的指令"
```

> `@ts-ignore` 类似但更危险——即使下一行没有错误也静默不提示。始终优先使用 `@ts-expect-error`。

### 8.4 非空断言（Non-null Assertion `!`）

```typescript
function liveDangerously(x?: number | null) {
  console.log(x!.toFixed());  // 断言 x 一定不是 null/undefined
}
```

**只有**当你确定值不为空时使用，它不会改变运行时行为。

### 8.5 `satisfies` 运算符

```typescript
type Colors = "red" | "green" | "blue";
type RGB = [number, number, number];

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
} satisfies Record<Colors, string | RGB>;

// palette.green 被推断为 string（不是 string | RGB）
palette.green.toUpperCase();
```

**为什么不用类型注解或 `as`？**

```typescript
// ❌ 类型注解：green 被拓宽为 string | RGB，丢失了精确类型
const palette1: Record<Colors, string | RGB> = { ... };
palette1.green.toUpperCase();  // Error: string | RGB 没有 toUpperCase

// ❌ as 断言：green 也被拓宽为 string | RGB
const palette2 = { ... } as Record<Colors, string | RGB>;
palette2.green.toUpperCase();  // Error: 同上

// ✅ satisfies：green 保留为 string（精确推断），同时检查整体结构
const palette3 = { ... } satisfies Record<Colors, string | RGB>;
palette3.green.toUpperCase();  // OK
```

`satisfies` 同时满足：
1. 检查值的类型是否符合约束
2. 保留最精确的推导类型

---

## 第九章：泛型（Generics）

### 9.1 为什么需要泛型

假设你要写一个"返回传入值"的函数。为每种类型写一个版本显然太冗余，而用 `any` 又会丢失类型信息：

```typescript
// 方案 1：为每种类型写一个函数——代码重复
function identityNumber(arg: number): number { return arg; }
function identityString(arg: string): string { return arg; }

// 方案 2：用 any——丢失了类型信息
function identityAny(arg: any): any { return arg; }
// 调用 identityAny("hello") 返回的类型是 any，不是 string
```

泛型（Generics）用一个"类型占位符"替代具体类型，在调用时再填充，既不重复也不丢失类型信息：

```typescript
function identity<T>(arg: T): T { return arg; }
// T 是类型参数，调用时自动推断为实际类型
```

### 9.2 泛型函数

泛型函数在函数名后用 `<T>` 声明一个类型参数，这个参数可以在参数类型和返回值类型中使用。大多数情况下 TS 能自动推断类型参数，不必手动指定：

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// 方式 1：显式指定类型参数
const output = identity<string>("hello");  // 指定 T = string

// 方式 2：让 TS 自动推断（更常用）
const output2 = identity("hello");  // TS 从参数 "hello" 推断 T = string
// output2 的类型是 string
```

### 9.3 多个类型参数

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const p = pair("hello", 42);  // 类型为 [string, number]
```

### 9.4 泛型约束

默认情况下，泛型参数可以是任何类型。但如果你需要在函数内部访问某些属性（如 `.length`），就需要用 `extends` 关键字约束类型参数必须满足某个条件：

```typescript
// 定义约束接口
interface Lengthwise {
  length: number;
}

// T extends Lengthwise 表示 T 必须有 length 属性
function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);  // OK：T 保证有 length
  return arg;
}

logLength("hello");      // OK：string 有 length
logLength([1, 2, 3]);    // OK：array 有 length
logLength({ length: 10, value: 3 });  // OK：对象有 length
// logLength(42);        // Error：number 没有 length 属性
```

### 9.5 泛型接口与泛型别名

```typescript
// 泛型接口
interface Box<T> {
  value: T;
}

const box: Box<number> = { value: 42 };

// 泛型别名
type Result<T> = { success: true; data: T } | { success: false; error: string };

const r1: Result<number> = { success: true, data: 42 };
const r2: Result<string> = { success: false, error: "Not found" };
```

### 9.6 泛型类

类也可以使用泛型参数。比如一个栈（Stack）数据结构，既可以存数字也可以存字符串——用泛型可以写一个通用的 Stack，而不是为每种类型写一个：

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

// 数字栈——只能 push/pop number
const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
console.log(numStack.pop());  // 2

// 字符串栈——只能 push/pop string
const strStack = new Stack<string>();
strStack.push("hello");
console.log(strStack.pop());  // "hello"
```

### 9.7 泛型约束与条件类型的实用模式

```typescript
// 提取 Promise 中的值类型
type Unwrap<T> = T extends Promise<infer U> ? U : T;
type A = Unwrap<Promise<string>>;  // string
type B = Unwrap<number>;           // number
```

---

## 第十章：类（Classes）

### 10.1 基本语法

```typescript
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `Hi, I'm ${this.name}`;
  }
}

const alice = new Person("Alice", 25);
console.log(alice.greet());
```

### 10.2 可见性修饰符

```typescript
class Animal {
  public name: string;           // 默认：任何地方都可访问
  private age: number;           // 仅该类内部
  protected species: string;     // 该类及子类

  constructor(name: string, age: number, species: string) {
    this.name = name;
    this.age = age;
    this.species = species;
  }
}
```

### 10.3 参数属性简写

普通的类构造函数往往充满重复的 `this.xxx = xxx` 赋值。TypeScript 允许在构造函数参数前加 `public`/`private`/`protected`/`readonly` 修饰符，TS 会自动创建同名属性并赋值，省去手动赋值的样板代码：

```typescript
// 传统写法：需要声明属性 + 构造函数参数 + 手动赋值
class AnimalVerbose {
  public name: string;
  private age: number;
  protected species: string;

  constructor(name: string, age: number, species: string) {
    this.name = name;
    this.age = age;
    this.species = species;
  }
}

// 参数属性简写：一行搞定
class AnimalShort {
  constructor(
    public name: string,      // 自动创建 public name 属性并赋值
    private age: number,      // 自动创建 private age 属性并赋值
    protected species: string // 自动创建 protected species 属性并赋值
  ) {
    // 不需要写 this.name = name，TS 自动处理
  }
}
```

### 10.4 `readonly`

`readonly` 修饰符让属性只能在构造函数中赋值，之后不能修改。适合保护不应该改变的值（如配置、ID 等）：

```typescript
class Config {
  readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;  // 构造函数中可以赋值
  }
}

const config = new Config("abc-123");
console.log(config.apiKey);  // "abc-123"
// config.apiKey = "xyz";    // Error: Cannot assign to 'apiKey' because it is a read-only property

// 或用参数属性简写
class ConfigShort {
  constructor(readonly apiKey: string) { }
}
```

### 10.5 存取器（Getters / Setters）

存取器（Accessors）让你用属性的语法来自定义读取和设置逻辑。当你想在读取或修改属性时执行一些逻辑（如类型转换、验证、计算），但又想保持属性访问的简洁语法时，就用 getter/setter：

```typescript
class Temperature {
  private _celsius: number;

  constructor(celsius: number) {
    this._celsius = celsius;
  }

  // getter：读取时自动转换为华氏度
  get fahrenheit(): number {
    return this._celsius * 9 / 5 + 32;
  }

  // setter：设置华氏度时自动转换为摄氏度
  set fahrenheit(value: number) {
    this._celsius = (value - 32) * 5 / 9;
  }
}

const t = new Temperature(100);
console.log(t.fahrenheit);  // 212 —— 像属性一样读取，不需要 t.fahrenheit()
t.fahrenheit = 32;          // 像属性一样设置
console.log(t.fahrenheit);  // 32 —— 通过 getter 读取转换后的值
```

### 10.6 `private` vs `#`（硬私有）

TypeScript 的 `private` 和 JavaScript 原生的 `#` 都用于限制属性访问，但私有程度不同——`private` 只是"君子协定"，`#` 才是真正的私有：

```typescript
class Secret {
  private code = "1234";  // TS 的"软私有"
}

const s = new Secret();
// s.code;           // 编译报错：code 是 private
(s as any).code;     // 运行时可以绕过！这就是"软私有"
```

使用 JS 原生的 `#` 前缀实现**硬私有**：

```typescript
class RealSecret {
  #code = "1234";  // JS 原生的"硬私有"

  getCode() {
    return this.#code;  // 内部可以访问
  }
}

const r = new RealSecret();
r.getCode();          // OK
// r.#code;           // 编译报错
// (r as any).#code;  // 运行时也报错——真正的私有
```

> **建议**：如果只是团队内部约定，`private` 足够；如果需要防止恶意绕过（如库的内部实现），使用 `#`。

### 10.7 继承

```typescript
class Animal {
  name: string;
  age: number;
  protected species: string;

  constructor(name: string, age: number, species: string) {
    this.name = name;
    this.age = age;
    this.species = species;
  }
}

class Dog extends Animal {
  constructor(name: string, age: number) {
    super(name, age, "canine");  // 必须先调用 super()
  }

  bark(): string {
    return "Woof!";
  }
}
```

### 10.8 抽象类

抽象类（Abstract Class）不能直接实例化，只能被继承。它可以包含抽象方法（没有实现，子类必须实现）和具体方法（有实现，子类可以直接使用）。当你有一组相关的类共享某些行为，但每个类的具体实现不同时，抽象类定义公共的接口和部分实现，子类负责补充剩余的实现：

```typescript
abstract class Shape {
  abstract area(): number;       // 抽象方法：只有签名，没有实现，子类必须实现

  describe(): string {           // 具体方法：有实现，子类可以直接继承使用
    return `Area: ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(public radius: number) {
    super();  // 必须调用父类构造函数
  }

  area(): number {  // 必须实现抽象方法
    return Math.PI * this.radius ** 2;
  }
}

const c = new Circle(5);
console.log(c.describe());  // "Area: 78.539..."——使用继承的具体方法
// const s = new Shape();   // Error: 不能实例化抽象类
```

### 10.9 implements 与 interface

`implements` 关键字让一个类实现一个或多个接口，确保类具有接口定义的所有方法和属性。接口定义了"契约"——任何实现该接口的类都必须提供接口中声明的方法：

```typescript
interface Runnable {
  run(): void;
}

interface Barkable {
  bark(): void;
}

// Dog 类同时实现两个接口——必须提供 run() 和 bark() 方法
class Dog implements Runnable, Barkable {
  run(): void { console.log("Running..."); }
  bark(): void { console.log("Woof!"); }
}
```

> **`implements` vs `extends`**：`extends` 用于类继承类（或接口继承接口），`implements` 用于类实现接口。一个类只能 `extends` 一个类，但可以 `implements` 多个接口。

### 10.10 静态成员

`static` 修饰符让属性或方法属于类本身，而不是类的实例。通过 `ClassName.xxx` 访问，不需要创建实例。有些工具函数或常量与类相关但不需要实例化，比如数学工具类的 `PI` 常量、数组的最大值方法等：

```typescript
class Utils {
  static readonly PI = 3.14159;  // 静态只读属性

  static max<T>(arr: T[]): T {   // 静态泛型方法
    return arr.reduce((a, b) => a > b ? a : b);
  }
}

// 通过类名直接访问，不需要 new
console.log(Utils.PI);                // 3.14159
console.log(Utils.max([1, 5, 3]));   // 5

// const u = new Utils();
// u.PI;  // Error：PI 是静态成员，不能通过实例访问
```

### 10.11 装饰器（Decorators）简介

装饰器是一种特殊声明，可以附加到类声明、方法、属性或参数上，用于修改或扩展它们的行为。装饰器在 Angular（`@Component`、`@Injectable`）和 NestJS（`@Controller`、`@Module`）中被广泛使用。

```typescript
// 装饰器函数——接收类的构造函数作为参数
function Log(originalMethod: any, context: ClassMethodDecoratorContext) {
  return function (this: any, ...args: any[]) {
    console.log(`Calling ${String(context.name)} with`, args);
    return originalMethod.apply(this, args);
  };
}

class Calculator {
  @Log
  add(a: number, b: number) {
    return a + b;
  }
}

new Calculator().add(1, 2);  // 控制台输出: Calling add with [1, 2]
```

> 装饰器目前是 TC39 Stage 3 提案，TS 5.0+ 原生支持。要启用装饰器，需要在 tsconfig 中设置 `"experimentalDecorators": true`（旧语法）或不设置（新语法，TS 5.0+ 默认支持）。Angular/NestJS 项目通常使用旧语法。

---

## 第十一章：模块系统

### 11.1 导出与导入

模块系统让你把代码拆分成多个文件，每个文件是一个模块。当项目变大时，所有代码写在一个文件里会变得不可维护。通过 `export` 导出需要对外暴露的内容，通过 `import` 导入其他模块的内容，实现封装和复用：

```typescript
// ----- math.ts（定义模块）-----
export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export class Calculator {
  result = 0;
  add(n: number): this {
    this.result += n;
    return this;
  }
}

// ----- app.ts（使用模块）-----
import { PI, add, Calculator } from "./math";

console.log(PI);           // 3.14159
console.log(add(1, 2));    // 3
const calc = new Calculator();
```

### 11.2 默认导出

每个模块可以有一个默认导出（`export default`），导入时不需要花括号，名字可以自由取。当一个模块主要导出一个值（如配置对象、主组件）时，默认导出让导入语法更简洁：

```typescript
// config.ts——导出一个配置对象
export default {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};

// app.ts——导入时名字可以随便取
import config from "./config";
console.log(config.apiUrl);

// 也可以导入默认导出 + 命名导出
// import config, { PI } from "./math";
```

### 11.3 重命名导入/导出

用 `as` 关键字可以在导入或导出时重命名，避免命名冲突或让名字更清晰：

```typescript
// 导入时重命名——把 add 别名为 sum
import { add as sum } from "./math";
sum(1, 2);  // 用 sum 而不是 add

// 导出时重命名——对外暴露时换个名字
export { add as sum };

// 统一导入所有导出——用 * as 起一个命名空间
import * as MathUtils from "./math";
MathUtils.add(1, 2);      // 通过命名空间访问
MathUtils.PI;              // 3.14159
```

### 11.4 类型专用导入/导出

`import type` 和 `export type` 只导入/导出类型信息，编译后会被完全擦除，不会生成任何 JS 代码。当你只需要类型（如接口、类型别名）而不需要运行时的值时，使用 `import type` 可以避免不必要的运行时依赖，也让意图更明确：

```typescript
// types.ts——定义类型
export interface User {
  name: string;
  age: number;
}
export type ID = number | string;

// app.ts——仅导入类型信息
import type { User, ID } from "./types";
// 编译后这行会被完全删除，不会生成 require/import 调用

// 也可以合并导入值和类型
import { add, type Calculator } from "./math";
// add 是值，Calculator 是类型
```

### 11.5 CommonJS 与 ES Module 的互操作

JS 世界有两套模块系统：Node.js 传统的 **CommonJS**（`require`/`module.exports`）和现代标准 **ES Module**（`import`/`export`）。TypeScript 默认使用 ES Module 语法，编译时会根据 `tsconfig.json` 的 `module` 选项输出对应格式：

```json
{
  "compilerOptions": {
    "module": "commonjs"   // 输出 CommonJS（Node.js 默认）
    // "module": "ESNext"  // 输出 ES Module（浏览器/Vite 默认）
  }
}
```

设置 `esModuleInterop: true` 后，可以用 ES Module 语法导入 CommonJS 模块：

```typescript
// 有 esModuleInterop 时，这样写是合法的：
import express from "express";       // CommonJS 模块

// 没有 esModuleInterop 时，需要：
import * as express from "express";
```

> **建议**：新项目始终在 tsconfig 中开启 `esModuleInterop: true`，避免不必要的导入语法差异。

> ⚠️ **Node ESM 下的扩展名问题**：在 Vite/Webpack 等打包器环境中，导入本地模块时可以省略扩展名（`import { foo } from "./bar"`）。但在 Node.js ESM 模式（`moduleResolution: nodenext`）下，很多场景需要写完整扩展名：
>
> ```typescript
> // 打包器环境——OK
> import { add } from "./math";
>
> // Node.js ESM——需要 .js 扩展名
> import { add } from "./math.js";
> ```
>
> 这是 Node.js ESM 的规范要求，不是 TypeScript 的问题。

---

## 第十二章：声明文件与类型空间

### 12.1 什么是声明文件（.d.ts）

纯 JavaScript 库本身没有类型信息，但很多现代库会在包内自带 `.d.ts` 类型定义，不需要额外安装。对于没有内置类型的库，TypeScript 通过**声明文件**（Declaration File，扩展名 `.d.ts`）来添加类型描述。这样你在 TS 中导入 JS 库时，就能获得类型检查和自动补全。

```typescript
// 假设你安装了一个纯 JS 库 "lodash"
import _ from "lodash";
_.chunk([1, 2, 3, 4], 2);  // 如果没有类型定义，TS 不知道 chunk 的参数和返回值
```

### 12.2 DefinitelyTyped 与 @types

社区维护了一个巨大的声明文件仓库 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)，包含数万个流行 JS 库的类型定义。通过 npm 安装对应的 `@types` 包即可：

```bash
# 安装 lodash 的类型定义
npm install -D @types/lodash

# 安装 express 的类型定义
npm install -D @types/express

# 安装 node 的全局类型定义（用于 Node.js 项目）
npm install -D @types/node
```

安装后，TS 会自动识别这些类型定义，无需额外配置。

### 12.3 自己编写声明文件

当你使用一个没有 `@types` 包的 JS 库时，可以自己编写声明文件：

```typescript
// types/my-lib.d.ts
declare module "my-lib" {
  export function doSomething(x: string): number;
  export interface Config {
    timeout: number;
    retries: number;
  }
}
```

或者在项目中创建一个 `*.d.ts` 文件来声明全局类型：

```typescript
// global.d.ts
declare global {
  interface Window {
    myAppConfig: { apiUrl: string };
  }
}

export {};  // 确保文件被当作模块
```

### 12.4 三斜线指令（Triple-Slash Directives）

早期 TS 项目用三斜线指令来引用声明文件，现在已不常用（npm + `@types` 更主流）：

```typescript
/// <reference types="node" />
/// <reference path="./my-lib.d.ts" />
```

> **实践建议**：优先查找 `@types` 包；没有的话自己写 `.d.ts`；三斜线指令仅在特殊场景使用。

---

## 第十三章：高级类型概览（选读）

> 本章介绍 TypeScript 的高级类型操作符，属于进阶内容。初学者可以先跳过，需要时再回来查阅。

### 13.1 索引访问类型

用 `Type["key"]` 的语法可以从一个类型中提取某个属性的类型，就像用方括号访问对象属性一样。当你需要从一个复杂的类型中提取某个字段的类型时，不必手动写出来：

```typescript
type Person = { name: string; age: number; address: { city: string } };

type NameType = Person["name"];           // string——提取 name 属性的类型
type AgeType = Person["age"];             // number——提取 age 属性的类型
type CityType = Person["address"]["city"];  // string——嵌套提取

// 联合索引：同时提取多个属性的类型
type NameOrAge = Person["name" | "age"];  // string | number
```

### 13.2 `keyof` 类型操作符

`keyof` 接收一个对象类型，返回其所有属性名组成的联合类型。当你需要编写一个函数只接受对象已有的属性名作为参数时，`keyof` + 泛型约束可以实现编译时的属性名检查：

```typescript
type Person = { name: string; age: number; email: string };
type PersonKeys = keyof Person;  // "name" | "age" | "email"

// K 必须是 T 的属性名之一
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];  // 返回类型是 T[K]——对应属性的类型
}

const p: Person = { name: "Alice", age: 25, email: "a@b.com" };
getProperty(p, "name");     // 返回类型是 string
getProperty(p, "age");      // 返回类型是 number
// getProperty(p, "invalid");  // Error："invalid" 不是 Person 的属性
```

### 13.3 `typeof` 类型操作符

`typeof` 在类型位置使用时，获取一个值的类型。注意区分：运行时的 `typeof` 返回字符串（如 `"string"`），而类型位置的 `typeof` 返回类型。当你已经有一个具体的值（如配置对象），想从它推断出类型而不想手动写一遍时：

```typescript
const person = { name: "Alice", age: 25 };
type Person = typeof person;  // { name: string; age: number }

// 常见用法：从 const 对象推断类型
const defaultConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};
type Config = typeof defaultConfig;
// { apiUrl: string; timeout: number }
```

### 13.4 条件类型

条件类型用 `T extends U ? X : Y` 的语法，根据类型参数是否满足约束来选择不同的类型，类似于运行时的三元运算符但在类型层面工作。当你需要根据输入类型的不同自动推断出不同的返回类型时：

```typescript
// 如果 T 是 string 的子类型，返回 "yes"，否则返回 "no"
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"
type C = IsString<"hello">;  // "yes"——字面量类型是 string 的子类型
```

### 13.5 映射类型

映射类型遍历一个对象类型的所有属性，对每个属性应用某种变换，语法是 `[K in keyof T]: 新类型`。当你想基于一个现有类型创建一个变体（如全部变为只读、全部变为可选）时，不必手动重写每个属性：

```typescript
// 将对象所有属性转为只读
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// 将对象所有属性转为可选
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// 使用
interface Person { name: string; age: number; }
type ReadonlyPerson = Readonly<Person>;
// { readonly name: string; readonly age: number; }

type OptionalPerson = Partial<Person>;
// { name?: string; age?: number; }

export {};
```

> TypeScript 内置了 `Readonly<T>` 和 `Partial<T>` 等工具类型（见附录 B），不需要自己定义。

### 13.6 模板字面量类型

模板字面量类型用反引号语法在类型层面拼接字符串类型，支持 `Capitalize`、`Uppercase` 等内置工具类型。当你需要描述字符串的模式（如事件名必须以 `"on"` 开头）时，可以精确约束：

```typescript
// 以 "on" 开头的任意字符串
type EventName = `on${Capitalize<string>}`;

// 从具体值推断
type Events = "click" | "focus" | "blur";
type EventHandlers = `on${Capitalize<Events>}`;
// "onClick" | "onFocus" | "onBlur"
```

---

## 第十四章：Zod —— 运行时验证

### 14.1 为什么需要 Zod

TypeScript 的类型检查发生在**编译时**——编译完成后，所有类型信息都被擦除。这意味着当数据来自外部来源（用户输入、API 响应、配置文件等）时，TS 无法在运行时验证数据是否符合你期望的类型：

```typescript
// 编译时没问题，但运行时可能出问题
interface User {
  name: string;
  age: number;
}

function processUser(data: User) {
  console.log(data.name.toUpperCase());
  console.log(data.age + 1);  // 这里假设 age 是 number
}

// 来自外部的"不可信"数据
const rawData = JSON.parse('{"name": "Alice", "age": "twenty"}');
processUser(rawData);  // 不会抛异常，但得到错误结果："twenty" + 1 变成 "twenty1" 而不是 21
```

Zod 解决了这个问题：它让你用 TS 风格的代码定义 schema（模式），在运行时验证数据，同时自动推断出 TypeScript 类型。一份定义，同时获得**验证**和**类型**。

### 14.2 安装与基本用法

```bash
npm install zod
```

> 以下示例默认已执行 `import { z } from "zod"`。

定义 schema、验证数据、推断类型——三步完成：

```typescript
import { z } from "zod";

// 1. 定义 schema
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});

// 2. 验证数据（运行时检查）
const user = UserSchema.parse({ name: "Alice", age: 25 });
// user 的类型自动推断为 { name: string; age: number }

// 3. 直接使用，类型安全
console.log(user.name.toUpperCase());  // OK
```

### 14.3 错误处理

`parse()` 在验证失败时抛出 `ZodError`。如果你不想用 try/catch，可以用 `safeParse()` 返回一个结果对象：

```typescript
// 方式 1：try/catch
try {
  UserSchema.parse({ name: 42, age: "old" });
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(error.issues);
    // [
    //   { expected: 'string', code: 'invalid_type', path: ['name'], message: '...' },
    //   { expected: 'number', code: 'invalid_type', path: ['age'], message: '...' }
    // ]
  }
}

// 方式 2：safeParse（推荐——不抛异常）
const result = UserSchema.safeParse({ name: 42, age: "old" });
if (!result.success) {
  console.log(result.error.issues);  // 验证失败
} else {
  console.log(result.data);          // { name: string; age: number }
}
```

### 14.4 从 Schema 推断 TypeScript 类型

Zod 的核心理念是**schema 即类型**——你只需定义一次 schema，用 `z.infer<>` 提取 TypeScript 类型，无需手动重复定义：

```typescript
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

// 从 schema 推断出 TS 类型
type User = z.infer<typeof UserSchema>;
// 等价于：type User = { name: string; age: number; email: string }

// 用推断的类型标注变量
const user: User = { name: "Alice", age: 25, email: "a@b.com" };
```

这样做的好处：schema 和类型永远同步，改一处就全部生效。

### 14.5 常用 Schema 类型

Zod 的 API 设计与 TypeScript 类型系统一一对应——每个 TS 类型都有一个同名的 Zod 构造函数。这些构造函数创建的 schema 会在运行时检查传入的值是否符合对应类型：

```typescript
// 原始类型——检查值是否为对应的 JS 原始类型
z.string();      // 验证值是否为 string
z.number();      // 验证值是否为 number（NaN 和 Infinity 会被拒绝）
z.boolean();     // 验证值是否为 boolean
z.bigint();      // 验证值是否为 bigint
z.date();        // 验证值是否为 Date 对象（不是日期字符串）

// 特殊类型
z.null();        // 仅接受 null
z.undefined();   // 仅接受 undefined
z.any();         // 接受任何值（不验证，和 TS 的 any 一样）
z.unknown();     // 接受任何值（但使用时需要收窄，和 TS 的 unknown 一样）
z.never();       // 拒绝所有值（永远不会验证通过）

// 字面量类型——验证值是否严格等于指定的值
z.literal("hello");  // 只接受 "hello" 这一个字符串
z.literal(42);       // 只接受数字 42
z.literal(true);     // 只接受布尔值 true
```

### 14.6 字符串验证

Zod 提供了丰富的字符串验证方法，无需手写正则表达式。这些方法可以链式调用，每个方法在前一个验证通过的基础上追加新的约束：

```typescript
// 长度约束
z.string().min(3);           // 至少 3 个字符
z.string().max(50);          // 最多 50 个字符
z.string().length(10);       // 恰好 10 个字符

// 格式约束——内置了常用的正则验证
z.string().email();          // 必须是合法的邮箱格式
z.string().url();            // 必须是合法的 URL
z.string().uuid();           // 必须是合法的 UUID
z.string().datetime();       // 必须是 ISO 8601 日期时间格式

// 内容约束
z.string().regex(/^[a-z]+$/); // 必须匹配正则表达式
z.string().startsWith("http"); // 必须以指定前缀开头
z.string().endsWith(".ts");    // 必须以指定后缀结尾

// 变换——验证通过后对值进行转换（不是约束，而是修改输出）
z.string().trim();           // 去除首尾空格后返回
z.string().toLowerCase();    // 转为小写后返回
```

> 链式调用的顺序很重要：变换方法（如 `trim`）会先执行，后续的约束方法基于变换后的值进行验证。

### 14.7 数字验证

数字 schema 同样支持链式约束，用于限定数值的范围和格式：

```typescript
z.number().min(0);           // 值必须 >= 0
z.number().max(100);         // 值必须 <= 100
z.number().int();            // 值必须是整数（排除小数）
z.number().positive();       // 值必须 > 0（等价于 .gt(0)）
z.number().negative();       // 值必须 < 0
z.number().multipleOf(5);    // 值必须是 5 的倍数
z.number().finite();         // 值不能是 Infinity
```

> 这些约束方法对应的 TS 类型都是 `number`——Zod 只在运行时检查值是否满足约束，不会改变推断出的 TS 类型。

### 14.8 对象、数组与枚举

`z.object` 定义对象 schema，每个属性对应一个子 schema。对象的所有属性默认是**必填**的，用 `.optional()` 标记可选属性：

```typescript
// 对象——所有属性默认必填
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});
UserSchema.parse({ name: "Alice" });  // Error：缺少 age

// 可选属性用 .optional()
const ConfigSchema = z.object({
  host: z.string(),              // 必填
  port: z.number().optional(),   // 可选——允许不传或传 undefined
});
ConfigSchema.parse({ host: "localhost" });  // OK
```

`z.array` 定义数组 schema，泛型参数是元素的 schema。可以追加 `.min()` / `.max()` 约束数组长度：

```typescript
const TagsSchema = z.array(z.string()).min(1).max(10);
// 数组至少 1 个元素、最多 10 个元素，且每个元素必须是 string
TagsSchema.parse(["ts", "zod"]);  // OK
TagsSchema.parse([]);             // Error：数组为空
```

`z.enum` 定义枚举 schema，限定值只能是字符串数组中的某一个。这对应 TS 的字面量联合类型：

```typescript
const ColorSchema = z.enum(["red", "green", "blue"]);
ColorSchema.parse("red");     // OK
// ColorSchema.parse("yellow"); // Error："yellow" 不在允许的值中

// 推断出的 TS 类型是 "red" | "green" | "blue"
type Color = z.infer<typeof ColorSchema>;
```

> ⚠️ 如果枚举值来自变量，必须用 `as const` 保留字面量类型，否则推断会变宽为 `string`：
>
> ```typescript
> // ❌ 推断为 string[]，Color 变成 string
> const colors = ["red", "green", "blue"];
> const BadSchema = z.enum(colors);
>
> // ✅ 推断为 readonly ["red", "green", "blue"]，Color 是 "red" | "green" | "blue"
> const colors = ["red", "green", "blue"] as const;
> const GoodSchema = z.enum(colors);
> ```

### 14.9 联合类型与可辨识联合

`z.union` 对应 TS 的联合类型（`A | B`），验证时依次检查每个候选 schema，第一个通过的就返回：

```typescript
const IdSchema = z.union([z.string(), z.number()]);
IdSchema.parse(42);        // OK：匹配 number
IdSchema.parse("abc");     // OK：匹配 string
// IdSchema.parse(true);   // Error：boolean 不在联合中
```

`z.discriminatedUnion` 对应 TS 的可辨识联合（Discriminated Union），根据一个"判别字段"快速定位到正确的分支，比 `z.union` 更高效也更精确。第七章的 `Shape` 示例用 Zod 表达就是：

```typescript
const ResultSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.literal("error"), message: z.string() }),
]);

const result = ResultSchema.parse({ status: "success", data: "ok" });
// result 的类型被 TS 自动收窄——访问 data 时不需要额外检查
if (result.status === "success") {
  console.log(result.data);   // OK：TS 知道 data 存在
}
```

### 14.10 Transform 与默认值

`.transform()` 让你在验证通过后对数据进行转换——验证和变换在同一步完成。transform 的返回值类型会成为 schema 的新输出类型：

```typescript
// 验证是 string，然后返回其去空格后的长度（number）
const trimmedLength = z.string().transform((s: string) => s.trim().length);
trimmedLength.parse("  hello  ");  // 5（类型是 number，不是 string）
```

`.default()` 为 schema 指定默认值——当输入为 `undefined` 时，自动使用默认值而不是报错：

```typescript
const schema = z.string().default("hello");
schema.parse(undefined);  // "hello"——用默认值
schema.parse("world");    // "world"——用传入的值
```

`.nullish()` 是 `.nullable().optional()` 的简写，同时允许 `null`、`undefined` 和正常值。在处理可能为 null 的 API 响应时非常有用：

```typescript
const nullableSchema = z.string().nullish();
nullableSchema.parse(null);       // OK
nullableSchema.parse(undefined);  // OK
nullableSchema.parse("hi");       // OK
// nullableSchema.parse(42);      // Error：number 不是 string
```

### 14.11 实战：验证 API 响应

一个典型的使用场景：从外部 API 获取 JSON 数据，用 Zod 验证后安全使用：

```typescript
import { z } from "zod";

// 定义期望的数据结构
const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
});

type Post = z.infer<typeof PostSchema>;

// 模拟 API 调用
async function fetchPosts(): Promise<Post[]> {
  const res = await fetch("https://api.example.com/posts");
  const json = await res.json();

  // 用 Zod 验证整个数组
  return z.array(PostSchema).parse(json);
}
```

> **Zod 官方文档**：https://zod.dev/ —— 完整 API 参考与更多示例。

---

## 练习建议

TypeScript 学习的难点不是语法本身，而是读懂类型错误并理解类型系统的行为。以下是按章节组织的练习建议：

### 基础类型（第四章）
1. 写一个函数，接收 `string | number`，安全地将其转为字符串返回
2. 定义一个 `User` 类型，其中 `email` 可选，写一个函数安全地打印用户信息
3. 用字面量类型定义一个 `Direction` 类型，限定为 `"up" | "down" | "left" | "right"`

### 函数（第五章）
1. 写一个泛型函数 `firstElement<T>`，返回数组的第一个元素（可能为 `undefined`）
2. 用函数重载实现：传入 `string` 返回 `string`，传入 `number[]` 返回 `number`
3. 写一个接受回调的函数，体会上下文类型推断

### 类型收窄（第七章）
1. 用 `typeof` 和 `in` 收窄联合类型
2. 定义一个可辨识联合 `Shape`，用 `switch` 实现 `area` 函数
3. 用穷尽性检查确保处理了所有分支

### 常见报错及解决
| 报错信息 | 含义 | 解决方法 |
|---------|------|---------|
| `Type 'undefined' is not assignable to type 'X'` | 值可能是 `undefined` | 添加 `if (x !== undefined)` 检查 |
| `Object is possibly 'undefined'` | 对象属性可能不存在 | 用可选链 `?.` 或先检查 |
| `Property 'X' does not exist on type 'Y'` | 访问不存在的属性 | 检查拼写，或用类型守卫收窄 |
| `Argument of type 'X' is not assignable to parameter of type 'Y'` | 参数类型不匹配 | 检查函数签名，或用类型断言 |
| `No overload matches this call` | 函数重载都不匹配 | 检查参数类型和数量 |

---

## 附录 A：tsconfig.json 常用配置

### 前端应用项目（Vite/React/Vue）

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "noEmit": true,              // 由 Vite/esbuild 负责编译，TS 只做类型检查
    "jsx": "react-jsx",          // React JSX 支持（Vue 项目可省略）
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src"]
}
```

### Node.js / 库项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2020"],
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,         // 生成 .d.ts 声明文件（库项目必备）
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "types": ["node"]            // 显式指定 @types/node（TS 6.0 默认不自动包含）
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

> **选择建议**：用 Vite/Webpack/Parcel 等打包器 → 选 `bundler`；直接用 Node.js 运行 → 选 `nodenext`。详见附录 TS 6.0 变更说明。

> ⚠️ `noUncheckedIndexedAccess` 会让所有索引访问（如 `arr[i]`、`obj[key]`）的返回值类型自动包含 `undefined`。这很安全，但会使代码中频繁出现非空断言（`!`）或条件判断。初学者可以先关闭此选项，熟悉 TS 后再启用。

### 严格模式全家桶

```json
{
  "strict": true  // 相当于同时启用以下全部：
  // noImplicitAny: true
  // strictNullChecks: true
  // strictFunctionTypes: true
  // strictBindCallApply: true
  // strictPropertyInitialization: true
  // noImplicitThis: true
  // alwaysStrict: true
}
```

### TypeScript 6.0 主要变更（2026 年发布）

如果你使用 TypeScript 6.0+，以下编译选项默认值发生了变化：

| 选项 | 5.x 常见默认/行为 | 6.0 变化 | 建议 |
|------|-----------------|---------|------|
| `strict` | 默认 `false` | 默认 `true` | 新项目保留 `true` |
| `target` | 默认 `es3`（偏低） | 当前为 `es2025` | 生产项目仍建议显式写出 |
| `module` | 常需手动设置 | 默认 `esnext` | Node 项目单独考虑 `nodenext` |
| `esModuleInterop` | 默认 `false` | 始终启用，无法设为 `false` | 无需手动设置 |
| `moduleResolution` | `node/node10` 常见 | `node/node10` 已弃用 | Node 用 `nodenext`，Vite/Webpack 用 `bundler` |
| `types` | 自动包含所有 `@types` | 默认 `[]`（空） | `@types/node`、`@types/jest` 等需显式配置 |

> 这些变更主要是为了让新项目的默认行为更现代化。核心语法（类型注解、泛型、联合类型等）不受影响。

---

## 附录 B：实用工具类型

TypeScript 内置了一批实用工具类型：

```typescript
// Partial<T> —— 所有属性变为可选
interface User { name: string; age: number; email: string; }
type PartialUser = Partial<User>;
// { name?: string; age?: number; email?: string; }

// Required<T> —— 所有属性变为必选
type RequiredUser = Required<PartialUser>;

// Readonly<T> —— 所有属性变为只读
type ReadonlyUser = Readonly<User>;

// Pick<T, K> —— 仅保留指定的键
type UserName = Pick<User, "name" | "email">;
// { name: string; email: string; }

// Omit<T, K> —— 排除指定的键
type UserWithoutEmail = Omit<User, "email">;
// { name: string; age: number; }

// Record<K, T> —— 构造对象类型
type PageInfo = Record<"home" | "about" | "contact", { title: string }>;
// { home: { title: string }; about: { title: string }; contact: { title: string }; }

// Exclude<T, U> —— 从联合类型中排除
type T = Exclude<"a" | "b" | "c", "a" | "b">;  // "c"

// Extract<T, U> —— 从联合类型中提取
type T2 = Extract<"a" | "b" | "c", "a" | "f">;  // "a"

// NonNullable<T> —— 排除 null 和 undefined
type T3 = NonNullable<string | null | undefined>;  // string

// ReturnType<T> —— 获取函数返回值类型
type Fn = () => string | number;
type R = ReturnType<Fn>;  // string | number

// Parameters<T> —— 获取函数参数类型（元组）
type P = Parameters<(a: string, b: number) => void>;  // [string, number]

// Awaited<T> —— 获取 Promise 内部值的类型（TS 4.5+）
type PromiseResult = Awaited<Promise<string>>;  // string
type NestedResult = Awaited<Promise<Promise<number>>>;  // number
```

---

## 附录 C：在真实项目中使用 TS

### C.1 用 Node.js 开发

```bash
# 初始化项目
npm init -y
npm install -D typescript @types/node
npx tsc --init
```

### C.2 用 React 开发

```bash
# 使用 Vite 创建 React + TS 项目
npm create vite@latest my-app -- --template react-ts
```

### C.3 直接运行 TS（开发时）

```bash
# 方式 1：tsx（推荐——更快，零配置）
npm install -D tsx
npx tsx src/index.ts

# 方式 2：ts-node（经典方案）
npm install -D ts-node
npx ts-node src/index.ts
```

### C.4 包发布

```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"]
}
```

> `exports` 是 Node.js 现代模块解析的标准字段，支持 ESM 和 CJS 双轨发布。`main` 保留用于向后兼容旧版工具。

---

> 📖 本教程基于 TypeScript 官方文档（https://www.typescriptlang.org/docs/）整理编写。
> 建议配合 TypeScript Playground（https://www.typescriptlang.org/play/）练习。
