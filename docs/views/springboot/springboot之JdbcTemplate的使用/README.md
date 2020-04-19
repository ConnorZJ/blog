---
title: SpringBoot之JdbcTemplate的使用（八）
date: 2020-04-17
tags:
 - spring boot
categories:
 - spring boot
---

# spring boot 之 JdbcTemplate 的使用

不管是在SpringMVC时代，还是现在的SpringBoot乃至SpringCloud，数据库的使用都是非常非常非常基础的。而在其中，往往有许多种集成数据持久化的方式，有JdbcTemplate，也有MyBatis，还有JPA等。接下来将要分成几个文章来学习一下在springboot中如何使用以上三种方式。

## JdbcTemplate项目初始化

1. 首先当然要创建一个项目，老规矩，先选择依赖。选择Web依赖、JDBC依赖和MySql驱动的依赖。

ps：如果不想使用Mysql，也可自行选择其他数据库的依赖。

![](http://qiniuyun.zijie.fun/20200419223051.png)

2. 接着配置一下pom文件，将mysql驱动的依赖的版本，换成适合当下使用的mysql版本的驱动依赖。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
    <version>5.1.44</version>
</dependency>
```

## 开始配置

在springboot中使用JdbcTemplate不需要做过多的配置，只要在application.properties中添加以下配置即可，这些配置，如果有springMVC经验的话，都很容易理解

```properties
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.url=jdbc:mysql://localhost:3306/jdbc?userSSL=false
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
```

以上就是一些数据库的驱动、url、用户名和密码。当然，根据url也能看到，我当前使用的数据库名是jdbc，只要根据自己的实际情况更改即可。

其中有一个userSSL=false，这个是因为在mysql某些版本及以上都需要使用SSL去连接，这里只是用来测试，所有就写false就好了。

当然还需要一个数据表，如下：

```sql
CREATE TABLE `jdbc`.`user`(  
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(32),
  `address` VARCHAR(32),
   KEY(`id`)
) ENGINE=INNODB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## 开始使用

首先创建一个User实体

```java
public class User {

    private Integer id;
    private String name;
    private String address;
	// getters and setters and toString
}
```

再创建一个UserService类，里面编写使用的实际代码

```java
@Service
public class UserService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int addUser(User user) {
        String name = user.getName();
        String address = user.getAddress();
        String sql = "insert into user(name,address) values(?,?)";
        int update = jdbcTemplate.update(sql, new Object[]{name, address});
        return update;
    }

}
```

在JdbcTemplate中，增删改一般都可以使用update方法，第一个参数放sql语句，第二个参数放参数数组即可。

## 测试效果

编写测试类如下：

```java
@SpringBootTest
class JdbctemplateApplicationTests {

    @Autowired
    private UserService userService;

    @Test
    void contextLoads() {
        User user = new User();
        user.setName("张三");
        user.setAddress("zhangsanAddress");
        userService.addUser(user);
    }

}
```

运行该测试类，在数据库中能看到，新增方法成功了。

![](http://qiniuyun.zijie.fun/20200419225132.png)

接下来再试一试查询方法。

在UserService中增加如下方法：

```java
public List<User> getUser(int id) {
    String sql = "select * from user where id = ?";
    RowMapper rowMapper = new RowMapper() {
        @Override
        public User mapRow(ResultSet resultSet, int i) throws SQLException {
            User user = new User();
            user.setId(resultSet.getInt("id"));
            user.setName(resultSet.getString("name"));
            user.setAddress(resultSet.getString("address"));
            return user;
        }
    };
    List<User> users = jdbcTemplate.query(sql, new Object[]{id}, rowMapper);
    return users;
}
```

然后再在测试方法中调用这个方法，运行效果如下：

![](http://qiniuyun.zijie.fun/20200419225525.png)

更改和删除方法与之类似，就不在这里赘述了，有兴趣的可以自己去试一试。