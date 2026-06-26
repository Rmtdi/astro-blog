---
title: 为Termux PRoot搭建Qt开发环境
categories:
  - 问题与解决
tags:
  - Qt
  - proot
date: 2024-01-11 09:02:32
---

## 问题

在Proot上构建Qt并使用Qt Creator进行开发

## 分析

Qt环境需要自己编译，但好在Creator软件库里有，可以直接用。

## 解决

### 第一步_准备

控制台输入`aarch64-linux-gnu-gcc -v`判断自己有无编译环境。

（没有我也不知道怎么搞，年代太久远，我的那些文件都是散布在/bin/底下，实在无能为力。）

然后是下载Qt，我使用[中科大](http://mirrors.ustc.edu.cn/qtproject/)镜像源进行下载。

进入之后，在`./archive/qt/`下选择自己喜欢的版本，下不下载LTS稳定版随你，毕竟到了proot的地盘，多少都得出点问题。

下载带有everywhere字样的.tar.xz后缀的源码文件，并解压到`/opt/`目录待用:

`sudo tar -xf <下载的文件名> /opt/`

### 第二步_编译

进入解压好的qt文件夹，编辑qmake.conf

`vim ./qtbase/mkspecs/linux-aarch64-gnu-g++/qmake.conf`

在其中添加这样一段内容：

```
QT_QPA_DEFAULT_PLATFORM = <你使用的显示服务器，vnc或xcb>
QMAKE_CFLAGS_RELEASE += -O2 -march=armv8-a -lts
QMAKE_CXXFLAGS_RELEASE += -O2 -march=armv8-a -lts
```
然后把底部的八行，后面的`aarch64-linux-gnu-xxx`换成自己对应文件的绝对路径。

比如我的就是`/usr/bin/aarch64-linux-gnu-xxx`。

全部修改完成，保存并退出。

现在要创建一个生成目录，具体放在哪里都可以，但为方便我就放在`/opt/qt5/`下了，这个路径在后面需要换成你自己的。

回到qt的源码文件夹，创建一个脚本文件：

`vim auto.sh`

填入以下内容：

```
#!/bin/sh
 ./configure \
 -recheck-all \
 -release \
 -confirm-license \
 -opensource \
 -prefix /opt/qt5/ \
 -xplatform linux-aarch64-gnu-g++ \
 -no-opengl \
 -no-sse2 \
 -no-openssl \
 -no-cups \
 -no-glib \
 -no-dbus \
 -no-separate-debug-info \
 -nomake tests \
 -no-compile-examples \
 -nomake examples \
 -confirm-license \
 -skip qtlocation \
 -gif \
 -ico \
 -pch \
 -qt-libjpeg \
 -qt-libpng \
 -qt-sqlite \
 -xcb \
 -xcb-lib \
 -bundled-xcb \
 -Wno-dev
```
路径改成自己的，其他最好不要动。

保存&退出&加权限（`chmod +x auto.sh`），

完成后`./auto.sh`运行脚本

`make & make install`

稍等“片刻”即可。

（因为我的Termux是用Termuux:X11显示的，所以需要添加xcb库，建议直接`apt install libxcb* libxkbcommon*`安装所有xcb依赖，如果运行脚本之后还有关于xcb的报错，自行百度怎么编译xcb。）

（如果你像我一样坑爹地选择了qt6，那么请安装一个不新不旧的cmake，例如Cmake3.24，准备好clang和llvm，带着你的耐心。不说了，累死了）

之后安装QtCreator，这个很方便，直接在软件库里下载就好，例如

`sudo apt install qtcreator`

打开QtCreator，在上边导航栏：`编辑>Preferences`进入Qt首选项，然后在`构建套件(kit)`中添加Qt版本（手动设置），再在编译器里添加C/C++版本（也是手动设置里，添加的是你GCC/G++的文明目录）

最后在构建套件(kit)里添加构建套件（手动设置），编译器和Qt版本填入刚才添加的，底下还有CMake也要添加一下（不知为什么，我用不了qmake）。

之后就可以愉快地玩儿Qt啦!

## 参考

[Ubuntu20.04配置aarch64的Qt6环境（亲测有效）](https://blog.csdn.net/qq_63986699/article/details/127731136)

[在 Ubuntu Linux 上从源代码构建 Qt 6.2.2的简短教程](https://blog.csdn.net/yaxuan88521/article/details/122078791)

[编译libxcb遇到的坑](https://www.cnblogs.com/feipeng8848/p/17680708.html)

[ Build on Linux: -qt-xcb option?](https://forum.qt.io/topic/115827/build-on-linux-qt-xcb-option/25)

[Need help statically building qt for Ubuntu](https://forum.qt.io/topic/140651/need-help-statically-building-qt-for-ubuntu/15)