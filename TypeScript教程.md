# TypeScript 教程 —— 从编程基础到精通

> 适用读者：有编程基础（Python/Java/C++等），但未学过 JavaScript 的学生
> 参考来源：https://www.typescriptlang.org/docs/

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

**关键理解**：TypeScript 不是另一门语言，它是 JavaScript 的超集。几乎所有 JS 代码都是合法的 TS 代码（TS 默认启用 strict 模式，禁止了 `with` 等少量老旧语法）。TS 只是在 JS 之上增加了一层**类型系统**。

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
| 类型检查 | 运行时（duck typing） | 编译时（structural typing） |
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
# 全局安装 TypeScript 编译器
npm install -g typescript

# 验证安装
tsc --version
```

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
tsc hello.ts
```

运行后在同一目录下生成 `hello.js`。查看内容，你会发现类型注解被擦除了：

```javascript
function greet(person, date) {
  console.log("Hello ".concat(person, ", today is ").concat(date.toDateString(), "!"));
}
greet("Maddison", new Date());
```

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

### 3.1 变量声明：`let` 和 `const`

```typescript
let x = 10;    // 可变变量（对应其他语言的 var）
const y = 20;  // 不可变变量（对应 final/const）
```

- `let` 是块级作用域（block-scoped），类似于其他语言的局部变量
- `const` 也是块级作用域，且声明后不能重新赋值
- **不要使用 `var`**（它是函数级作用域，有 hoisting 问题，现代 JS 已弃用）

对比其他语言：

```typescript
// Java: int x = 10;
// Python: x = 10
// TS: let x: number = 10; （或简写为 let x = 10;，类型会自动推导）
```

### 3.2 基本类型

```typescript
const name: string = "Alice";
const age: number = 25;       // 没有 int/float 之分，都是 number
const isOk: boolean = true;   // 小写！不是 Boolean
const nothing: null = null;
const notDefined: undefined = undefined;
```

> ❗ **重要**：类型名是小写 `string`、`number`、`boolean`，不是 `String`、`Number`、`Boolean`。大写版本是特殊的内置类型，几乎用不到。

### 3.3 模板字符串（Template Literals）

用反引号 ` 代替引号，`${}` 嵌入表达式：

```typescript
const name = "World";
const greeting = `Hello ${name}, 2 + 3 = ${2 + 3}!`;
console.log(greeting); // Hello World, 2 + 3 = 5!
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

// 只有一个参数时可以省略括号
const double = (n: number): number => n * 2;
```

对比 Python: `lambda a, b: a + b`
对比 Java: `(a, b) -> a + b`

### 3.5 严格相等 `===`

JS 中有 `==` 和 `===` 两种相等运算符：

```typescript
// @ts-expect-error —— 不同类型比较在 strict 模式下会警告
5 == "5"    // true  （类型转换后比较）
// @ts-expect-error —— 同上
5 === "5"   // false （类型不同直接返回 false）
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
const user = { name: "Alice", age: 25 };
const { name, age } = user;      // 提取为同名的局部变量
console.log(name, age);

// 数组解构
const [first, second] = [10, 20, 30];
console.log(first, second);      // 10 20

// 函数参数解构
function greet({ name, age }: { name: string; age: number }) {
  console.log(`${name} is ${age} years old`);
}
```

---

## 第四章：基础类型系统

### 4.1 类型注解语法

TypeScript 中类型写在**变量/参数名后面**，用冒号分隔：

```typescript
// 变量注解
let name: string = "Alice";

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

> `object` 类型也是一个基础类型概念，它表示任何**非原始值**（不是 `string`/`number`/`boolean`/`bigint`/`symbol`/`null`/`undefined` 的值）。注意是 `object`（小写），不是 `Object`（大写）。

### 4.3 数组

```typescript
// 两种等价写法
const arr1: number[] = [1, 2, 3];
const arr2: Array<number> = [1, 2, 3];

// 多维数组
const matrix: number[][] = [[1, 2], [3, 4]];
```

### 4.4 `any` —— 逃生舱

```typescript
let value: any = 42;
value = "hello";     // 可以重新赋值为任何类型
value.toUpperCase(); // 不会报错（即使运行时可能出错）
```

`any` 关闭了所有类型检查，相当于回到纯 JS。**尽量避免使用**。

使用 `noImplicitAny` 编译选项可以阻止隐式的 `any`：

