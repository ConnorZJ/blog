---
title: SpringBoot之配置文件（二）
date: 2020-03-18
tags:
 - spring boot
categories:
 - spring boot
---

# spring boot的配置文件

通过上一章已经了解到，springboot项目是一个约定大于配置的项目，大部分的配置，通过相关的默认处理，都已经配置好了，我们直接拿来使用即可。

但还是有很多种情况，我们需要自定义一些配置，来供我们业务开发的要求，比如说配置其他的数据源之类的，这个时候，就需要自己去在配置文件中定义我们所需要的东西。

配置文件一般分为application.properties和application.yml，一个springboot项目创建之后，在src/main/resources目录下，一般会看到一个这样的配置文件(application.properties)。

对于这两种文件来说，

- .properties文件是以key=value的形式编写，很多种情况下，前缀大部分都相同，会造成冗余的现象。
- .yml是一个可读性高，用来表达数据序列化的格式的文件。

下面将介绍配置文件如何在项目中使用

## 如何使用

TODO