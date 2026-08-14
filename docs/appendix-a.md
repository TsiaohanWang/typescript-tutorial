# 附录 A：tsconfig.json 常用配置

## 前端应用项目（Vite/React/Vue）

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

## Node.js / 库项目

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

> **选择建议**：用 Vite/Webpack/Parcel 等打包器 → 选 `bundler`；直接用 Node.js 运行 → 选 `nodenext`。详见附录 TS 6.0/7.0 变更说明。

> ⚠️ `noUncheckedIndexedAccess` 会让所有索引访问（如 `arr[i]`、`obj[key]`）的返回值类型自动包含 `undefined`。这很安全，但会使代码中频繁出现非空断言（`!`）或条件判断。初学者可以先关闭此选项，熟悉 TS 后再启用。

## 严格模式全家桶

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

## TypeScript 6.0 / 7.0 主要变更（2026 年发布）

TypeScript 6.0（2026 年发布）调整了部分编译选项的默认值；TypeScript 7.0（2026 年 7 月发布）是原生 Go 移植，编译速度提升 8–12 倍，并移除了 6.0 中弃用的选项。如果你从 5.x 升级，以下是主要变化：

| 选项 | 5.x 行为 | 6.0 变化 | 建议 |
|------|---------|---------|------|
| `strict` | 默认 `false` | 默认 `true`（无 tsconfig.json 时也开启） | 新项目保留 `true` |
| `target` | 默认 `es5`（偏低） | 默认 `es2025` | 生产项目仍建议显式写出 |
| `module` | 常需手动设置 | 默认 ESM 系列（跟随 target）；`tsc --init` 生成 `nodenext` | Node 项目单独考虑 `nodenext` |
| `esModuleInterop` | 默认 `false` | 始终启用，无法设为 `false` | 无需手动设置 |
| `moduleResolution` | `node`/`node10` 常见 | `node`/`node10` 已弃用（7.0 移除） | Node 用 `nodenext`，Vite/Webpack 用 `bundler` |
| `types` | 自动包含所有 `@types` | 默认 `[]`（空） | `@types/node`、`@types/jest` 等需显式配置 |

其他 6.0 变更：
- `target: "es5"`、`--downlevelIteration`、`--baseUrl`、`amd`/`umd`/`system` 模块格式等被弃用（7.0 移除）；`outFile` 在 6.0 直接移除，改用外部打包器
- `rootDir` 默认值改为 `.`
- 目录中存在 `tsconfig.json` 时，命令行指定文件（`tsc foo.ts`）会报错 `TS5112`，需加 `--ignoreConfig` 忽略配置
- 新增 `es2025` 的 `target`/`lib` 选项、`Temporal` 类型、`RegExp.escape` 等
- 旧式 `module Foo {}` 命名空间语法（应使用 `namespace`）变为硬错误；导入属性使用 `with` 取代 `asserts`

> 这些变更主要是为了让新项目的默认行为更现代化。核心语法（类型注解、泛型、联合类型等）不受影响。

---