```json
// tsconfig.json
{
  "compilerOptions": {
    "noImplicitAny": true
  }
}
```

有了这个设置，如果 TS 无法推导出类型且你没有显式标注，就会报错。

### 4.5 `unknown` —— 安全的 any

```typescript
let value: unknown = 42;
value = "hello";

// 不能直接使用 unknown 类型的值 —— 必须先收窄类型
if (typeof value === "string") {
  console.log(value.toUpperCase()); // OK
}
```

### 4.6 `void`、`never` 和 `undefined`

```typescript
// void —— 函数不返回值
function log(msg: string): void {
  console.log(msg);
}

// never —— 函数永远不会返回（抛出异常或无限循环）
function throwError(msg: string): never {
  throw new Error(msg);
}

// undefined —— 未定义
function printName(name?: string): void {
  // name 可能是 string 或 undefined
}
```

### 4.7 `enum` —— 枚举类型

`enum` 是 TypeScript 提供的一组命名常量，允许你定义一组有限的可选值。与大多数 TS 特性不同，`enum` 不是纯类型层面的——编译后会生成真实的对象。

```typescript
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right,   // 3
}

// 数字枚举：可指定起始值
enum StatusCode {
  OK = 200,
  NotFound = 404,
  InternalError = 500,
}

// 字符串枚举
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

// 使用
function move(direction: Direction) {
  console.log(Direction[direction]); // 反向映射
}
move(Direction.Up);
```

**最佳实践**：`enum` 有运行时开销（会生成 JS 对象）。如果你只需要一组字面量常量，优先使用 `as const` + 联合类型：

```typescript
// 推荐方式（无运行时开销）
const Direction = { Up: 0, Down: 1, Left: 2, Right: 3 } as const;
type Direction = (typeof Direction)[keyof typeof Direction];
```

> 更多细节见官方 Enums 参考：https://www.typescriptlang.org/docs/handbook/enums.html

---

## 第五章：函数类型

### 5.1 参数类型和返回值类型

```typescript
// 完整注解
function greet(name: string, age: number): string {
  return `Hello, my name is ${name}, I'm ${age}`;
}
```

### 5.2 可选参数与默认参数

```typescript
// 可选参数（用 ?）
function greetOptional(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}`;   // ?? 是空值合并运算符
}

// 默认参数（和 JS 一样）
function greetDefault(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}`;
}

// 可选参数必须在必选参数之后
function f(a: string, b?: number, c?: boolean): void { }
```

> `??`（nullish coalescing）只在左操作数为 `null` 或 `undefined` 时返回右操作数。`||` 在左操作数为任何 falsy 值（`""`、`0`、`false`）时都会返回右操作数。

### 5.3 剩余参数

```typescript
function sum(...nums: number[]): number {
  return nums.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3); // 6
```

### 5.4 函数类型表达式

```typescript
// 将函数签名声明为类型
type GreetFn = (name: string, age: number) => string;

const greet: GreetFn = (name, age) => {
  return `Hi ${name}, age ${age}`;
};
```

### 5.5 回调函数的参数类型

```typescript
// 数组的 forEach 方法会自动推断回调参数的类型
const names = ["Alice", "Bob", "Eve"];
names.forEach((name) => {
  console.log(name.toUpperCase()); // name 自动推断为 string
});
```

这被称为**上下文类型**（contextual typing）—— TS 根据函数的调用上下文推断参数类型。

### 5.6 函数重载

```typescript
// 定义多个函数签名（只有声明，没有实现）
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;

// 实际实现
function makeDate(arg1: number, arg2?: number, arg3?: number): Date {
  if (arg2 !== undefined && arg3 !== undefined) {
    return new Date(arg1, arg2, arg3);
  }
  return new Date(arg1);
}

