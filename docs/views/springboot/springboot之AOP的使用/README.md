---
title: SpringBoot之AOP的使用（七）
date: 2020-04-15
tags:
 - spring boot
categories:
 - spring boot
---

# spring boot 之AOP的使用

众所周知，springboot是基于spring应用的，spring的两大核心是DI和AOP，所以在springboot之中，这两个核心同样能体现出来。DI在springboot太常见了，随便找个源码都能看到的它的踪迹，本期就来讲讲AOP在springboot中如何使用。

## AOP的使用

aop其实用的地方也非常的广泛，比如说是打印日志，aop对于这个就非常的擅长。在每个方法进入前或者返回后，都能够通过aop来打印相关的日志。下面就直接来看看如何自定义这样的简易的日志。

首先创建一个controller类，这个肯定是必须的，日志都能在这里的方法前后打印输出。

```java
@RestController
public class HelloController {
    @GetMapping("/hello")
    public String printHello(HttpServletRequest request) {
        System.out.println("hello world!");
        return "hello";
    }
}
```

其次就是这次的重点了，创建一个aop的配置类，

```java
@Component
@Aspect
public class LogConfig {
    @Pointcut("execution(* org.connor.aop..*.*(..))")
    public void pointCut() {
    }

    @Before("pointCut()")
    public void beforePointCut() {
        System.out.println("before method!!!");
    }

    @After("pointCut()")
    public void afterPointCut() {
        System.out.println("after method!!!");
    }

    @AfterReturning("pointCut()")
    public void afterReturning() {
        System.out.println("after returning method!!!");
    }

    @AfterThrowing("pointCut()")
    public void afterThrowing() {
        System.out.println("after throwing method!!!");
    }

    @Around("pointCut()")
    public void around(ProceedingJoinPoint point) throws Throwable {
        System.out.println("before around method!!!");
        point.proceed();
        System.out.println("after around method!!!");
    }
}
```

首先这个类上定义两个注解，分别是注册成组件的component注解，和声明是切面的注解。

其次就是声明一个切点，这里使用@PointCut注解，里面的值是execution(* org.connor.aop..*.*(..))，其含义是：

第一个**“*”**号表示匹配任意的返回类型，两个**“.”**号表示匹配aop包及其所有的子包，第二个**“*”**号表示任意的类，第三个**“*”**表示匹配任意的方法，后年括号中的两个**“.”**表示匹配任意的参数，那么这个表达式就是匹配任意的类中的带有任意参数的任意方法。

在这里也可以把表达式换成execution(* org.connor.aop.controller* . *(..))，表示只匹配controller包下的所有类的方法。

接下来就将这个切点织入，就是一些前置通知，后置通知，环绕通知.......

接下来测试一下效果：

![](http://qiniuyun.zijie.fun/20200416232801.png)

这里能够看到通知都能够生效，其实在springboot中使用aop也是一件很方便的事，稍微做一些配置，就能够在项目中实现非常高大上的功能。