# 一、游戏介绍

## 1、规则

模拟**德州扑克**，玩家人数3-5人，通过计算牌力的出胜利者

## 2、牌力大小排序（从大到小）

​	在相同牌力时比较最大的牌

### （1）皇家同花顺

​			数值最大的同花顺

​			例如：♦10 ♦J ♦Q ♦K ♦A

### （2）同花顺

​			同时满足顺子和同花的牌

​			例如：♠4 ♠5 ♠6 ♠7 ♠8

### （3）四条

​			四张一样的牌 例如：9 9 9 9 2

### （4）葫芦

​			三张相同的牌+一对 例如：7 7 7 9 9

### （5）同花

​			五张牌为同一花色 例如：♠K ♠Q ♠10 ♠9 ♠8

### （6）顺子

​			五张连续的牌即为顺子 例如：8 9 10 J Q

​			A 可以作为顺子当中的任意牌

​			例如：A(1) 2 3 4 5

### （7）三条

​			三张一样的牌 例如：A A A 8 7

### （8）对子（两对）

​			例如：K K 5 5 A

### （9）对子（一对）

​			例如： 8 8 Q 10 7

### （10）高牌

​			单张 没法成对 例如：K Q 10 9 8

# 二、项目运行

## 1、安装依赖

```js
npm i
```

## 2、项目运行

```js
node ./src/index.js
```

## 3、项目运行版本

node v16.14.2

# 三、依赖包解析

## readline

* readline 模块提供了用于从[可读](http://nodejs.cn/api/stream.html#readable-streams)流（例如 [`process.stdin`](http://nodejs.cn/api/process.html#processstdin)）每次一行地读取数据的接口

* readline.createInterface(option) 该方法用于创建新的readline.Interface实例，其主要作用是监听'line'事件

  ![image-20220319002520462](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20220319002520462.png)

  ![image-20220319002531347](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20220319002531347.png)

  

  