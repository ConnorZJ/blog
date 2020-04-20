---
title: SpringBoot之整合MyBatis（九）
date: 2020-04-17
tags:
 - spring boot
categories:
 - spring boot
---

# spring boot 之整合 MyBatis

这一章接着上一章的JdbcTemplate来说。

一般来讲，JdbcTemplate不会在项目中真正使用的，而经常使用的到的就是MyBatis和JPA了。MyBatis是一个支持SQL查询，存储过程和高级映射的持久层框架，和JdbcTemplate不同的是，我们可以不用对结果集进行处理，而能直接获得返回对象。

下面开始使用！

## 创建项目

首先创建一个springboot项目，依赖勾选web、mysql驱动依赖和MyBatis依赖即可。

在pom文件中可以看到，springboot项目提供原生的依赖的话，是以spring-boot-starter-xxx形式写的，而mybatis的依赖则是xxx-spring-boot-starter，这个说明mybatis并不是spring官方提供的，而是由第三方提供的。虽然不知道这个有什么用处，不过还是觉得奇怪的知识增加了。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.2</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
    <version>5.1.44</version>
</dependency>
```

## 开始配置

```properties
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/jdbc
spring.datasource.username=root
spring.datasource.password=123456

mybatis.mapper-locations=classpath:/mapper/*.xml
```

在SSM框架中用过mybatis的同学应该都知道，一般mybatis是以一个接口对应着一个mapper.xml文件生效的。这里就定义一下mapper.xml文件的存放地址，就放在resources下面的mapper文件夹下，下面所有的.xml文件都是mapper的文件。

## 撸代码

接下来就是老套路了，创建一个UserService，一个UserDao，还有一个user-mapper.xml。

```java
@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    public List<User> listAllUsers() {
        return userDao.listUser();
    }

}
```

```java
@Repository
public interface UserDao {

    List<User> listUser();

}
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="org.connor.mybatis.dao.UserDao">

    <select id="listUser" resultType="org.connor.mybatis.bean.User">
        select * from user ;
    </select>

</mapper>
```

这里的mapper.xml中，namespace写的是对应的UserDao的包路径+名字，这样配置，那么就会让UserDao和user-mapper.xml绑定。需要注意的是，在xml中写的sql语句的id，要和dao中的方法名保持一致。

## 测试效果

```java
@SpringBootTest
class MybatisApplicationTests {

    @Autowired
    private UserService userService;

    @Test
    void contextLoads() {

        System.out.println(userService.listAllUsers());

    }

}
```

普普通通的一个测试方法，点击运行看看效果：

![](http://qiniuyun.zijie.fun/20200420230900.png)

可以看到，在springboot中整合mybatis还是非常方便的，所以我想说一句，**springboot牛逼**。

