# 附录 C：在真实项目中使用 TS

## C.1 用 Node.js 开发

```bash
# 初始化项目
npm init -y
npm install -D typescript @types/node
npx tsc --init
```

## C.2 用 React 开发

```bash
# 使用 Vite 创建 React + TS 项目
npm create vite@latest my-app -- --template react-ts
```

## C.3 直接运行 TS（开发时）

```bash
# 方式 1：tsx（推荐——更快，零配置）
npm install -D tsx
npx tsx src/index.ts

# 方式 2：ts-node（经典方案）
npm install -D ts-node
npx ts-node src/index.ts
```

## C.4 包发布

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
