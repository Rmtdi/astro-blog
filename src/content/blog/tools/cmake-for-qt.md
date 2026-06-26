---
title: Qt默认缺少的cmake配置
categories:
  - 笔记
tags:
  - null
date: 2024-01-13 12:20:09
---

## 设置CMAKE_PREFIX_PATH

`set(CMAKE_PREFIX_PATH "<qt安装根目录>;${CMAKE_PREFIX_PATH}")`

## 设置Qt6_DIR

`set(Qt6_DIR "${CMAKE_PREFIX_PATH}//lib/cmake/Qt6")`

我也不知道为啥cmake默认没生成......