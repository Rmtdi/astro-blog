# 轻音少女主题博客 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 astro-theme-reimu 改造为轻音少女 × 双叶理央主题的个人博客，支持 Obsidian 写作流程

**Architecture:** 保持现有组件结构不变，只修改 CSS 变量定义和几个关键组件。配色通过 `:root` CSS 变量统一控制，各处引用 `var(--red-*)` 的地方全部改为新色值。内容结构：`content/blog/` 按文件夹分类，`content/drafts/` 存放草稿（天然被 glob loader 排除）。关于我页面新建独立 Astro 路由。

**Tech Stack:** Astro 5, TypeScript, Stylus, CSS Variables, Font Awesome, React (ToTop/搜索等)

## Global Constraints

- 不修改代码块/Expressive Code 配置
- 不修改评论系统代码
- 不修改 Sidebar 结构和 widgets
- 不修改 RSS/sitemap 配置
- 不修改文章路由逻辑（`[...slug].astro`）
- 不删除任何文件，只修改和新增
- 所有修改可逆，用户可以随时恢复

---

### Task 1: 创建内容目录结构

**Files:**
- Create: `content/blog/`（如果不存在）
- Create: `content/drafts/`（如果不存在）
- Modify: 不需要修改代码，仅目录操作

- [ ] **Step 1: 创建 blog 和 drafts 目录**

```bash
cd "D:/Blogs/astro-blog"
mkdir -p content/blog content/drafts
```

