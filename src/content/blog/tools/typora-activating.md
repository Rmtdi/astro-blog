---
title: 激活Typora
categories:
  - 笔记
tags:
  - null
date: 2024-04-20 12:04:41
---

## 就写文章来说，还是用专门的软件比较好

vscode很好用，功能多样，能胜任许多角色。

可它能干的实在是太多了，当你把一堆东西都交给它，它变得越来越臃肿，越来越不擅长简单的事情。

所以，这时候就需要一个能够专一于一种功能的工具。

我需要的是一个linux平台的写作工具

所以我选择了Typora

可它实在太贵了:(

但“手动激活”其实非常简单:)

## Step 1

打开Typora 的安装目录，并进入`~/resources/page-dist/static/js/`这一目录。

## Step 2

在目录下找到`LicenseIndex.180dd4c7.xxxxxxx.chunk.js`这个文件，

备份并修改：

搜索

`hasActivated="true"==e.hasActivated`

这行，改为：

`hasActivated="true"=="true"`

保存，并把修改过的文件覆盖源文件（如果你是把文件复制出来改动的话）

之后再进入软件，点击未激活，或者提示激活的页面，都会直接被激活页面覆盖!