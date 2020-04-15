---
title: SpringBoot之JSON解析（六）
date: 2020-04-12
tags:
 - spring boot
categories:
 - spring boot
---

# spring boot 之 ControllerAdvice注解的用法

@ControllerAdvice这个注解不是在springboot独有的，它在springMVC就已经被广泛的使用了，但为什么还要在springboot之中重新学习如何使用呢？**那还不是我以前没怎么使用过嘛​ :joy:(逃过的课还是要补回来的)**

## ControllerAdvice的使用场景

@ControllerAdvice注解看名字就能够知道，是对Controller类的一个增强。到底如何增强呢？来看看它的功能有哪些。

- 全局异常处理
- 全局数据绑定
- 全局数据预处理

## 全局数据绑定

全局数据绑定可以用来在每个Controller类中，使用到一些全局的初始化的数据。只要在ControllerAdvice中配置一下，就能够达到初始化参数的效果。

首先创造一个类，标记上ControllerAdvice注解，然后在里面方法定义一个List集合，并给这个集合赋值，在方法上添加一个ModelAttribute注解，并在此注解的参数給一值。这样，就达到了集合与这个值绑定了的效果。

```java
@ControllerAdvice
public class ControllerAdviceConfig {

    @ModelAttribute(value = "username")
    public List<String> initListData() {
        List<String> list = new ArrayList<>();
        list.add("张三");
        list.add("李四");
        list.add("王五");
        return list;
    }

}
```

接下来就是使用这个集合的时候了，在Controller中新建一个方法，方法参数就放一个Model对象，使用model.asMap()方法就能将全局绑定的数据取出来，取出的格式是一个map集合，key是在ModelAttribute中定义的，value自然就与之绑定的值。此时我们将这个值取出来，并且强转成List。

```java
@RestController
public class HelloController {

    @GetMapping("/listAll")
    public List<String> listAll(Model model) {
        Map<String, Object> usernameMap = model.asMap();
        List<String> usernameList = (List<String>) usernameMap.get("username");
        return usernameList;
    }

}
```

页面上可以看到效果，返回的就是在initListData中存入的list集合的数据。

![](http://qiniuyun.zijie.fun/20200414231858.png)

## 全局数据预处理

假如我有两个对象，一个Parent和一个Son，他们的属性都是name和age，那么我在controller方法里同时接收这两个对象，同时请求中也传入name和age的值，此时会发生什么呢？

```java
public class Parent {
    private String name;
    private Integer age;

	// getters and setters and toString
}
public class Son {
    private String name;
    private Integer age;

	// getters and setters and toString
}
```

```java
@RestController
public class HelloController {

    @PostMapping("/save")
    public void saveParent(Parent parent, Son son){
        System.out.println(parent);
        System.out.println(son);
    }

}
```

![](http://qiniuyun.zijie.fun/20200414234042.png)

![](http://qiniuyun.zijie.fun/20200414233954.png)

通过上述测试，可以看到，方法入参根本判断不了name和age到底应该给到哪个对象，这个时候就到了**ControllerAdvice**大展身手的时候了！

```java
@ControllerAdvice
public class ControllerAdviceConfig {

    @InitBinder(value = "parent")
    public void initParent(WebDataBinder binder){
        binder.setFieldDefaultPrefix("parent.");
    }

    @InitBinder(value = "son")
    public void initSon(WebDataBinder binder){
        binder.setFieldDefaultPrefix("son.");
    }

}
```

```java
@PostMapping("/save")
public void saveParent(@ModelAttribute("parent") Parent parent, @ModelAttribute("son") Son son) {
    System.out.println(parent);
    System.out.println(son);
}
```

在ControllerAdvice配置中，添加如上两个方法，含义是：分别将传入的入参的前缀绑定到相应的对象之中，此时重启项目并再测试一下。

![](http://qiniuyun.zijie.fun/20200414234623.png)

![](http://qiniuyun.zijie.fun/20200414234635.png)

可以看到，数据预处理成功了。

## 全局异常处理

ControllerAdvice最广泛使用的场景，就是处理全局异常了。

什么 处理全局异常？我的理解是，在controller的每一个方法都有可能抛出异常，有时候异常可能是自己定义的，有时候异常也可能是RunTimeException。这种情况下，在每一个方法里处理，就会显得比较累赘，而通过全局异常处理，可以达到配置一处而处处生效的效果。比如说是，在ControllerAdvice中配置了返回异常的信息，前端就能看到到底是什么异常被抛出了，而不是各种异常不同格式。

```java
@RestController
public class HelloController {

    @GetMapping("/null")
    public Parent getNullPoint() {
        Parent parent = null;
        parent.getName();
        return parent;
    }

}
```

首先在controller中故意设置一个会抛空指针的错，然后在配置中增加以下代码：

```java
@ControllerAdvice
public class ControllerAdviceConfig {

    @ExceptionHandler(NullPointerException.class)
    public void handleNullPointException(NullPointerException e,HttpServletResponse response) throws IOException {
        response.setContentType("text/html;charset=utf-8");
        try (PrintWriter writer = response.getWriter()) {
            writer.write("空指针异常！");
            writer.flush();
        }
    }

}
```

ExceptionHandler注解是用来声明处理哪一个异常的，比如这里声明处理空指针异常，那么在controller中抛出了空指针异常的时候，都会走到这个方法里面

![](http://qiniuyun.zijie.fun/20200415001800.png)

之后也可以写多个类似这个的方法，声明不同的异常，可以让处理的异常类型丰富起来，也可以在方法里返回一个视图ModelAndView或者返回一个错误对象，这种方式也是一种**前端友好向**的做法！