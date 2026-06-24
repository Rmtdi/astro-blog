# 轻音少女 × 双叶理央 主题博客 — 设计文档

> 日期：2026-06-24  
> 基于：astro-theme-reimu v0.4.2

---

## 一、内容结构改造

### 1.1 最终目录结构

```
astro-blog/
├── content/
│   ├── blog/                    # ← Obsidian vault 放这里
│   │   ├── essay/               # 随笔
│   │   ├── notes/               # 笔记
│   │   │   ├── hexo/
│   │   │   ├── remember.md
│   │   │   └── writing/
│   │   ├── novels/              # 小说
│   │   ├── tools/               # 工具
│   │   └── ...                  # 你未来的其他分类
│   └── drafts/                  # 草稿文件夹，构建时排除
│       └── 未完的草稿.md
├── src/
│   ├── pages/
│   │   ├── about.astro          # 新建：关于我页面
│   │   └── ...
│   └── ...
└── public/
    └── images/
        └── ...                  # 茶杯图标等
```

### 1.2 步骤一：设置 content 目录为 Obsidian vault

1. 在 Obsidian 中点击左下角 "打开另一个仓库"
2. 点击 "打开文件夹作为仓库"
3. 选择 `D:\Blogs\astro-blog\content`
4. Obsidian 会显示 `blog/` 和 `drafts/` 两个顶层文件夹

### 1.3 步骤二：修改 content.config.ts，排除草稿

打开 `src/content.config.ts`，找到 blog collection 的 loader 部分。当前代码：

```ts
const blog = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: "./src/content/blog",
  }),
  // ...
});
```

**不需要改 loader**——因为 loader 的 `base` 已经是 `./src/content/blog`，它只扫描 `content/blog/` 下的文件。`content/drafts/` 不在扫描范围内，天然被排除。

> 你只需要确认 `content.config.ts` 里的 `base` 路径指向 `./src/content/blog` 即可。

### 1.4 步骤三：中文文件名 → 拼音 slug 的逻辑

**问题**：当前主题的文章 slug 来自文件路径。比如 `content/blog/essay/如何制作抹茶拿铁.md`，产生的 slug 是 `essay/如何制作抹茶拿铁`，URL 变成 `/blog/essay/%E5%A6%82%E4%BD%95...`。

**解决思路**：在 frontmatter 里手工声明 `slug`。

日常操作：
- 新建文件 `content/blog/essay/如何制作抹茶拿铁.md`
- 写 frontmatter 时加上 `slug: matcha-latte`

```yaml
---
title: 如何制作抹茶拿铁
slug: matcha-latte
pubDate: 2026-06-24
tags: [抹茶, 烹饪]
---
```

如果哪天忘了写 slug，URL 会变成中文编码，能正常访问就是不太好看。后续如果觉得手动太麻烦，可以在 `[...slug].astro` 路由页面里加一个 frontmatter `slug` 优先、fallback 到 pinyin 的逻辑——这个稍复杂，你到时候问我。

**关于分类**：文件夹名（如 `essay`）会自动出现在 URL 路径中。如果不想让文件夹名出现在 URL，可以把文件直接放在 `content/blog/` 根目录，用 frontmatter 的 `categories` 字段标分类。

---

## 二、视觉主题改造

### 2.1 全局配色：奶白 + 黄绿

**涉及文件**：先找到主题的 CSS 变量定义文件。运行以下命令定位：

```bash
# 在 astro-blog 目录下执行
grep -r "red-0\|red-1\|--primary\|--theme" src/styles/
```

找到后，把红色系变量替换为黄绿色系。参考色值：

| 用途 | 色值 | 说明 |
|---|---|---|
| 页面背景 | `#fdfaf3` | 奶白色，像和纸 |
| 卡片背景 | `#fffbf5` | 比背景稍白一点 |
| 主色/链接 | `#7d9b4e` | 抹茶绿，用于链接、按钮 |
| 主色 hover | `#5c7a32` | 深抹茶绿 |
| 强调色 | `#c4a45a` | 奶油黄，用于 tag、小装饰 |
| 文字色 | 保持不变 | — |
| 代码块 | **不改** | 保持原样 |

### 2.2 Preloader：随机角色祈祷

