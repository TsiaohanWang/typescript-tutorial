#!/usr/bin/env python3
"""将 TypeScript教程.md 拆分为 VitePress 多页结构。

输出到 docs/：
  index.md          — 首页（头部信息 + 如何使用本教程 + 章节入口）
  ch01.md ... ch14.md
  exercises.md
  appendix-a.md / appendix-b.md / appendix-c.md
标题层级下移一级（## 章节 → # 页面标题；### → ##；#### → ###）。
"""
import re, os, unicodedata

SRC = "/home/wxh1104/Codespace/typescript-tutorial/TypeScript教程.md"
DOCS = "/home/wxh1104/Codespace/typescript-tutorial/docs"
os.makedirs(DOCS, exist_ok=True)

CN_NUM = {"一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9, "十": 10}

def ch_num(s):
    """'第一章' → 1，支持 十/十一/十二/十三/十四"""
    if s == "十":
        return 10
    if s.startswith("十"):
        return 10 + CN_NUM[s[1]]
    return CN_NUM[s[0]]

lines = open(SRC, encoding="utf-8").read().split("\n")

# 1) 扫描，把内容切成"段"：每段要么是头部（第一章前），要么对应一个 ## 标题
sections = []  # [(kind, title, content_lines)]
cur_title = None
cur_lines = []
in_fence = None

def flush():
    global cur_lines
    if cur_title is None:
        sections.append(("head", None, cur_lines))
    else:
        sections.append(("chapter", cur_title, ["# " + cur_title] + cur_lines))
    cur_lines = []

for ln in lines:
    m_fence = re.match(r"^\s*(```|~~~)", ln)
    if m_fence:
        if in_fence is None:
            in_fence = m_fence.group(1)
        elif in_fence == m_fence.group(1):
            in_fence = None
    if in_fence is None:
        m = re.match(r"^## (.+)$", ln)
        if m:
            flush()
            cur_title = m.group(1).strip()
            continue
    cur_lines.append(ln)
flush()

# 2) 确定每个 section 的目标文件
def target_file(title):
    if title is None:
        return "index.md"
    m = re.match(r"^第([一二三四五六七八九十]+)章", title)
    if m:
        return f"ch{ch_num(m.group(1)):02d}.md"
    if title.startswith("练习建议"):
        return "exercises.md"
    m = re.match(r"^附录 ([ABC])", title)
    if m:
        return f"appendix-{m.group(1).lower()}.md"
    if title.startswith("如何使用本教程"):
        return "index.md"  # 并入首页
    raise ValueError(f"无法映射标题: {title!r}")

# 3) 输出文件（合并到同一文件的多段按顺序拼接）
from collections import OrderedDict
out = OrderedDict()
for kind, title, content in sections:
    fname = target_file(title)
    body = content
    is_index_section = (fname == "index.md" and title is not None)
    # 标题层级下移一级（只处理围栏外的标题行；首页并入段的段首标题固定为 H2）
    shifted = []
    in_f = None
    for i, ln in enumerate(body):
        mf = re.match(r"^\s*(```|~~~)", ln)
        if mf:
            if in_f is None:
                in_f = mf.group(1)
            elif in_f == mf.group(1):
                in_f = None
        if in_f is None:
            m = re.match(r"^(#{1,5}) (.+)$", ln)
            if m:
                if is_index_section and i == 0:
                    ln = "## " + m.group(2)  # 首页并入段标题固定为 H2
                elif len(m.group(1)) >= 2:
                    ln = ln[1:]  # ## 章 → #; ### 节 → ##; #### 小节 → ###（整体降一级）
        shifted.append(ln)
    out.setdefault(fname, []).extend(shifted)

# 4) 写入文件，处理内容衔接（去除章节段首的 ---）
INDEX_EXTRA = """

## 开始学习

- **入门**：[第一章 开篇](/ch01) · [第二章 环境搭建](/ch02) · [第三章 JS 快速补课](/ch03) · [第四章 基础类型系统](/ch04)
- **核心**：[第五章 函数类型](/ch05) · [第六章 对象类型与接口](/ch06) · [第七章 类型收窄](/ch07) · [第八章 推导与断言](/ch08)
- **进阶**：[第九章 泛型](/ch09) · [第十章 类](/ch10) · [第十一章 模块系统](/ch11) · [第十二章 声明文件](/ch12)
- **提高**：[第十三章 高级类型（选读）](/ch13) · [第十四章 Zod 运行时验证](/ch14)
- **实践**：[练习建议](/exercises) · [附录 A tsconfig 配置](/appendix-a) · [附录 B 工具类型](/appendix-b) · [附录 C 真实项目实践](/appendix-c)

从 [第一章](/ch01) 开始，或者先看看[如何使用本教程](#如何使用本教程)规划学习路径。

"""
for fname, content in out.items():
    # 去掉每个文件开头/结尾的孤立 --- 分隔线
    while content and content[0].strip() == "---":
        content.pop(0)
    while content and content[-1].strip() == "---":
        content.pop()
    text = "\n".join(content).rstrip() + "\n"
    if fname == "index.md":
        text += INDEX_EXTRA
    with open(os.path.join(DOCS, fname), "w", encoding="utf-8") as f:
        f.write(text)
    print(f"{fname}: {len(content)} 行")

print("\n完成，共", len(out), "个文件")
