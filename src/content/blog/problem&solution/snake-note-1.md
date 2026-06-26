---
title: 绝区零贪吃蛇复刻-原地转头bug修复
categories:
  - 问题与解决
tags:
  - love2d
date: 2024-08-31 21:38:23
---

## 问题

话不多说，请看VCR：

![原地转头](../images/YuanDiZhuanTou.gif)

(目前用的主题播放不了.gif......)

在移动到下一格之前会有一个计时器，在计时器还未结束之前可以一直检测按键，触发条件就是按下蛇头两侧的方向之后再快速按下往回走的方向，比如蛇现在正往下走，我以迅雷不及掩耳之势快速按下左+上，之后蛇就原地往上了。


## 分析

代码结构大概是这样：

```
检测按键输入：
  如果按键不是和当前方向同向或反向：
    给方向变量赋值
  否则：
    方向不变

检测移动计时器：
  获取按方向计算的下一位置坐标
  把下一坐标插入蛇身数组

清除蛇身最后一位
  
```

以次，可以猜到问题是什么了。

在计时器还存在的时候，虽然按键输入看似做了不能回头的判断，但实际上连续按下“当前方向两侧”、“当前方向反向”，在这一过程中计时器依然没有结束，等计时器一到，就可以在前进的过程中直接转头了。

## 解决

我的解决方法是添加一个记录当前蛇头朝向的变量，这个变量既可以解决原地转头，也可以为蛇的头确定朝向，我们就叫它“face”吧。

```lua
if self.direction[1] == "none" then
            table.insert(self.face, self.direction[#self.direction])
end
```
此段代码是为了避免蛇在游戏一开始就移动的，与问题不太相干

（在游戏开始，蛇是不动的，所以储存下一步方向的变量`direction`默认为`none`，之后按键按下，`direction`的在最后一位插入方向，后面的代码是，如果`direction`的长度大于1，则从头开始去掉方向只留最后一个。）

```lua
-- 朝蛇头方向运动
if love.timer.getTime() - self.move_timer >= self.speed then
    self.move_timer = love.timer.getTime() -- 重置计时器

    -- 下一坐标以当前蛇头坐标为基准
    local nowX = self.body[1].x
    local nowY = self.body[1].y

    if self.direction[1] ~= "none"
     and not( (self.face[#self.face]=="Up" or self.face[#self.face]=="Down") and (self.direction[#self.direction]=="Up" or self.direction[#self.direction]=="Down") ) -- face为上下时direction不能为上下
     and not( (self.face[#self.face]=="Left" or self.face[#self.face]=="Right") and (self.direction[#self.direction]=="Left" or self.direction[#self.direction]=="Right") ) -- face为左右时direction不能为左右，
    then
        nextX,nextY = self:Move(self.direction, nowX, nowY)

        -- 确认移动方向，将face更改为当前direction
        table.insert(self.face, self.direction[#self.direction]) 
    else
        nextX,nextY = self:Move(self.face, nowX, nowY)
    end

    -- 将下一位置添加到蛇身
    table.insert(self.body, 1, {x = nextX, y = nextY}) 
end

--清除蛇尾
if #self.body > self.length then
    table.remove(self.body, #self.body)
end
```
原理是，face记录了上次移动的方向，在移动之前判断：“`face`是上或下 与 `direction`是上或下” 是否为真，如果是真就不能改变方向地移动了，所以对这一判断取非，左右也是一样，“`face`是左或右 与 `direction`是左或右” 是否为真取非。当两个取非之后的判断都为真之后，才能按照`direction`的方向进行移动。在移动之后要把当前成功移动的方向再传给`face`以记录这次移动的方向。

如果不满足，就再按照`face`的方向移动，因为`face`已经记录了上一次移动的方向。


## 参考

靠人不如靠己。