makeDate(1234567890);        // OK
makeDate(2024, 6, 30);       // OK
makeDate(2024, 6);           // Error: 没有匹配的重载
```

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

### 5.11 void 与 undefined 的区别

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
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any): number {
  return x.length;
}

len(Math.random() > 0.5 ? "hello" : [1, 2, 3]);
// Error——联合类型无法匹配到任何一个重载

// ✅ 使用联合类型参数
function len(x: string | any[]): number {
  return x.length;
}
len(Math.random() > 0.5 ? "hello" : [1, 2, 3]);  // OK
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

```typescript
// 直接内联注解
function printCoord(pt: { x: number; y: number }) {
  console.log(`x: ${pt.x}, y: ${pt.y}`);
}
```

### 6.2 可选属性

```typescript
function printName(obj: { first: string; last?: string }) {
  // 访问可选属性前需要检查 undefined
  console.log(obj.last?.toUpperCase());  // ?. 可选链（Optional Chaining）
  
  // 或者
  if (obj.last !== undefined) {
    console.log(obj.last.toUpperCase());
  }
}
```

> `?.` 是可选链运算符：如果 `obj.last` 是 `null` 或 `undefined`，表达式短路返回 `undefined`，不会抛出错误。

### 6.3 只读属性

```typescript
interface Point {
  readonly x: number;  // 只能在创建时赋值
  y: number;
}

const p: Point = { x: 10, y: 20 };
p.x = 5;  // Error: Cannot assign to 'x' because it is a read-only property
```

### 6.4 Type 别名

`type` 为类型起个名字，可以用在任何类型上（原始类型、联合类型、对象类型等）：

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

`interface` 是另一种命名对象类型的方式：

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
interface Animal { name: string; }
interface Bear extends Animal { honey: boolean; }

// Type 扩展
type Animal = { name: string; };
type Bear = Animal & { honey: boolean; };

// Interface 合并声明
interface Window { title: string; }
interface Window { ts: TypeScriptAPI; }  // OK：两个声明合并为一个

// Type 不可重复声明
type Window = { title: string; };
type Window = { ts: TypeScriptAPI; };  // Error：Duplicate identifier
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

处理完联合的所有变体后，剩余类型应该是 `never`（不可能发生）。用 `never` 做编译时检查：

```typescript
function assertNever(x: never): never {
  throw new Error("Unexpected value: " + x);
}

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
      return assertNever(shape);
  }
}

// 如果以后扩展 Shape：
// | { kind: "square"; side: number };
// TS 在 default 分支报错——提示你更新 area 函数
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
let name = "Alice";      // 自动推断为 string
let age = 25;             // 自动推断为 number
let isCool = true;        // 自动推断为 boolean
let items = [1, 2, 3];    // 自动推断为 number[]