- [ ] **Step 2: 将旧博客文章移入 content/blog/**

旧博客在 `D:\Blogs\RBlog\source\_posts\`，目录结构为：
```
source/_posts/
├── essay/
│   └── first.md
├── images/
├── notes/
│   ├── hexo/
│   ├── remember.md
│   └── writing/
├── novels/
├── other/
├── problem&solution/
└── tools/
```

直接复制到新博客：
```bash
cp -r "D:/Blogs/RBlog/source/_posts/"* "D:/Blogs/astro-blog/content/blog/"
```

- [ ] **Step 3: 验证 content.config.ts 的 loader 路径正确**

打开 `src/content.config.ts`，确认 blog collection 的 loader 配置：
```ts
const blog = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: "./src/content/blog",  // ← 确认这里是 ./src/content/blog
  }),
  // ...
});
```
**不需要改任何代码。** loader 的 base 是 `./src/content/blog`，所以 `content/drafts/` 不在扫描范围内。

- [ ] **Step 4: 验证文章可以正确渲染**

启动开发服务器检查：
```bash
cd "D:/Blogs/astro-blog"
npm run dev
```
访问 `http://localhost:4321/blog/essay/first`（或对应路径），确认文章正常显示。

---

### Task 2: 修改全局配色（核心改动）

**Files:**
- Modify: `src/styles/global.css:1-36`

**涉及改动说明：**
- 所有红色系 CSS 变量改为黄绿色系
- 所有引用 `var(--red-*)` 的地方通过 CSS 变量定义自动生效，**不需要逐一改每个组件**
- 如果某个组件写了硬编码色值（如 `#ff5252`），才需要单独改

**开始实施：**

- [ ] **Step 1: 打开 `src/styles/global.css`，修改 `:root` 中的红色变量**

找到第 1-36 行，把 `:root` 块替换为：

```css
:root {
  --red-0: #5c7a32;        /* 深抹茶绿（原来 #ff0000） */
  --red-1: #7d9b4e;        /* 抹茶绿主色（原来 #ff5252） */
  --red-2: #9fb87a;        /* 浅抹茶绿（原来 #ff7c7c） */
  --red-3: #c4d9a8;        /* 更浅的黄绿（原来 #ffafaf） */
  --red-4: #e2edce;        /* 淡黄绿（原来 #ffd0d0） */
  --red-5: #f0f2e5;        /* 极浅黄绿（原来 #ffecec） */
  --red-5-5: #f5f7ed;      /* （原来 #fff3f3） */
  --red-6: #fafbf5;        /* 最浅（原来 #fff7f7） */
  --color-red-6-shadow: rgba(125, 155, 78, 0.6);  /* 阴影改抹茶绿 */
  --color-red-3-shadow: rgba(125, 155, 78, 0.3);
  --grey-9: #888;
  --grey-7: var(--color-default);

  --color-archive-year: black;
  --color-default: #444;
  --color-border: var(--red-3);
  --color-link: var(--red-1);
  --color-background: #fdfaf3;        /* 奶白背景 */
  --color-code-background: #f8f8f8;
  --color-header-background: rgba(253, 250, 243, 0.9);  /* 奶白透明 */
  --color-footer-background: #fffbf5;  /* 暖白 */
  --color-mobile-nav-background: #fffbf5;
  --color-wrap: #fffbf5;              /* 卡片背景暖白 */

  --color-h2-border: #eee;
  --color-meta-shadow: var(--red-6);
  --color-hover-shadow: rgba(120, 120, 120, 0.15);
  --color-h2-after: var(--red-1);

  --shadow-meta: 0 0 5px 2px var(--color-meta-shadow);
  --shadow-meta-hover: 0 0 6px 4px var(--color-meta-shadow);
  --shadow-card: 0 0 10px 2px var(--color-hover-shadow);
  --shadow-card-hover: 0 0 10px 4px var(--color-hover-shadow);
  --shadow-red-6-shadow: 0 0 8px var(--color-red-6-shadow);
}
```

- [ ] **Step 2: 修改暗色模式的红色变量**

在同一个文件中找到 `[data-theme="dark"]:root` 块（第 38-61 行），替换为：

```css
[data-theme="dark"]:root {
  --red-0: var(--red-1);
  --red-4: rgba(194, 217, 168, .5);    /* 黄绿色调 */
  --red-5: rgba(240, 242, 229, .15);
  --red-5-5: rgba(245, 247, 237, .05);
  --red-6: rgba(250, 251, 245, .2);

  --color-archive-year: #999;
  --color-default: #999;
  --color-border: var(--red-5);
  --color-background: #21252b;
  --color-code-background: rgba(232, 232, 232, 0.2);
  --color-header-background: #222222;
  --color-footer-background: #21252b;
  --color-mobile-nav-background: #21252b;
  --color-wrap: #272b30;

  --color-h2-border: #47474a;
  --color-meta-shadow: rgba(0, 0, 0, 0.2);
  --color-hover-shadow: rgba(0, 0, 0, 0.2);

  img {
    filter: brightness(70%);
  }
}
```

- [ ] **Step 3: 修改 `::selection` 背景色**

同一文件中找到第 207-210 行：
```css
::selection {
  background: var(--red-1);  /* 抹茶绿选中，不用改 */
  color: #fff;
}
```
==这一步不需要改==。

- [ ] **Step 4: 修改滚动条颜色**

同一文件中找到第 269-271 行，把 `var(--red-3)` 改成新色：
```css
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: var(--red-3);  /* 自动变成黄绿色，不用改 */
}
```
==这一步不需要改==，因为 `--red-3` 已经变了。

- [ ] **Step 5: 启动开发服务器，检查全局颜色**

```bash
npm run dev
```
观察：链接色、边框色、选中色、h2 下划线、滚动条等已变为黄绿色调。

---

### Task 3: 修改 Preloader：随机角色祈祷

**Files:**
- Modify: `src/config.ts`
- Modify: `src/utils/config.ts:148`
- Modify: `src/components/partial/Loader.astro`

- [ ] **Step 1: 修改 `src/config.ts` 中的 preloader text**

打开 `src/config.ts`，找到 preloader 配置（第 191-196 行左右），把 `text` 改成数组：

```ts
preloader: {
  enable: true,
  text: [
    "呆唯祈祷中...",
    "律祈祷中...",
    "澪祈祷中...",
    "紬祈祷中...",
    "梓祈祷中...",
  ],
  rotate: true,
},
```

- [ ] **Step 2: 修改类型定义，允许 text 为数组**

打开 `src/utils/config.ts`，找到第 146-150 行的 `PreloaderConfig` 接口：

```ts
export interface PreloaderConfig {
  enable: boolean;
  text: string;       // ← 改成 string | string[]
  rotate: boolean;
}
```

改成：

```ts
export interface PreloaderConfig {
  enable: boolean;
  text: string | string[];
  rotate: boolean;
}
```

- [ ] **Step 3: 修改 Loader.astro 随机选取文本**

打开 `src/components/partial/Loader.astro`，在 frontmatter（`---` 块内，第 2 行 `import` 之后）添加：

```astro
---
import { PRELOADER } from "../../utils/config";

