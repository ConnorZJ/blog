---
title: SpringBoot之整合视图层（三）
date: 2020-04-08
tags:
 - spring boot
categories:
 - spring boot

---

# spring boot整合视图层

在springMVC的项目中，与视图层交互的传统的做法是通过JSP构造页面，使用后台传来的数据再来渲染页面。然而，现如今的技术潮流里，JSP技术以及在被逐渐的淘汰了。

现在的主流技术里，可以通过freemarker、thymeleaf等静态模板引擎构建页面，也可以在前后端分离的项目中，使用vue、react等前端框架搭建页面。这几种技术，springboot都能够很好地支持。不过对于JSP来说，springboot也能够支持，只是使用配置起来会略显麻烦。

接下来我将介绍freemarker的使用。

## 什么是FreeMarker

FreeMarker 是一款 *模板引擎*： 即一种基于模板和要改变的数据， 并用来生成输出文本(HTML网页，电子邮件，配置文件，源代码等)的通用工具。 它不是面向最终用户的，而是一个Java类库，是一款程序员可以嵌入他们所开发产品的组件。

模板编写为FreeMarker Template Language (FTL)。它是简单的，专用的语言， *不是* 像PHP那样成熟的编程语言。 那就意味着要准备数据在真实编程语言中来显示，比如数据库查询和业务运算， 之后模板显示已经准备好的数据。在模板中，你可以专注于如何展现数据， 而在模板之外可以专注于要展示什么数据。

![Figure](http://freemarker.foofun.cn/figures/overview.png)

## 创建一个FreeMarker的springboot项目

在创建springboot项目的时候，勾选web和freemarker的依赖

![image-20200408215424281](http://qiniuyun.zijie.fun/image-20200408215424281.png)

创建成功后，在pom中主要是用到了两个依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-freemarker</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

FreeMarker在springboot中自动化配置生效主要靠FreeMarkerAutoConfiguration类，在这个类之中，可以看到注解中有一个**@ConditionalOnClass({freemarker.template.Configuration.class, FreeMarkerConfigurationFactory.class})**，表示当前配置只有在**freemarker.template.Configuration**和**FreeMarkerConfigurationFactory**存在的情况下才生效，还有一个注解是**@Import({FreeMarkerServletWebConfiguration.class, FreeMarkerReactiveWebConfiguration.class, FreeMarkerNonWebConfiguration.class})**，表示freemarker可以用在servlet web，reactive web和非web的项目下。

我们这个项目很明显是一个servlet web项目，点击**FreeMarkerServletWebConfiguration**类看里面的源码，可以看到他的构造方法里，set进去了一个**FreeMarkerProperties**的对象，打开这个对象一看：

![image-20200408222859955](http://qiniuyun.zijie.fun/image-20200408222859955.png)

就能够恍然大悟，配置都是在这里写好了的：

1. 注解里面写了前缀为spring.freemarker，如果要自定义更改，则在application.properties中配置相应的属性

2. DEFAULT_TEMPLATE_LOADER_PATH表示freemarker的默认模板放在classpath:/templates中，在application.properties同级目录下，能够看到这一个templates文件夹，只要把静态文件放在这个里面，springboot就能够读取到这个的模板了

3. DEFAULT_SUFFIX表示默认的模板文件名的后缀，在springboot 2.2.0以前，freemarker的默认后缀名是ftl，之后则改为了ftlh，据说是这样使用更加的安全。

   ............

## 开始使用

下面我将来写个例子，看看springboot中如何使用freemarker

1. 首先创建一个bean，给他一些属性，用于在页面上显示

   ![image-20200408223650676](http://qiniuyun.zijie.fun/image-20200408223650676.png)

2. 接下来创建一个controller，并在里面创建若干个Person对象，给每一个对象赋值，并将其加到Model里面，以便能够返回到页面上

   ![image-20200408224310100](http://qiniuyun.zijie.fun/image-20200408224310100.png)

3. 接下来就到了重头戏了，在templates文件夹下创建模板文件---person.ftlh

   ![image-20200408225848639](http://qiniuyun.zijie.fun/image-20200408225848639.png)

   在freemarker里面，使用#list的标签可以循环对象，在里面使用EL表达式，取出对象里的值

4. 更多的freemarker标签可以 [点击此处](http://freemarker.foofun.cn/dgui.html)

## 更多配置

