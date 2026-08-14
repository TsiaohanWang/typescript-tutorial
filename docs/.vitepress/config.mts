import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'TypeScript 系统教程',
  description: '从编程基础到工程实践 —— 面向有编程基础（Python/Java/C++）但未学过 JavaScript 学生的 TypeScript 教程',
  lang: 'zh-CN',
  // GitHub Pages 部署：仓库名作为 base
  base: '/typescript-tutorial/',
  lastUpdated: true,

  // 关闭裸 URL 自动转链接（linkify），URL 以纯文本显示
  markdown: {
    linkify: false,
  },

  head: [
    ['link', { rel: 'icon', href: '/typescript-tutorial/favicon.svg' }],
  ],

  themeConfig: {
    logo: '/ts-logo.svg',
    nav: [
      { text: '首页', link: '/' },
      {
        text: '目录',
        items: [
          {
            text: '入门',
            items: [
              { text: '第一章 开篇', link: '/ch01' },
              { text: '第二章 环境搭建', link: '/ch02' },
              { text: '第三章 JS 快速补课', link: '/ch03' },
              { text: '第四章 基础类型系统', link: '/ch04' },
            ],
          },
          {
            text: '核心',
            items: [
              { text: '第五章 函数类型', link: '/ch05' },
              { text: '第六章 对象类型与接口', link: '/ch06' },
              { text: '第七章 类型收窄', link: '/ch07' },
              { text: '第八章 推导与断言', link: '/ch08' },
            ],
          },
          {
            text: '进阶',
            items: [
              { text: '第九章 泛型', link: '/ch09' },
              { text: '第十章 类', link: '/ch10' },
              { text: '第十一章 模块系统', link: '/ch11' },
              { text: '第十二章 声明文件', link: '/ch12' },
            ],
          },
          {
            text: '提高',
            items: [
              { text: '第十三章 高级类型（选读）', link: '/ch13' },
              { text: '第十四章 Zod 运行时验证', link: '/ch14' },
            ],
          },
          {
            text: '实践',
            items: [
              { text: '练习建议', link: '/exercises' },
              { text: '附录 A tsconfig 配置', link: '/appendix-a' },
              { text: '附录 B 工具类型', link: '/appendix-b' },
              { text: '附录 C 真实项目实践', link: '/appendix-c' },
            ],
          },
        ],
      },
      {
        text: '参考',
        items: [
          { text: 'TypeScript 官方文档', link: 'https://www.typescriptlang.org/docs/' },
          { text: 'TypeScript Playground', link: 'https://www.typescriptlang.org/play/' },
          { text: 'Zod 官方文档', link: 'https://zod.dev/' },
        ],
      },
    ],

    sidebar: [
      { text: "入门", collapsed: false, items: [
        { text: "第一章 开篇", collapsed: true, items: [
          { text: "JavaScript 的困局", link: "/ch01#javascript-的困局" },
          { text: "TypeScript 的解决思路", link: "/ch01#typescript-的解决思路" },
          { text: "类型 vs. 其他语言的对比", link: "/ch01#类型-vs-其他语言的对比" },
          { text: "核心原则", link: "/ch01#核心原则" },
          { text: "本章练习", link: "/ch01#本章练习" },
        ] },
        { text: "第二章 环境搭建", collapsed: true, items: [
          { text: "安装", link: "/ch02#安装" },
          { text: "第一个程序", link: "/ch02#第一个程序" },
          { text: "编译选项", link: "/ch02#编译选项" },
          { text: "tsconfig.json —— 项目级配置", link: "/ch02#tsconfig-json-——-项目级配置" },
          { text: "VSCode 编辑器支持", link: "/ch02#vscode-编辑器支持" },
          { text: "本章练习", link: "/ch02#本章练习" },
        ] },
        { text: "第三章 JS 快速补课", collapsed: true, items: [
          { text: "前置知识：JS 特有的概念", link: "/ch03#前置知识-js-特有的概念" },
          { text: "变量声明：let 和 const", link: "/ch03#变量声明-let-和-const" },
          { text: "基本类型", link: "/ch03#基本类型" },
          { text: "模板字符串（Template Literals）", link: "/ch03#模板字符串-template-literals" },
          { text: "箭头函数", link: "/ch03#箭头函数" },
          { text: "严格相等 ===", link: "/ch03#严格相等" },
          { text: "对象字面量", link: "/ch03#对象字面量" },
          { text: "数组", link: "/ch03#数组" },
          { text: "解构赋值", link: "/ch03#解构赋值" },
          { text: "本章练习", link: "/ch03#本章练习" },
        ] },
        { text: "第四章 基础类型系统", collapsed: true, items: [
          { text: "类型注解语法", link: "/ch04#类型注解语法" },
          { text: "原始类型", link: "/ch04#原始类型" },
          { text: "object 类型", link: "/ch04#object-类型" },
          { text: "数组", link: "/ch04#数组" },
          { text: "联合类型（Union Types）", link: "/ch04#联合类型-union-types" },
          { text: "类型别名（Type Aliases）", link: "/ch04#类型别名-type-aliases" },
          { text: "any —— 逃生舱", link: "/ch04#any-——-逃生舱" },
          { text: "unknown —— 安全的 any", link: "/ch04#unknown-——-安全的-any" },
          { text: "void、never 和 undefined", link: "/ch04#void、never-和-undefined" },
          { text: "字面量类型（Literal Types）", link: "/ch04#字面量类型-literal-types" },
          { text: "as const —— 断言字面量类型", link: "/ch04#as-const-——-断言字面量类型" },
          { text: "enum —— 枚举类型", link: "/ch04#enum-——-枚举类型" },
          { text: "本章练习", link: "/ch04#本章练习" },
        ] },
      ] },
      { text: "核心", collapsed: false, items: [
        { text: "第五章 函数类型", collapsed: true, items: [
          { text: "参数类型和返回值类型", link: "/ch05#参数类型和返回值类型" },
          { text: "可选参数与默认参数", link: "/ch05#可选参数与默认参数" },
          { text: "剩余参数", link: "/ch05#剩余参数" },
          { text: "函数类型表达式", link: "/ch05#函数类型表达式" },
          { text: "回调函数的参数类型", link: "/ch05#回调函数的参数类型" },
          { text: "函数重载", link: "/ch05#函数重载" },
          { text: "调用签名（Call Signatures）", link: "/ch05#调用签名-call-signatures" },
          { text: "构造签名（Construct Signatures）", link: "/ch05#构造签名-construct-signatures" },
          { text: "泛型函数（Generic Functions）", link: "/ch05#泛型函数-generic-functions" },
          { text: "回调函数的参数最佳实践", link: "/ch05#回调函数的参数最佳实践" },
          { text: "void 与 undefined 的区别", link: "/ch05#void-与-undefined-的区别" },
          { text: "函数重载的编写指南", link: "/ch05#函数重载的编写指南" },
          { text: "剩余参数与展开（Rest / Spread）", link: "/ch05#剩余参数与展开-rest-spread" },
          { text: "参数解构的类型注解", link: "/ch05#参数解构的类型注解" },
          { text: "async 函数与 Promise 类型", link: "/ch05#async-函数与-promise-类型" },
          { text: "声明 this 的类型", link: "/ch05#声明-this-的类型" },
          { text: "本章练习", link: "/ch05#本章练习" },
        ] },
        { text: "第六章 对象类型与接口", collapsed: true, items: [
          { text: "对象类型注解", link: "/ch06#对象类型注解" },
          { text: "可选属性", link: "/ch06#可选属性" },
          { text: "只读属性", link: "/ch06#只读属性" },
          { text: "Type 别名", link: "/ch06#type-别名" },
          { text: "Interface 声明", link: "/ch06#interface-声明" },
          { text: "type vs interface：关键差异", link: "/ch06#type-vs-interface-关键差异" },
          { text: "索引签名", link: "/ch06#索引签名" },
          { text: "多余属性检查（Excess Property Checks）", link: "/ch06#多余属性检查-excess-property-checks" },
          { text: "扩展类型（Extending Types）", link: "/ch06#扩展类型-extending-types" },
          { text: "交叉类型（Intersection Types）", link: "/ch06#交叉类型-intersection-types" },
          { text: "泛型对象类型", link: "/ch06#泛型对象类型" },
          { text: "元组类型（Tuple Types）", link: "/ch06#元组类型-tuple-types" },
          { text: "本章练习", link: "/ch06#本章练习" },
        ] },
        { text: "第七章 类型收窄", collapsed: true, items: [
          { text: "联合类型", link: "/ch07#联合类型" },
          { text: "类型收窄（Narrowing）概述", link: "/ch07#类型收窄-narrowing-概述" },
          { text: "可辨识联合（Discriminated Union）", link: "/ch07#可辨识联合-discriminated-union" },
          { text: "穷尽性检查（Exhaustiveness Checking）与 never", link: "/ch07#穷尽性检查-exhaustiveness-checking-与-never" },
          { text: "字面量类型", link: "/ch07#字面量类型" },
          { text: "字面量推断问题", link: "/ch07#字面量推断问题" },
          { text: "本章练习", link: "/ch07#本章练习" },
        ] },
        { text: "第八章 推导与断言", collapsed: true, items: [
          { text: "类型推导", link: "/ch08#类型推导" },
          { text: "类型断言（Type Assertions）", link: "/ch08#类型断言-type-assertions" },
          { text: "@ts-expect-error —— 抑制类型错误", link: "/ch08#ts-expect-error-——-抑制类型错误" },
          { text: "非空断言（Non-null Assertion !）", link: "/ch08#非空断言-non-null-assertion" },
          { text: "satisfies 运算符", link: "/ch08#satisfies-运算符" },
          { text: "本章练习", link: "/ch08#本章练习" },
        ] },
      ] },
      { text: "进阶", collapsed: false, items: [
        { text: "第九章 泛型", collapsed: true, items: [
          { text: "为什么需要泛型", link: "/ch09#为什么需要泛型" },
          { text: "泛型函数", link: "/ch09#泛型函数" },
          { text: "多个类型参数", link: "/ch09#多个类型参数" },
          { text: "泛型约束", link: "/ch09#泛型约束" },
          { text: "泛型接口与泛型别名", link: "/ch09#泛型接口与泛型别名" },
          { text: "泛型类", link: "/ch09#泛型类" },
          { text: "泛型约束与条件类型的实用模式", link: "/ch09#泛型约束与条件类型的实用模式" },
          { text: "本章练习", link: "/ch09#本章练习" },
        ] },
        { text: "第十章 类", collapsed: true, items: [
          { text: "基本语法", link: "/ch10#基本语法" },
          { text: "可见性修饰符", link: "/ch10#可见性修饰符" },
          { text: "参数属性简写", link: "/ch10#参数属性简写" },
          { text: "readonly", link: "/ch10#readonly" },
          { text: "存取器（Getters / Setters）", link: "/ch10#存取器-getters-setters" },
          { text: "private vs #（硬私有）", link: "/ch10#private-vs-硬私有" },
          { text: "继承", link: "/ch10#继承" },
          { text: "抽象类", link: "/ch10#抽象类" },
          { text: "implements 与 interface", link: "/ch10#implements-与-interface" },
          { text: "静态成员", link: "/ch10#静态成员" },
          { text: "装饰器（Decorators）简介", link: "/ch10#装饰器-decorators-简介" },
          { text: "本章练习", link: "/ch10#本章练习" },
        ] },
        { text: "第十一章 模块系统", collapsed: true, items: [
          { text: "导出与导入", link: "/ch11#导出与导入" },
          { text: "默认导出", link: "/ch11#默认导出" },
          { text: "重命名导入/导出", link: "/ch11#重命名导入-导出" },
          { text: "类型专用导入/导出", link: "/ch11#类型专用导入-导出" },
          { text: "CommonJS 与 ES Module 的互操作", link: "/ch11#commonjs-与-es-module-的互操作" },
          { text: "本章练习", link: "/ch11#本章练习" },
        ] },
        { text: "第十二章 声明文件", collapsed: true, items: [
          { text: "什么是声明文件（.d.ts）", link: "/ch12#什么是声明文件-d-ts" },
          { text: "DefinitelyTyped 与 @types", link: "/ch12#definitelytyped-与-types" },
          { text: "自己编写声明文件", link: "/ch12#自己编写声明文件" },
          { text: "三斜线指令（Triple-Slash Directives）", link: "/ch12#三斜线指令-triple-slash-directives" },
          { text: "本章练习", link: "/ch12#本章练习" },
        ] },
      ] },
      { text: "提高", collapsed: false, items: [
        { text: "第十三章 高级类型（选读）", collapsed: true, items: [
          { text: "索引访问类型", link: "/ch13#索引访问类型" },
          { text: "keyof 类型操作符", link: "/ch13#keyof-类型操作符" },
          { text: "typeof 类型操作符", link: "/ch13#typeof-类型操作符" },
          { text: "条件类型", link: "/ch13#条件类型" },
          { text: "映射类型", link: "/ch13#映射类型" },
          { text: "模板字面量类型", link: "/ch13#模板字面量类型" },
          { text: "本章练习", link: "/ch13#本章练习" },
        ] },
        { text: "第十四章 Zod 运行时验证", collapsed: true, items: [
          { text: "为什么需要 Zod", link: "/ch14#为什么需要-zod" },
          { text: "安装与基本用法", link: "/ch14#安装与基本用法" },
          { text: "错误处理", link: "/ch14#错误处理" },
          { text: "从 Schema 推断 TypeScript 类型", link: "/ch14#从-schema-推断-typescript-类型" },
          { text: "常用 Schema 类型", link: "/ch14#常用-schema-类型" },
          { text: "字符串验证", link: "/ch14#字符串验证" },
          { text: "数字验证", link: "/ch14#数字验证" },
          { text: "对象、数组与枚举", link: "/ch14#对象、数组与枚举" },
          { text: "联合类型与可辨识联合", link: "/ch14#联合类型与可辨识联合" },
          { text: "Transform 与默认值", link: "/ch14#transform-与默认值" },
          { text: "实战：验证 API 响应", link: "/ch14#实战-验证-api-响应" },
          { text: "本章练习", link: "/ch14#本章练习" },
        ] },
      ] },
      { text: "练习与附录", collapsed: false, items: [
        { text: "练习建议", collapsed: true, items: [
          { text: "基础类型（第四章）", link: "/exercises#基础类型-第四章" },
          { text: "函数（第五章）", link: "/exercises#函数-第五章" },
          { text: "类型收窄（第七章）", link: "/exercises#类型收窄-第七章" },
          { text: "常见报错及解决", link: "/exercises#常见报错及解决" },
        ] },
        { text: "附录 A tsconfig 配置", collapsed: true, items: [
          { text: "前端应用项目（Vite/React/Vue）", link: "/appendix-a#前端应用项目-vite-react-vue" },
          { text: "Node.js / 库项目", link: "/appendix-a#node-js-库项目" },
          { text: "严格模式全家桶", link: "/appendix-a#严格模式全家桶" },
          { text: "TypeScript 6.0 / 7.0 主要变更（2026 年发布）", link: "/appendix-a#typescript-6-0-7-0-主要变更-2026-年发布" },
        ] },
        { text: "附录 B 工具类型", link: "/appendix-b" },
        { text: "附录 C 真实项目实践", collapsed: true, items: [
          { text: "C.1 用 Node.js 开发", link: "/appendix-c#c-1-用-node-js-开发" },
          { text: "C.2 用 React 开发", link: "/appendix-c#c-2-用-react-开发" },
          { text: "C.3 直接运行 TS（开发时）", link: "/appendix-c#c-3-直接运行-ts-开发时" },
          { text: "C.4 包发布", link: "/appendix-c#c-4-包发布" },
        ] },
      ] },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除搜索条件',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },

    docFooter: { prev: '上一页', next: '下一页' },
    outline: { label: '本页目录', level: [2, 3] },
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    lastUpdated: { text: '最后更新', formatOptions: { dateStyle: 'short', timeStyle: 'short' } },
    editLink: {
      pattern: 'https://github.com/TsiaohanWang/typescript-tutorial/edit/master/docs/:path',
      text: '在 GitHub 上编辑本页',
    },
    externalLinkIcon: true,
  },
})