// 新增：随机取 preloader 文本
const preloaderText = Array.isArray(PRELOADER.text)
  ? PRELOADER.text[Math.floor(Math.random() * PRELOADER.text.length)]
  : PRELOADER.text;
---
```

然后找到第 28 行，把：
```astro
<div class="loading-word">{PRELOADER.text}</div>
```
改成：
```astro
<div class="loading-word">{preloaderText}</div>
```

- [ ] **Step 4: 修改太极 SVG 颜色为黄绿**

在同一文件 Loader.astro 中，找到第 21 行和第 25 行的 `fill="var(--red-1, #ff5252)"`，把 fallback `#ff5252` 去掉：

```html
fill="var(--red-1)"></path>
```

因为 `--red-1` 已经是黄绿色了，不需要 fallback。**不改也能用**（变量会覆盖 fallback），但你如果想清理可以改。

- [ ] **Step 5: 修改 Loader.astro 中文字颜色**

找到第 61 行（暗色模式下的 loading-word 颜色）和第 94 行（word 颜色），**不用改**，因为它们用的 `var(--red-1)`，已经变为黄绿色。

- [ ] **Step 6: 验证**

```bash
npm run dev
```
刷新页面，观察：
- Preloader 显示的文字是否从 5 个角色中随机取
- 文字颜色是黄绿色

---

### Task 4: 处理烟花效果

**Files:**
- Modify: `src/config.ts`

**方案选 A（推荐）：关掉烟花，加静态音符装饰**

- [ ] **Step 1: 关掉烟花**

打开 `src/config.ts`，找到 firework 配置（第 198-236 行左右），把 `enable` 改成 `false`：

```ts
firework: {
  enable: false,
  // 其余保持不变
},
```

- [ ] **Step 2: 在 Footer 添加静态音符装饰（可选）**

打开 `src/components/AfterFooter.astro`，在页脚版权信息之后（约第 40-50 行的位置），添加 HTML：

```html
<!-- 音符装饰 -->
<div class="music-notes">♪ ♫ ♪ ♩ ♬ ♪ ♫</div>

<style>
  .music-notes {
    text-align: center;
    color: var(--red-1);
    font-size: 20px;
    letter-spacing: 8px;
    opacity: 0.5;
    padding: 10px 0;
    user-select: none;
  }
</style>
```

---

### Task 5: 替换 ToTop 太极图为茶杯

**Files:**
- Modify: `src/components/partial/ToTop.tsx`

- [ ] **Step 1: 打开 ToTop 组件**

路径：`src/components/partial/ToTop.tsx`

当前代码（第 1-44 行）：
```tsx
import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

import "../../styles/top.stylus";

export default function ToTop({ imageUrl }: { imageUrl: string }) {
  // ...
  return (
    <div className="sidebar-top" onClick={handleClick} style={{ opacity }}>
      <img src={imageUrl} height={50} width={50} alt="backtop" />
      <FontAwesomeIcon icon={faArrowUp} className="arrow-up" />
    </div>
  );
}
```

- [ ] **Step 2: 导入茶杯图标**

在 `import { faArrowUp }` 那行加上 `faMugHot`：

```tsx
import { faArrowUp, faMugHot } from "@fortawesome/free-solid-svg-icons";
```

- [ ] **Step 3: 替换 img 为茶杯图标**

把 `<img>` 替换为 FontAwesome 茶杯图标：

```tsx
return (
  <div className="sidebar-top" onClick={handleClick} style={{ opacity }}>
    <FontAwesomeIcon icon={faMugHot} className="mug-icon" />
    <FontAwesomeIcon icon={faArrowUp} className="arrow-up" />
  </div>
);
```

- [ ] **Step 4: 修改 top.stylus 样式适应茶杯图标**

打开 `src/styles/top.stylus`，在已有样式末尾添加茶杯图标样式。**注意**：原来的 `img` 选择器指向 `<img>` 标签，现在换成 `<svg>`（FontAwesome 图标），需要对应修改 CSS。

当前代码（第 16-31 行）：
```stylus
img {
  transition: .3s;
  animation: rotate-all 3s linear infinite;
  opacity: 1;
}

.arrow-up {
  position: absolute;
  left: 10px;
  top: 10px;
  transition: .3s;
  opacity: 0;
  width: 30px;
  height: 30px;
  color: var(--red-1);
  text-align: center;
}
```

