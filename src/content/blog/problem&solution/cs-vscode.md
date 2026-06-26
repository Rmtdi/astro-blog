---
title: 用VSCode写C#程序
categories:
  - 问题与解决
tags:
  - VSCode
  - C#
date: 2023-02-25 13:05:59
---

用vsc写c#的理由有很多，C盘撑不住，VS启动慢等等。

这几天在摸索的过程中踩了不少坑，所以尽可能的就写的详细一点。

### 安装VSCode

（下过可跳过）

点击[这里](https://code.visualstudio.com/Download)下载VSCode，选择合适自己的平台。

安装过程中，记得留意有创建桌面图标的那个界面，把下面四个选项都勾上（以后要用再改注册表贼麻烦）。

点击左侧选择栏最下面的（四个方块），需要在这里下载一些拓展。

搜索 Chinese，并install第一个拓展，安装完成后重启VSCode。

重启VSCode后，继续下载拓展。搜索下载C#和C# Extensions这两个拓展。

### 下载.Net 和 配置VSCode

点击[这里](https://dotnet.microsoft.com/zh-cn/download)下载.Net，有选择困难可以下长期支持版。

下载完直接安装就行。

之后创建一个写代码的目录，我以"D:\C#\"这个目录为例（此目录以下记为"#\"），

在"#\"下创建一个项目文件夹"cs001"，左键选中并右键单击，选择“通过Code打开”，

进入后点击终端-新建终端（快捷键ctrl + shift + \`） ，输入`dotnet new console`，此时看左侧文件目录，已经生成的C#项目的文件，双击Program.cs，就可以开始愉快地写代码啦~

第一次会下载一个文件，一会儿后右下角会弹出一个提示，选择“Yes”即可。

接着对"#\cs001\\.vscode\"下的文件做一些修改：

#### launch.json：

``` json
"configurations":[
  {
    XXXXX
    XXXXX
    这里！
  },
  {
    XXXXX
  }
]
```
添加
`"console": "integratedTerminal",`
替换掉本来的
`"console": "xxxxxx",`
再添加一个
`"internalConsoleOptions": "neverOpen",`

#### tasks.json：

``` json
"tasks": [
  {
    "label": "build",
    xxx
    这里!
  },
  {
    "label": "xxx",
  }
]
```
添加
``` json
"group": {
  "kind": "build",
  "isDefault": true
},
```
最后别忘了都保存一下（ctrl + s）

### 运行

写完代码按F5即可运行。(如果弹出选择调试器，选择推荐的即可)

如上配置没错的话，运行时，VSCode会在底部打开终端，进行build，最后在生成一个dll文件显示结果。（可点击dll文件右侧的垃圾桶删除这个页面，这样就不会有上一次运行时的记录了)

如果想要独立的窗口显示运行结果，

将刚刚添加在launch.json的
`"console": "integratedTerminal",`
修改为
`"console": "externalTerminal",`
即可。

### 多个Main方法进行调试

这个可能暂时还做不到像VS那样方便，

如果要运行其他带Main方法的项目，例如"cs002"，就要到"cs001"目录外创建新的目录。

像是这样：
``` js
D:\C#
    |-cs001
    |   |-.vscode
    |   |-Program.cs
    |   |-...
    |
    |-cs002
        |-.vscode
        |-Program.cs
        |-...
```
并且重新修改launch.json和tasks.json文件的配置，

VSCode是做不到打开父文件夹而同时调试两个子项目，

想运行其他项目里的"Program.cs"，就只能用VSCode打开那个项目单独的文件夹。

### End

希望对看到的人有帮助把，这两天为了搞这个真是累死了。

（如果可以最好还是用VS吧，用VSC写.Net限制太大了。。。）

参考：  
[在 VS Code 里写 C#](https://zhuanlan.zhihu.com/p/85678408)  
。。。太多了，放一个得了