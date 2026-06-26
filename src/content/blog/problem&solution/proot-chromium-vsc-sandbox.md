---
title: PRoot容器因沙盒无法运行VSCode和Chromium的问题解决
categories:
  - 问题与解决
tags:
  - proot
date: 2023-10-02 07:17:26
---

## 问题

在使用termux+proot运行debian的过程中，遇到了chromium浏览器和vscode不能运行的问题。究其原因我也不太懂，但可以肯定的是，因为这两个软件运行时需要sandbox沙盒环境，所以遇到了一些神奇的错误，网络上的解决方法少之又少啊，解决起来废了好大劲。

## 分析

这两个软件需要sandbox，

初步分析，方案有三：

1.系统开启支持sandbox功能；

2.下载非sandbox版本；

3.屏蔽他俩使用sandbox功能；

proot默认好像没有这个功能，解决方案1就被pass掉了。

再说解决方案2,vscode确实有不用sandbox的版，版本号大概是1.56（最后一个不支持sandbox的版本）。然而chromium我并没有找到有关版本。而且使用旧版vsc也不太舒服。

故，本文主要讲如何“屏蔽他俩使用sandbox功能”

## 解决

首先我们要安装完chromium和vscode，chromium brower可以直接在系统的包管理器中安装，注意要一并安装“chromium-l10n”这个包，否则chromium是不支持中文的。vscode直接上[官网](https://code.visualstudio.com/)下载就可以了。

接着先搞chromium：

chromium相对vscode比较简单，只需找到并编辑chromium的快捷方式，在运行命令的最后加上`--no-sandbox`，注意新添加的和原有的之间要有空格。

以后运行chromium只需要运行这个快捷方式就可以啦。

而vscode解决要麻烦些，因为使用vscode时会经常用`code .`之类的命令，单改快捷方式是不行的。所以：

找到`/usr/bin/code`这个文件，他应该是一个链接文件，指向`/usr/share/code/bin/code`这个文件。

我们可以直接对这个链接文件进行编辑，找到底部的的

`ELECTRON_RUN_AS_NODE=1 "$ELECTRON" "$CLI" --ms-enable-electron-run-as-node "$@"`

将其修改为

`ELECTRON_RUN_AS_NODE=1 "$ELECTRON" "$CLI" --ms-enable-electron-run-as-node --unity-launch --no-sandbox %F "$@"`

保存并退出，vscode即可正常使用了。

## 参考