// 函数返回值自动推断
function add(a: number, b: number) {
  return a + b;           // 自动推断返回类型为 number
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
const x = "hello" as number;  // Error
// 必须先转为 any/unknown
const x = "hello" as unknown as number;
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

`satisfies` 同时满足：
1. 检查值的类型是否符合约束
2. 保留最精确的推导类型

---

## 第九章：泛型（Generics）

### 9.1 为什么需要泛型

```typescript
// 没有泛型：只能写死一种类型
function identityNumber(arg: number): number { return arg; }
function identityString(arg: string): string { return arg; }

// 或用 any 丢失类型信息
function identityAny(arg: any): any { return arg; }
// 返回值类型也是 any —— 失去了类型保护
```

### 9.2 泛型函数

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// 显式指定类型参数
const output = identity<string>("hello");

// 类型参数由 TS 自动推断
const output2 = identity("hello");  // T 自动推断为 string
```

### 9.3 多个类型参数

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const p = pair("hello", 42);  // 类型为 [string, number]
```

### 9.4 泛型约束

```typescript
interface Lengthwise {
  length: number;
}

// T 必须包含 length 属性
function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello");      // OK：string 有 length
logLength([1, 2, 3]);    // OK：array 有 length
// logLength(42);        // Error：number 没有 length
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

### 9.6 泛型约束与条件类型的实用模式

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

```typescript
// 上面的 constructor 可以简写为：
class Animal {
  constructor(
    public name: string,
    private age: number,
    protected species: string
  ) {
    // 无需显式赋值，TS 自动创建同名属性
  }
}
```

### 10.4 `readonly`

```typescript
class Config {
  readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
}

// 或简写
class ConfigShort {
  constructor(readonly apiKey: string) { }
}
```

### 10.5 继承

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

### 10.6 抽象类

```typescript
abstract class Shape {
  abstract area(): number;       // 抽象方法：子类必须实现

  describe(): string {           // 具体方法
    return `Area: ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(public radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

### 10.7 implements 与 interface

```typescript
interface Runnable {
  run(): void;
}

interface Barkable {
  bark(): void;
}

class Dog implements Runnable, Barkable {
  run(): void { console.log("Running..."); }
  bark(): void { console.log("Woof!"); }
}
```

### 10.8 静态成员

```typescript
class Utils {
  static readonly PI = 3.14159;

  static max<T>(arr: T[]): T {
    return arr.reduce((a, b) => a > b ? a : b);
  }
}

console.log(Utils.PI);
console.log(Utils.max([1, 5, 3]));  // 5
```

---

## 第十一章：模块系统

### 11.1 导出与导入

```typescript
// math.ts
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
```

```typescript
// 以下为 math.ts 的内容（实际项目中放在单独文件中）
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

// 在 app.ts 中使用：
// import { PI, add, Calculator } from "./math";
console.log(add(PI, 2));
```

### 11.2 默认导出

```typescript
// 模拟 config.ts 的内容
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};

// 在 app.ts 中使用：
// import config from "./config";
console.log(config.apiUrl);
```

### 11.3 重命名导入/导出

```typescript
// 模拟 math.ts 的内容
function add(a: number, b: number): number {
  return a + b;
}

// 导入时重命名
// import { add as sum } from "./math";

// 导出时重命名
// export { add as sum };

// 统一导入所有
// import * as MathUtils from "./math";
// MathUtils.add(1, 2);

// 以上直接使用函数效果相同：
console.log(add(1, 2));
```

### 11.4 类型专用导入/导出

```typescript
// 模拟 types.ts 的内容
interface User {
  name: string;
  age: number;
}
type ID = number | string;

// 模拟 math.ts 的内容
function add(a: number, b: number): number {
  return a + b;
}

// app.ts —— 在单独文件中使用 import type：
// import type { User, ID } from "./types";
// import { add } from "./math";

// 类型检查示例（直接使用本地定义，效果相同）：
const user: User = { name: "Alice", age: 25 };
const id: ID = 42;
console.log(add(1, 2));
```

---

## 第十二章：高级类型概览（选读）

### 12.1 索引访问类型

```typescript
type Person = { name: string; age: number; address: { city: string } };

type NameType = Person["name"];     // string
type AgeType = Person["age"];       // number
type CityType = Person["address"]["city"];  // string

// 联合索引
type NameOrAge = Person["name" | "age"];  // string | number
```

### 12.2 `keyof` 类型操作符

```typescript
type Person = { name: string; age: number; email: string };
type PersonKeys = keyof Person;  // "name" | "age" | "email"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const p: Person = { name: "Alice", age: 25, email: "a@b.com" };
getProperty(p, "name");  // string
// getProperty(p, "invalid");  // Error
```

### 12.3 `typeof` 类型操作符

```typescript
const person = { name: "Alice", age: 25 };
type Person = typeof person;  // { name: string; age: number }
```

### 12.4 条件类型

```typescript
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"
```

### 12.5 映射类型

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
type OptionalPerson = Partial<Person>;
```

### 12.6 模板字面量类型

```typescript
type EventName = `on${Capitalize<string>}`;

type Events = "click" | "focus" | "blur";
type EventHandlers = `on${Capitalize<Events>}`;
// "onClick" | "onFocus" | "onBlur"
```

---

## 附录 A：tsconfig.json 常用配置

```json
{
  "compilerOptions": {
    "target": "ES2020",         // 编译目标版本
    "module": "ESNext",         // 模块系统
    "moduleResolution": "bundler",  // 模块解析策略
    "lib": ["ES2020", "DOM"],   // 环境类型库
    "outDir": "./dist",         // 输出目录
    "rootDir": "./src",         // 源码目录
    "strict": true,             // 启用所有严格检查
    "noUncheckedIndexedAccess": true, // 索引访问返回 T | undefined
    "esModuleInterop": true,    // 兼容 CommonJS 和 ES Module
    "skipLibCheck": true,       // 跳过声明文件检查（加速编译）
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,  // 允许导入 JSON 文件
    "declaration": true,        // 生成 .d.ts 声明文件
    "declarationMap": true,     // 为声明文件生成 sourcemap
    "sourceMap": true           // 生成 .js.map（调试用）
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

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

### C.3 用 ts-node 直接运行 TS（开发时）

```bash
npm install -D ts-node
npx ts-node src/index.ts
```

### C.4 包发布

```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"]
}
```

---

> 📖 本教程基于 TypeScript 官方文档（https://www.typescriptlang.org/docs/）整理编写。
> 建议配合 TypeScript Playground（https://www.typescriptlang.org/play/）练习。