修改为：
```stylus
.mug-icon {
  transition: .3s;
  animation: rotate-all 3s linear infinite;
  opacity: 1;
  position: absolute;
  left: 10px;
  top: 10px;
  width: 30px;
  height: 30px;
  color: var(--red-1);
  text-align: center;
}

.arrow-up {
  position: absolute;
  left: 10px;
  top: 10px;
  transition: .3s;
  opacity: 0;
  width: 30px;
  height: 30px;
  color: var(--red-1);
  text-align: center;
}
```

同时也把 hover 时的 CSS 改一下（第 34-41 行）：
```stylus
&:hover {
  .mug-icon {
    opacity: 0;
  }
  .arrow-up {
    opacity: 1;
  }
}
```

- [ ] **Step 5: 验证**

```bash
npm run dev
```
页面右下角的 ToTop 按钮应该显示茶杯图标，鼠标悬停时茶杯淡出、箭头出现。

---

### Task 6: 添加物理公式彩蛋（双叶理央点缀）

**Files:**
- Modify: `src/components/AfterFooter.astro`

- [ ] **Step 1: 添加物理公式彩蛋**

打开 `src/components/AfterFooter.astro`，在 `<!-- busuanzi -->` 块之前（约第 15 行），或者现有音符装饰之后添加：

```html
<!-- 物理公式彩蛋 -->
<div class="physics-easter">iℏ ∂/∂t |ψ⟩ = Ĥ |ψ⟩</div>

<style>
  .physics-easter {
    text-align: center;
    color: var(--red-1);
    font-size: 13px;
    letter-spacing: 2px;
    opacity: 0.3;
    padding: 4px 0 12px;
    user-select: none;
    font-family: 'Times New Roman', serif;
    font-style: italic;
  }
</style>
```

- [ ] **Step 2: 修改 console.log 中 #ff5252 硬编码**

在同一个文件的第 103-104 行，有两处 console.log 的 `#ff5252` 硬编码颜色：

```js
console.log(String.raw`%c ${copyright}`,'color: #ff5252;')
console.log('%c Theme.Reimu v' + `${version}` + ' %c https://github.com/D-Sketon/astro-theme-reimu ', 'color: white; background: #ff5252; padding:5px 0;', 'padding:4px;border:1px solid #ff5252;')
```

如果你想改（可选），把 `#ff5252` 替换成抹茶绿 `#7d9b4e`：

```js
console.log(String.raw`%c ${copyright}`,'color: #7d9b4e;')
console.log('%c Theme.Reimu v' + `${version}` + ' %c https://github.com/D-Sketon/astro-theme-reimu ', 'color: white; background: #7d9b4e; padding:5px 0;', 'padding:4px;border:1px solid #7d9b4e;')
```

---

### Task 7: 新建关于我页面

**Files:**
- Create: `src/pages/about.astro`
- Modify: `src/config.ts`（在 menu 中添加 about 链接）

- [ ] **Step 1: 新建 `src/pages/about.astro`**

直接复制设计文档中的模板。但注意把 Font Awesome class 名称检查一下，`fa-brands fa-bilibili` 可能需要确认是否有效（B 站图标在 Font Awesome Free 中可能不存在）。

建议 about 页面先用 Material Symbols 的图标或纯文本代替，以后你找到合适的 B 站图标再换。**安全做法：用项目已有的 `astro-icon` 组件**。

打开 `src/components/Header.astro` 可以看到项目中已有的 `astro-icon` 用法：
```astro
import { Icon } from "astro-icon/components";
<Icon name="fa6-solid:bars" size={14} />
```

项目中已安装 `@iconify-json/fa6-brands`，所以可以直接用 `fa6-brands:github`、`fa6-brands:bilibili`。

创建 `src/pages/about.astro`：

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { Icon } from "astro-icon/components";
import { SITE } from "../utils/config";

const profile = {
  name: "你的昵称",
  avatar: "/images/avatar.webp",
  bio: "喜欢音乐和物理的普通人。",
};

const likes = ["轻音少女", "物理学", "抹茶", "编程", "吉他"];

const works = [
  {
    name: "项目名称",
    desc: "简短描述",
    url: "https://github.com/yourname/project",
  },
];

const socials = [
  { name: "GitHub", icon: "fa6-brands:github", url: "https://github.com/yourname" },
  { name: "Bilibili", icon: "fa6-brands:bilibili", url: "https://space.bilibili.com/yourid" },
];
---

