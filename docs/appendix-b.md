# 附录 B：实用工具类型

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
