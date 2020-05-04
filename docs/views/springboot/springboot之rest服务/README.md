---
title: SpringBoot之rest服务（十二）
date: 2020-04-27
tags:
 - spring boot
categories:
 - spring boot
---

REST是一种API的模式，一种风格，通过这种形式，我们能把API的风格统一起来。

而通过HTTP的几种请求方式，能够利用其指定对资源的操作类型，一般常用的HTTP方法包括GET、POST、DELETE、PUT等。

在springboot中构建一个restful的项目，是非常快捷方便的。再搭配Spring Data JPA使用，能极大地简化了日常的代码量。下面来看看如何使用！

## 搭建项目

首先创建一个springboot项目，依赖勾选web、jpa、mysql和**rest repositories**依赖。

创建一个实体类，待会测试用：

```java
@Entity(name = "person")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Integer age;

	// getters and setters
}
```

配置文件如下：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jdbc?userSSL=false&serverTimezone=GMT
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.database=mysql
spring.jpa.database-platform=mysql
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL57Dialect
```

当然还需要一个dao

```java
public interface PersonDao extends JpaRepository<Person,Integer> {
}
```

**一个简单的RESTful的springboot服务就已经搭建好了！**是不是非常的简单快捷！！！

## 开始使用

ps：这里使用postman测试效果

众所周知，HTTP的GET方法一般适用于查询某个资源的，在这个项目里，就使用下面的链接访问资源即可

http://localhost:8080/persons

这个是项目服务地址加上实体类名小写再加上一个's'，这样的话，就能将表中所有的数据查询出来

![](http://qiniuyun.zijie.fun/20200504100952.png)

可以看到，查询出来的数据是空的，这是因为表中还未添加数据，这里通过POST请求添加一条数据试试，添加新资源的方法是POST方法

![](http://qiniuyun.zijie.fun/20200504101501.png)

请求发送后，可以看到将这条数据返回了，表示资源添加成功！

返回的信息中，可以看到有个地址是http://localhost:8080/persons/1，这个表示在查询的地址后加上一个id，这样就能根据id进行查询了。

下面再添加几条数据，请求一下http://localhost:8080/persons试试效果

![](http://qiniuyun.zijie.fun/20200504101851.png)

可以看到，所有的数据被查询出来了，而且还带着分页的信息给我们，这个时候将请求地址修改成分页查询的接口http://localhost:8080/persons?page=1&size=2

![](http://qiniuyun.zijie.fun/20200504102114.png)

这个接口是请求第二页，每页两条数据的意思，能够看到，返回的除了数据，又给我们提供了first（第一页）、prev（上一页）、last（最后一页）的接口路径。

接下来看看如何进行更新操作：

![](http://qiniuyun.zijie.fun/20200504102513.png)

更新一般是用PUT方法，通过id，将要更新的数据写到请求体里，这样就能更新成功。

而删除方法也与以上类似，只需要通过DELETE方法，在将id传入即可删除：

![](http://qiniuyun.zijie.fun/20200504102705.png)

![](http://qiniuyun.zijie.fun/20200504102734.png)

可以看到删除成功！

以上就是使用自带的增删改查方法的使用。

## 自定义查询方法

以上的通用CRUD方法肯定不能满足日常需求，所以springboot rest也支持客制化的接口。

比如现在增加一个根据name的关键字查询，在JPA中，这样的方法应该写成如下形式：

```java
public interface PersonDao extends JpaRepository<Person, Integer> {

    List<Person> findPersonByNameContaining(@Param("name") String name);

}
```

接下来使用http://localhost:8080/persons/search可以查询出能够用到的所有自定义的方法：

![](http://qiniuyun.zijie.fun/20200504103317.png)

可以看到，现在就提供了一个**http://localhost:8080/persons/search/findPersonByNameContaining{?name}**的方法，下面使用试试看！

![](http://qiniuyun.zijie.fun/20200504103432.png)

能够看到，通过关键字'三'，能够查询出name中有三的数据！

定制化的接口就是这么简单使用。