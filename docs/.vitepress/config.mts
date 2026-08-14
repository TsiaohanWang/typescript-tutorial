import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'TypeScript 系统教程',
  description: '从编程基础到工程实践 —— 面向有编程基础（Python/Java/C++）但未学过 JavaScript 学生的 TypeScript 教程',
  lang: 'zh-CN',
  // GitHub Pages 部署：仓库名作为 base
  base: '/typescript-tutorial/',
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/typescript-tutorial/favicon.svg' }],
  ],

  themeConfig: {
    logo: '/ts-logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '第一章', link: '/ch01' },
      { text: '练习建议', link: '/exercises' },
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
      {
        text: '入门',
        collapsed: false,
        items: [
          { text: '第一章 开篇', link: '/ch01' },
          { text: '第二章 环境搭建', link: '/ch02' },
          { text: '第三章 JS 快速补课', link: '/ch03' },
          { text: '第四章 基础类型系统', link: '/ch04' },
        ],
      },
      {
        text: '核心',
        collapsed: false,
        items: [
          { text: '第五章 函数类型', link: '/ch05' },
          { text: '第六章 对象类型与接口', link: '/ch06' },
          { text: '第七章 类型收窄', link: '/ch07' },
          { text: '第八章 推导与断言', link: '/ch08' },
        ],
      },
      {
        text: '进阶',
        collapsed: false,
        items: [
          { text: '第九章 泛型', link: '/ch09' },
          { text: '第十章 类', link: '/ch10' },
          { text: '第十一章 模块系统', link: '/ch11' },
          { text: '第十二章 声明文件', link: '/ch12' },
        ],
      },
      {
        text: '提高',
        collapsed: false,
        items: [
          { text: '第十三章 高级类型（选读）', link: '/ch13' },
          { text: '第十四章 Zod 运行时验证', link: '/ch14' },
        ],
      },
      {
        text: '练习与附录',
        collapsed: true,
        items: [
          { text: '练习建议', link: '/exercises' },
          { text: '附录 A tsconfig 配置', link: '/appendix-a' },
          { text: '附录 B 工具类型', link: '/appendix-b' },
          { text: '附录 C 真实项目实践', link: '/appendix-c' },
        ],
      },
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
      pattern: 'https://github.com/TsiaohanWang/typescript-tutorial/edit/master/TypeScript教程.md',
      text: '在 GitHub 上编辑本页',
    },
    externalLinkIcon: true,
  },
})