**步骤一**：修改 `src/config.ts`，把 preloader 的 text 改成角色名数组：

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

TypeScript 可能会报类型错误（原来 `text` 是 `string`，现在成了 `string[]`）。如果报错，去 `src/utils/config.ts`（或定义 preloader 类型的文件），把 `text` 的类型从 `string` 改成 `string | string[]`。

**步骤二**：打开 `src/components/partial/Loader.astro`，找到显示文字的那一行（大概类似 `{PRELOADER.text}` 或 `{config.preloader.text}`）。

把它改成随机取一个：

```astro
---
// 在 frontmatter 代码块（---之间）里加：
const preloaderText = Array.isArray(PRELOADER.text)
  ? PRELOADER.text[Math.floor(Math.random() * PRELOADER.text.length)]
  : PRELOADER.text;
---

<!-- 然后把模板里的 {PRELOADER.text} 换成 {preloaderText} -->
```

### 2.3 烟花 → 音符粒子

当前主题使用 `mouse-firework` 库，粒子形状固定为圆形，不支持音符形状。

**推荐方案（你自己挑）**：

**方案 A：简单关掉**
- `src/config.ts` 中把 `firework.enable` 设为 `false`
- 在页脚或侧边栏放一行静态音符装饰 `♪ ♫ ♩ ♬`（直接在 `Footer.astro` 或 `AfterFooter.astro` 里加 HTML）
- 用 CSS `@keyframes` 让音符轻轻浮动——如果你想要代码我可以给你

**方案 B：换颜色保留效果**
- 把 `src/config.ts` 中 firework 的 `colors` 数组改成黄绿色系
- 其他不变

**方案 C：自己写音符鼠标跟随（轻量）**
- 关掉 `mouse-firework`
- 新建一个小脚本：鼠标移动时在指针位置生成一个随机音符字符，用 CSS animation 让它上飘消失
- 大约 30 行 JS + 20 行 CSS

> 我建议先选 A，最快见效。以后想升级再问我拿 B 或 C 的代码。

### 2.4 ToTop：茶杯替换太极图

**步骤一**：准备图标。项目已安装 `@fortawesome/free-solid-svg-icons`，里面包含 `fa-mug-hot`（热茶杯）图标。你也可以自己去 `public/images/` 放一个茶杯 PNG。

**步骤二**：找到 ToTop 组件。在 `src/layouts/BaseLayout.astro` 第 94 行：

```astro
<ToTop client:load imageUrl={urlFor("images/taichi.png")} />
```

**步骤三**：打开 ToTop 组件文件（搜 `ToTop` 组件位置：`src/components/partial/ToTop`，可能是 `.astro` 或 `.tsx`）。

如果是 Astro 组件（`.astro`），把 `<img>` 标签替换成 Font Awesome 的茶杯图标：

```astro
<!-- 原来大概是： -->
<img src={imageUrl} alt="to top" />

<!-- 改成： -->
<i class="fas fa-mug-hot"></i>
```

然后在页面的 `<head>` 或全局 CSS 里确保 Font Awesome 已加载（这个主题应该已经加载了，检查 `VendorScript.astro` 或全局 CSS 有没有引入 Font Awesome CDN）。

如果是 React 组件（`.tsx`），导入并使用：

```tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot } from '@fortawesome/free-solid-svg-icons';

// 把 <img> 换成
<FontAwesomeIcon icon={faMugHot} />
```

### 2.5 理科元素点缀（双叶理央）

这些是锦上添花的小装饰，按优先级排列，你可以逐个做：

| 优先级 | 位置 | 改动 |
|---|---|---|
| ★★★ | Footer | 在 `AfterFooter.astro` 或 `Footer.astro` 底部加一行小字物理公式彩蛋，如 `iℏ ∂ψ/∂t = Ĥψ` |
| ★★☆ | 代码块 | **不改**（按你要求保持原样） |
| ★★☆ | About 页 | 理科实验台风格小区域（见第三部分） |
| ★☆☆ | 全局装饰 | 引用块 `blockquote` 左边框从主题色改成浅蓝（双叶白大褂的冷静蓝 `#7eb8c9`） |

---

## 三、关于我页面

