---
title: 用C实现“三角函数表”
categories:
  - 问题与解决
tags:
  - 编程问题
date: 2023-12-30 06:32:00
---

## 问题

给sin1'的度数，计算0-90度每隔1分的八位三角函数表。

已知sin1分 约等于 2.908882046*10^-4

## 分析

先计算1分角的sin与cos，然后将其赋值给sin1与cos1,
利用公式 sin(a+b)=sin a * cos b + cos a * sin b.
即可得到sin(1'+1')，即sin(2')的值
继续运行下去，计算每个多1分角的正余弦。

## 解决

一开始想用定义一个函数解决，但计算涉及的变量来回横跳，倒不如直接写省事。

完整程序如下：

```
#include <stdio.h>
#include <math.h>
int main()
{
    double s0,c0,s,c;//s0为一分教正弦值，c0为其余弦值。
    int n=2;//n用于判断计算到哪个角，默认为2分角

    printf("输入sin1分的近似值(0.0002908882046)：");
    scanf("%lf",&s0);
    c0= pow((1 - pow(s0,2)),0.5);
    
    printf("n=%d度%d分,",n/60,n%60);
    printf("sin=%g,cos=%g\n",s0,s0);

    s=s0;
    c=c0;

    for(;n<1801;n++)
    {
        s=s*c0+c*s0;
        c= pow((1 - pow(s,2)),0.5);
        printf("n=%d度%d分,",n/60,n%60);
        printf("sin=%g,cos=%g\n",s,c);
    }
}
```
为方便检索，用`printf("n=%d度%d分,",n/60,n%60);`对角度进行格式化。

在此基础上稍加修改即可得到“计算指定范围内角的正余弦”：

```
    printf("输入所求角度数：");
    scanf("%d", &alpha);
    alpha *= 60;
    for (; n < alpha;)
    {
        n++;
        s = s * c0 + c * s0;
        c = pow((1 - pow(s, 2)), 0.5);
    }
    if (c != 0)
    {
        double tmp = s / c;
        t += tmp;
    }
    else if (c == 0)
    {
        t = -1;
    }
    printf("n=%d度%d分,", n / 60, n % 60);
    printf("sin=%g,cos=%g,tan=%g\n", s, c, t);
```

这里因为偷懒用循环变量n来计算角度，所以遇到了输出角度多一分的小bug，解决之后感觉，还是单独用一个变量比较好。

## 参考