---
title: SpringBoot之配置文件（二）
date: 2020-03-25
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

### 普通注入

1. 在application.properties中添加如下代码

```properties
person.name=张三
person.age=18
person.address=Mars
```

2. 在项目下创建一个javaBean，包含name，age，address属性

```java
@Component
@PropertySource("classpath:application.properties")
public class Person {
    @Value("${person.name}")
    private String name;
    @Value("${person.age}")
    private Integer age;
    @Value("${person.address}")
    private String address;
    
    // getters and setters
    
}
```

此处用了3个注解，分别是：

- @Component注解用来表示这个类由spring管理，把普通的pojo类实例化到spring容器中
- @PropertySource注解作用是加载指定的.properties文件到spring的环境之中，配合@Value使用
- @Value注解作用是将.properties中的对应的属性的值，注入到当前使用此注解的属性上面去

3. 在controller中注入Person类，将person打印出来，看看是否能注入属性成功

![image-20200331221247939](http://qiniuyun.zijie.fun/image-20200331221247939.png)

![image-20200331221611148](http://qiniuyun.zijie.fun/image-20200331221611148.png)

这里能看得到，person的属性通过properties注入成功了，但是中文出现了乱码，只要在setting中把项目的编码设置成utf-8，把*Transparent native-to-ascii conversion*前面的勾勾上，再重新编辑一下properties文件即可显示正确的字符了。

![image-20200331231211034](http://qiniuyun.zijie.fun/image-20200331231211034.png)

### 其他方式注入

上面的方法是一般情况下使用的，但是有个缺点，就是application.properties文件的属性中，person的前缀都是一样的，只是后面的名字不同，作为一个程序员，肯定要找到更加高(偷)效(懒)的方式去写呀！

所以这个时候介绍另一种注入的方式，首先将JavaBean中的@Value注解全都去掉，而在类名上增加一个注解@ConfigurationProperties

![image-20200331232254800](http://qiniuyun.zijie.fun/image-20200331232254800.png)

可以看到，这个注解的参数中，有一个prefix，顾名思义，是去properties中寻找以person为前缀的属性，注入到JavaBean中去。

**注：JavaBean的属性名称必须和properties文件中的后缀保持一致**

### yaml文件方式注入

使用yaml文件做配置的话，可以替换掉application.properties，创建一个文件名为application.yml或者application.yaml的文件。

**yaml配置是有序的，properties配置是无序的**

**自定义的yaml文件尚不支持使用@PropertySource注解直接注入到项目之中**

下面来看看如何使用yaml配置

1. 首先创建一个application.yml，语法是k: v，需要注意的是，冒号后面与值之间要有一个空格

```yaml
server:
  port: 8081
  servlet:
    context-path: /connor
```

![image-20200331234454804](http://qiniuyun.zijie.fun/image-20200331234454804.png)

启动项目之后，就能看到项目的端口号改变了，项目的context-path路径也改变了。

2. 之前说到yaml文件是有序的，那么怎么体现出它的有序呢

现在再在yaml中添加一下属性

```yml
server:
  port: 8081
  servlet:
    context-path: /connor
cluster:
  hosts:
    - 192.168.0.1
    - 192.168.0.2
    - 192.168.0.3
```

创建一个Cluster类

```java
@Component
@ConfigurationProperties(prefix = "cluster")
public class Cluster {
    List<String> hosts;
    
    // getters and setters
    // toString()
}
```

然后在controller中注入这个类，并打印出这个对象

![image-20200331235230413](http://qiniuyun.zijie.fun/image-20200331235230413.png)

所以，yaml配置能够注入一个数组/集合，同时也是保持有序的方式注入。

## 配置文件优先级

### 哪种文件优先级高

如果说，我在项目路径下，同时存在着两种配置文件，分别是application.properties和application.yml，且每个文件的内容不一样，那么springboot项目启动之后，将会使用哪一个配置呢？

带着这个问题，我同时创建了这两个文件，且让其中的内容不一致

```properties
server.port=8081
server.servlet.context-path=/properties
```

```yaml
server:
  port: 8082
  servlet:
    context-path: /yml
```

在properties中设置端口为8081，路径为properties，在yaml文件里设置端口为8082，路径为yml，接下来，就到了启动项目的时候了

![image-20200402234512731](http://qiniuyun.zijie.fun/image-20200402234512731.png)

项目启动后，可以看到，Tomcat的端口被设置成了8081，路径为properties，这样一来，就知道了在项目启动的时候，会去调用properties的配置了。

**但是结果果真如此吗？**

在yml中，继续添加如下代码，再重新启动项目，将cluster对象打印出来

```yaml
cluster:
  hosts:
    - 192.168.0.1
    - 192.168.0.2
    - 192.168.0.3
```

![image-20200402235157255](http://qiniuyun.zijie.fun/image-20200402235157255.png)

通过控制台打印可以看到，端口是8081没错，使用的是**properties**的配置，但同时还能打印出Cluster对象的属性，这个是由**yml**配置的。

至此能够得出一个结论：**在properties和yml配置文件同时存在的时候，项目会将这两个配置同时加载进去，但是properties的优先级比yml高，所以不同的文件下的相同的配置，优先级高的会覆盖掉优先级低的。**

## 配置文件位置问题

### 配置文件那应该放在哪里呢

springboot配置文件可以放在一下四个地方

![image-20200407213856326](http://qiniuyun.zijie.fun/image-20200407213856326.png)

在这几个地方放配置文件，即可用于springboot项目使用

### 哪个地方的优先级高呢

既然能放在多个地方，那么，很明显的问题就出现在了脑海中，假如我这四个文件都存在，那项目启动的时候优先加载哪里地方得配置文件呢？

于是我分别在这四个不同的地方，创建四个application.properties文件，然后在文件内容里面设置一个name的属性，在项目启动后，将这个name属性注入到对象中，并且打印出来，就知道哪一个优先级高，哪一个优先级低了。

而且打印第一个文件位置之后，将那个文件移除掉，继续重启项目，这样就能有了一个比较直观的感受——能够知道加载的顺序！

所以下面进行测试，打印出的顺序如下：

```properties
project/config/application.properties
```

```properties
project/application.properties
```

```properties
classpath/config/application.properties
```

```properties
classpath/application.properties
```

从以上结果，我们能够知道不同地方的配置文件的优先级哪一个高了！

### 自定义配置文件位置

既然不同的位置的优先级不同，那么又有一个疑问了，如果我想指定一个位置的配置生效，这该怎么做呢？

其实这种情况，我们可以通过命令行的方式指定某个配置文件，比如：

```bash
java -jar springboot-demo.jar --spring.config.location=classpath:/application.properties
```

如果在IDEA中启动项目的话，可以在配置启动参数的地方加上一个启动命令

![image-20200407215521417](http://qiniuyun.zijie.fun/image-20200407215521417.png)

这样就能通过自定义的配置文件来启动项目了。