### 3.1 页面结构

```
┌─────────────────────────────┐
│     头像 + 昵称              │
│     一句话自我介绍           │
├─────────────────────────────┤
│  🎵 喜好                    │
│  [轻音] [物理] [抹茶] ...   │  ← 标签式
├─────────────────────────────┤
│  📦 作品                    │
│  ┌──────┐ ┌──────┐ ┌──────┐│
│  │ 作品1 │ │ 作品2 │ │ 作品3 ││  ← 卡片平铺
│  │ desc  │ │ desc  │ │ desc  ││
│  │ link→ │ │ link→ │ │ link→ ││
│  └──────┘ └──────┘ └──────┘│
├─────────────────────────────┤
│  🔗 联系方式                │
│  [🐙GitHub] [📺Bilibili]    │  ← 图标点击跳转
└─────────────────────────────┘
```

### 3.2 步骤：新建 src/pages/about.astro

在 `src/pages/` 下新建 `about.astro`。以下是一个可直接使用的模板框架：

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { SITE } from "../utils/config";

// 你的个人信息，直接改这里
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
  // 复制上面的块添加更多作品
];

const socials = [
  { name: "GitHub", icon: "fa-brands fa-github", url: "https://github.com/yourname" },
  { name: "Bilibili", icon: "fa-brands fa-bilibili", url: "https://space.bilibili.com/yourid" },
];
---

<BaseLayout title={`关于 - ${SITE.title}`}>
  <article class="about-page">
    <!-- 头像 + 介绍 -->
    <section class="profile">
      <img src={profile.avatar} alt={profile.name} class="avatar" />
      <h1>{profile.name}</h1>
      <p>{profile.bio}</p>
    </section>

    <!-- 喜好标签 -->
    <section class="likes">
      <h2>🎵 喜好</h2>
      <div class="tags">
        {likes.map(like => <span class="tag">{like}</span>)}
      </div>
    </section>

    <!-- 作品展示 -->
    <section class="works">
      <h2>📦 作品</h2>
      <div class="work-grid">
        {works.map(work => (
          <a href={work.url} class="work-card" target="_blank" rel="noopener">
            <h3>{work.name}</h3>
            <p>{work.desc}</p>
          </a>
        ))}
      </div>
    </section>

    <!-- 社交链接 -->
    <section class="socials">
      <h2>🔗 找到我</h2>
      <div class="social-icons">
        {socials.map(s => (
          <a href={s.url} title={s.name} target="_blank" rel="noopener">
            <i class={s.icon}></i>
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
    font-size: 1.8rem;
  }

  .social-icons a {
    color: #7d9b4e;
    text-decoration: none;
  }

  .social-icons a:hover {
    color: #5c7a32;
  }
</style>
```

**说明**：
- `profile`、`likes`、`works`、`socials` 四个变量，改数据就行，不用改模板
- 样式已经内联在组件里，不依赖全局 CSS
- 以后想抽成单独的配置文件（比如 `src/data/about.ts`），你告诉我，我帮你拆

---

## 四、修改涉及的文件总览

| 文件 | 改动内容 |
|---|---|
| `src/config.ts` | 配色参考（如有CSS变量定义在此）、preloader text 改数组、firework 关掉 |
| `src/utils/config.ts` | preloader text 类型从 `string` 改成 `string \| string[]` |
| `src/components/partial/Loader.astro` | 随机取 preloader 文本 |
| `src/layouts/BaseLayout.astro` | ToTop 的 imageUrl 改茶杯 |
| `src/components/partial/ToTop.*` | 太极图换茶杯图标 |
| `src/styles/*.css` | 红色系变量 → 黄绿色系变量 |
| `src/components/AfterFooter.astro` | 加物理公式彩蛋 |
| `src/pages/about.astro` | **新建**，关于我页面 |
| `src/config.ts` 的 menu 数组 | 加 `{ name: "about", url: "/about" }` |

---

## 五、不动的部分

- 代码块/Expressive Code 配置 —— **不改**
- 评论系统 —— **不改**
- Sidebar 结构和 widgets —— **不改**
- RSS/sitemap —— **不改**
- 文章路由逻辑 —— **不改**（只改 frontmatter 写法）