<BaseLayout title={`关于 - ${SITE.title}`}>
  <article class="about-page">
    <section class="profile">
      <img src={profile.avatar} alt={profile.name} class="avatar" />
      <h1>{profile.name}</h1>
      <p>{profile.bio}</p>
    </section>

    <section class="likes">
      <h2>喜好</h2>
      <div class="tags">
        {likes.map(like => <span class="tag">{like}</span>)}
      </div>
    </section>

    <section class="works">
      <h2>作品</h2>
      <div class="work-grid">
        {works.map(work => (
          <a href={work.url} class="work-card" target="_blank" rel="noopener">
            <h3>{work.name}</h3>
            <p>{work.desc}</p>
          </a>
        ))}
      </div>
    </section>

    <section class="socials">
      <h2>找到我</h2>
      <div class="social-icons">
        {socials.map(s => (
          <a href={s.url} title={s.name} target="_blank" rel="noopener">
            <Icon name={s.icon} size={32} />
          </a>
        ))}
      </div>
    </section>
  </article>
</BaseLayout>

<style>
  .about-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .profile {
    text-align: center;
    margin-bottom: 3rem;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    background: #f0e8d0;
    color: #7d9b4e;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    font-size: 0.9rem;
  }

  .work-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }

  .work-card {
    display: block;
    padding: 1.2rem;
    border: 1px solid #e8e0cc;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s;
  }

  .work-card:hover {
    border-color: #7d9b4e;
  }

  .work-card h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
  }

  .work-card p {
    margin: 0;
    font-size: 0.9rem;
    color: #888;
  }

  .social-icons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .social-icons a {
    color: #7d9b4e;
    text-decoration: none;
    transition: color 0.2s;
  }

  .social-icons a:hover {
    color: #5c7a32;
  }
</style>
```

- [ ] **Step 2: 在 menu 中添加 about 链接**

打开 `src/config.ts`，找到 menu 数组（第 18-23 行左右）：

```ts
menu: [
  { name: "home", url: "/" },
  { name: "archives", url: "/archives" },
  { name: "about", url: "/about" },     // ← 添加这一行
],
```

- [ ] **Step 3: 验证**

```bash
npm run dev
```
访问 `http://localhost:4321/about`，检查页面显示是否正常。点击顶栏导航中的 "about" 链接是否能跳转。

---

### Task 8: 修改谢菲尔内容（可选：改 Console 标题 / afterfooter logo）

**Files:**
- Modify: `src/components/AfterFooter.astro:6-13`

- [ ] **Step 1: 修改版权控制台的 ASCII art（可选）**

第 6-13 行的 Reimu ASCII art 是东方 Project 主题的。你可以把它换成轻音相关或者直接删掉：

```ts
const copyright = "";
```
或者保留，因为几乎没人会打开控制台看这个。

---

## 修改文件清单总结

| # | 文件 | 改动类型 |
|---|---|---|
| 1 | `content/blog/` | 创建目录 |
| 2 | `content/drafts/` | 创建目录 |
| 3 | `src/styles/global.css` | 修改 `:root` 和 `[data-theme="dark"]` 颜色变量 |
| 4 | `src/config.ts` | preloader.text 改数组；firework.enable = false；menu 加 about |
| 5 | `src/utils/config.ts` | PreloaderConfig.text 类型改为 `string \| string[]` |
| 6 | `src/components/partial/Loader.astro` | 加随机选取逻辑 |
| 7 | `src/components/partial/ToTop.tsx` | img 换茶杯图标 |
| 8 | `src/styles/top.stylus` | img 选择器改为 .mug-icon |
| 9 | `src/components/AfterFooter.astro` | 加音符装饰、公式彩蛋、改 console 颜色 |
| 10 | `src/pages/about.astro` | **新建** |

## 如何测试

每次改动后运行：
```bash
npm run dev
```

逐一检查：
1. ✅ 首页显示正常，颜色为黄绿调
2. ✅ Preloader 文字随机切换
3. ✅ 没有鼠标烟花
4. ✅ ToTop 是茶杯图标
5. ✅ 页脚有音符装饰
6. ✅ 页脚有物理公式
7. ✅ `/about` 页面正常
8. ✅ 导航栏有 about 链接
9. ✅ 暗色模式切换后颜色仍协调
