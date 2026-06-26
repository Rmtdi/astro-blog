---
title: hexo功能小记
categories:
  - 学习
tags:
  - 基础
  - hexo
date: 2023-05-12 21:38:05
---

添加图片测试

![test](../../images/favicon.png)

代码是`![test](images/favicon.png)`

路径演示：
```
source
└── _posts
    ├── images
    │   └── 图片.png
    └── 文章.md

```

所以说，显示图片的方法不只有网上都在宣传的“设置post_asset_folder为true”，像这样的好处是可以不用为每篇文章单独设置一个暴露在外的文件夹，而是可以选择单独进行资源的管理。