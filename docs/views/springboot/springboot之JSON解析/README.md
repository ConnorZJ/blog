---
title: SpringBoot之JSON解析（四）
date: 2020-04-12
tags:
 - spring boot
categories:
 - spring boot
---

# spring boot 之 JSON 解析（四）

## JSON有什么用

JSON (JavaScript Object Notation, JS 对象标记) 是一种轻量级的数据交换格式。它基于 ECMAScript (w3c制定的js规范)的一个子集，采用完全独立于编程语言的文本格式来存储和表示数据。简洁和清晰的层次结构使得 JSON 成为理想的数据交换语言。 易于人阅读和编写，同时也易于机器解析和生成，并有效地提升网络传输效率。

说到底，JSON就是用来进行数据交互的那个**数据**。在前后端分离的情况下，前端负责数据展示，后台负责处理业务逻辑，这之间数据交互时，就可以用到JSON了。

## 怎么在项目中使用

在spring4以前，可以在controller的方法上加上注解@ResponseBody，这个注解表明该对象是需要序列化成JSON字符串返回的，而也可以在参数前加上注解@RequestBody，表示这个入参接收到的是JSON字符串，需要被反序列化成对象使用。

在spring4以后，可以用上@RestController注解在controller类上，可以实现统一配置，这样就不需要在每一个方法前加上注解了。

不管是对象序列化成JSON字符串，还是JSON字符串反序列化成对象，底层这种灵活的消息转换机制就是通过一个类：HttpMessageConverter来实现的。我们在springboot项目中，可以找到一个类*HttpMessageConvertersAutoConfiguration*,在里面可以看到：

- 有个条件注解是存在HttpMessageConverter类才生效

  ```java
  @ConditionalOnClass({HttpMessageConverter.class})
  ```

- 还有个注解表示在项目中可以自动配置三种JSON工具，分别是Jackson、Gson和Json-B

  ```java
  @Import({JacksonHttpMessageConvertersConfiguration.class, GsonHttpMessageConvertersConfiguration.class, JsonbHttpMessageConvertersConfiguration.class})
  ```

接下来看看怎么使用

### Jackson的使用

创建一个springboot项目，依赖只勾选Web依赖就可以了，在Maven依赖中可以看到，web依赖了json，json默认又依赖了jackson，所以，我们在Controller中添加一个@RestController注解，就能够用到Jackson了。

![](http://qiniuyun.zijie.fun/20200412130148.png)

下面创建一个bean类对象，一个controller，在controller中创建若干个Person对象并返回

```java
@RestController
public class PersonController {

    @GetMapping(value = "/list")
    public List<Person> listAll(){
        List<Person> list = new ArrayList<Person>();
        for(int i=0;i<10;i++)
        {
            Person p = new Person();
            p.setName("张"+i);
            p.setAddress("地址"+i);
            p.setBirthday(new Date());
            list.add(p);
        }
        return list;
    }
}
```

然后启动项目，输入访问地址，可以看到效果图

![](http://qiniuyun.zijie.fun/20200412130609.png)

### 自定义格式

emmmmmmm，效果是出来了，但是这个日期格式有点看得不顺眼**

既然是Jackson是一个JSON，那肯定可以配置的呀~

首先在Person对象的birthday属性上，加上这么一行注解

```java
public class Person {
    private String name;
    private String address;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date birthday;
	
	// getters and setters
}
```

表示要将birthday以特定的格式年-月-日输出，接下来重启项目看看效果

![](http://qiniuyun.zijie.fun/20200412131033.png)

这样就看得顺眼多了！

**但转头一想，如果项目里面有很多的这种日期属性的对象，那么我要在每一个这样的属性上都加上这一行注解吗？**

### 深入浅出

其实不用，我们可以实现统一化配置

首先我们来看一看Jackson是怎么默认实现的，找到类**JacksonHttpMessageConvertersConfiguration**，看到其中有一个方法是：

![](http://qiniuyun.zijie.fun/20200412131941.png)

这个表示，如果MappingJackson2HttpMessageConverter类没有提供这样一个bean的话，springboot就会使用这个默认的bean来配置，那我如果自己提供一个MappingJackson2HttpMessageConverter的bean会怎么样呢？

**想了就做**，首先在路径下创建一个config包，在里面创建JsonMvcConfig类，类的内容如下：

```java
@Configuration
public class JsonMvcConfig {

    @Bean
    MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter(){
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        ObjectMapper om = new ObjectMapper();
        om.setDateFormat(new SimpleDateFormat("yyyy/MM/dd"));
        converter.setObjectMapper(om);
        return converter;
    }

}
```

接下来，注释掉Person类属性里的@JsonFormat注解，重启项目，就能看到效果了

![](http://qiniuyun.zijie.fun/20200412132733.png)

到现在我们也能看到，重新提供了一个MappingJackson2HttpMessageConverter的bean，能够是springboot使用我们自定义的方法，而其中真正生效的，其实是ObjectMapper类。

我们在看看另一个类：**JacksonAutoConfiguration**，在其中能看到

![](http://qiniuyun.zijie.fun/20200412133248.png)

这个和上一个类似，也是缺省使用了**ObjectMapper**的bean，那如果我不提供**MappingJackson2HttpMessageConverter**，而使用**MappingJackson2HttpMessageConverter**行得通吗？

```java
@Configuration
public class JsonMvcConfig {

//    @Bean
//    MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
//        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
//        ObjectMapper om = new ObjectMapper();
//        om.setDateFormat(new SimpleDateFormat("yyyy/MM/dd"));
//        converter.setObjectMapper(om);
//        return converter;
//    }

    @Bean
    ObjectMapper objectMapper() {
        ObjectMapper om = new ObjectMapper();
        om.setDateFormat(new SimpleDateFormat("yyyy-MM-dd"));
        return om;
    }

}
```

把上面的代码改一改，现在只提供**ObjectMapper**，试一试能不能生效

![](http://qiniuyun.zijie.fun/20200412133719.png)

**答案是可以的！！**

至此，就可以比较了解了，JSON在springboot中是如何生效的，以及自定义配置JSON的格式。

### Gson的使用

上面介绍了如何使用Jackson，而springboot中提供了除Jackson外，还有Gson的配置。

要使用Gson，首先修改一下pom文件

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-json</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
</dependency>
```

将jackson的依赖排除掉，并引入gson依赖，可以看到gson没有版本号，这时因为springboot-start以及集成了gson



### fastjson的使用

