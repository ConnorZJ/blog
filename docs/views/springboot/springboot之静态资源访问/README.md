---
title: SpringBoot之静态资源访问（五）
date: 2020-04-13
tags:
 - spring boot
categories:
 - spring boot
---

# spring boot 之静态资源访问

以前在springMVC项目之中，如果需要访问静态资源的话，一般是需要在spring-mvc.xml文件中配置以下代码：

```xml
<mvc:resources mapping="/images/**" location="/images/" /> 
<mvc:resources mapping="/js/**" location="/js/" /> 
<mvc:resources mapping="/css/**" location="/css/" /> 
```

但是在springboot之中，访问静态资源的方式就更加的简单粗暴了！

下面来看看在springboot中如何访问静态资源。

## 开始分析

第一步肯定是创建项目啦~依赖选择web即可。

首先搜索类**WebMvcAutoConfiguration**，再找到其内部类**WebMvcAutoConfigurationAdapter**，定位到它的**addResourceHandlers**方法，可以看到有一个staticPathPattern变量

![](http://qiniuyun.zijie.fun/20200413225427.png)

点进去看一看这个变量的值

```java
this.staticPathPattern = "/**";
```

这个就是类似于在springMVC中配置的location，两个**表示的是匹配任意一层路径。

再看下面一行的源码，这个比较长，主要要看的是this.resourceProperties.getStaticLocations()。

```java
this.customizeResourceHandlerRegistration(registry.addResourceHandler(new String[]{staticPathPattern}).addResourceLocations(WebMvcAutoConfiguration.getResourceLocations(this.resourceProperties.getStaticLocations())).setCachePeriod(this.getSeconds(cachePeriod)).setCacheControl(cacheControl));
```

看到这个点进去看，就能看到其实这个staticLocations的值是一个String的数组，元素有四个分别是"classpath:/META-INF/resources/"、"classpath:/resources/"、"classpath:/static/"、"classpath:/public/"。于是可以猜测，在springboot中，静态资源可以放在以上四个路径下，且优先级是按照顺序从高到低排序的。

再返回到刚刚很长的一行代码的地方，在点击WebMvcAutoConfiguration.getResourceLocations()方法，可以看到：返回了locations数组里面，除了之前提到的四个路径，还有一个**SERVLET_LOCATIONS**的东西，这个东西的值就是一个斜杠（"/"），对应的就是当前项目的根路径。

![](http://qiniuyun.zijie.fun/20200413230821.png)

![](http://qiniuyun.zijie.fun/20200413230938.png)

所以现在猜测，在springboot中，静态资源的默认映射路径分别为：

- classpath:/META-INF/resources/
- classpath:/resources/
- classpath:/static/
- classpath:/public/
- /

接下来就是验证我们的猜测是否正确的时候了！

## 验证猜测

首先我们在项目下分别在各自的路径创建五个location.js文件，里面就写上各自的路径

![image-20200413232428801](C:\Users\10203\AppData\Roaming\Typora\typora-user-images\image-20200413232428801.png)

启动项目，访问[localhost:8080/location.js](localhost:8080/location.js)，打印了一条，就删掉相应路径的location.js，看看将会打印出了什么。

```
classpath:/META-INF/resources/
classpath:/resources/
classpath:/static/
classpath:/public/
webapp:/
```

通过上述打印的信息可以判断，我们之前的猜测是正确的！

## 自定义路径

通过上面的操作，我们知道了springboot中关于静态资源的默认的访问路径，但我想访问自定义路径的静态资源怎么办呢？

其实这样也是可以的！首先看看之前看的源码**staticLocations**的地方，这个变量所在的类上有个注解是定义了这个前缀是spring.resources

![](http://qiniuyun.zijie.fun/20200413233302.png)

所以我们在application.properties中，配置一个这个前缀加上staticLocations的配置，就可以实现自定义的静态资源的访问路径了。

```properties
spring.resources.static-locations=classpath:/myresources/
```

![](http://qiniuyun.zijie.fun/20200413233645.png)

![](http://qiniuyun.zijie.fun/20200413233655.png)

除了配置properties之外，还有另一种方式---那肯定就是通过注解的方式来配置啦~

首先注释掉properties的内容避免干扰，然后在包中创建一个类，重要的是实现**WebMvcConfigurer**接口，并重写**addResourceHandlers**方法，代码如下：

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("classpath:/myresources/");
    }
}
```

