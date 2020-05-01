---
title: SpringBoot之整合JPA（十）
date: 2020-04-22
tags:
 - spring boot
categories:
 - spring boot
---

今天学习的是springboot中的Spring Data JPA，那么，JPA是什么？

JPA是Java Persistence API的简称，中文名字是Java持久层API。**它是Sun公司提出的一种持久化规范**，提供了一套仅仅是规范的东西，而真正使用它，靠的是Hibernate等厂商实现了这套规范后提供的一套产品。

Spring Data JPA是Spring官方在基于现有的ORM框架、JPA规范，以Hibernate为基础构建的一套解决方案，以非常方便的方式提供给用户访问数据库和操作，简化了常用的增删改查等功能的使用。

下面来看看Spring Data JPA如何使用！

## 构建项目

首先创建一个springboot项目，依赖选择Web、Mysql Driver和JPA三个依赖。

![](http://qiniuyun.zijie.fun/20200501112713.png)

进入项目之中，第一肯定是要创建一个实体类

```java
@Entity(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String address;
    
    // getters and setters
    
}
```

可以看到实体类上有个注解是@Entity，这个注解是必须的，它的作用是标注这个类是一个数据表对应的实体类，数据库中创建的表名要和类名保持一致。name属性是可选的，表示对应着数据库中的表。

@Id注解也是必须的，它修饰的属性表示数据表中的主键，若不标注则报错。

@GeneratedValue注解的用处是标注主键的生成策略，strategy属性填所要选择的策略。一般有四个策略，分别是AUTO、IDENTITY、SEQUENCE、TABLE，若不选择，则会默认使用AUTO，由JPA自动选择合适的策略。IDENTITY则是采用数据库主键自增的策略。

另外还有一个@Column注解，这个注解也是放在属性之上，表示这个字段对应着数据表中字段的详细信息，有name、nullable、length属性。name表示该表字段名，默认属性名和字段名一致。nullable表示该字段是否可以为空。length表示该字段的长度。

除了以上注解之外还有很多注解能够使用，在此就不一一描述。

那么说了这么多注解能够对应数据表的信息，他们是怎么真正用到的呢？

接下来看看application.properties文件：

```properties
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/jdbc?userSSL=false&serverTimezone=GMT

spring.jpa.show-sql=true
spring.jpa.database=mysql
spring.jpa.database-platform=mysql
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL57Dialect
```

除了上面的mysql驱动配置之外，主要是要来看看下面的JPA的配置。

spring.jpa.show-sql：表示是否展示sql语句，默认为false。如为true的话，则在使用JPA后，会在控制台将执行的sql语句打印出来。

下面两个是选择数据库平台信息，这里使用的是mysql。

spring.jpa.hibernate.ddl-auto这个配置的用处是对表的ddl操作，它有四个对应的值，分别是：

- create：每次加载hibernate时，都会删除上一次的表，然后根据实体类生成对应的表，哪怕两次之间没有执行任何的数据的改变，也会执行此操作。若上一次的表中有数据的话，也会清空数据，这也是会导致数据表信息丢失的重要原因之一。
- create-drop：每次加载hibernate的时候都会根据实体类生成对应的表，但是在sessionFactory一关闭，表就会自动删除，比如是在关闭启动的项目的时候。
- update：第一次加载hibernate的时候，会根据实体类生成对应的表，之后再加载hibernate的时候，会根据实体类的更新自动更新表结构，而且不会删除以前的数据。
- validate：每次加载hibernate的时候，都会去校验数据表的结构，只会去校验结构，而不能去创建新的表。

spring.jpa.properties.hibernate.dialect这个配置是选择数据库对应的方言，这里选择mysql的。

接下来就是写重要的数据库接口了，来看看数据库接口怎么写：

```java
public interface UserDao extends JpaRepository<User, Integer> {

}
```

这样一个接口层就写好了，可以开始使用了:smile:

我第一次看到这个时候的反应是：**what？？？这样就没了？？？**

这里重要的东西是这个dao继承的JpaRepository接口，之前已经说过JPA是一套规范，而Hibernate则去实现了它，所以我们使用的时候，其实是调用JPA的接口，内容的话Hibernate已经帮我们实现好了。

## 开始使用

构建完了项目，接下来就是使用的时候了，首先创建一个Controller，用来接收请求

```java
@RestController
public class UserController {

    @Autowired
    private UserDao userDao;

    @GetMapping("/list")
    public List<User> listAll() {
        List<User> userList = userDao.findAll();
        return userList;
    }

}
```

![](http://qiniuyun.zijie.fun/20200501120342.png)

在数据库中已经先有两条数据了，在这里使用Postman请求这个接口看看效果：

![](http://qiniuyun.zijie.fun/20200501120438.png)

可以看到请求成功，也返回了数据

![](http://qiniuyun.zijie.fun/20200501120517.png)

也能看到控制台打印了执行的sql语句。

所以在springboot中，使用JPA就能非常方便的访问数据库，极大的简化了以前的操作。

## 使用关键字查询

回到JPARepository接口，可以看到它里面的方法。

![](http://qiniuyun.zijie.fun/20200501121351.png)

这里也有很多方法是我们不常用到的，但如果我们经常要使用增删改查的操作，建议将Dao接口继承CrudRepository接口

![](http://qiniuyun.zijie.fun/20200501121818.png)

在这个接口下，几乎所有方法都是适合在增删改查操作频繁的使用场景，例如是save、delete、findById。

下面举个findById的例子，在controller中使用这个方法：

```java
@RestController
public class UserController {

    @Autowired
    private UserDao userDao;

    @GetMapping("find")
    public User findById(HttpServletRequest request) {
        String id = request.getParameter("id");
        Optional<User> user = userDao.findById(Integer.valueOf(id));
        return user.get();
    }

}
```

这里已经将UserDao继承了CrudRepository，可以看到调用findById返回的是Optional<User>，这个东西是Java1.8开始有的，能够使对象不为空，避免空指针的错。

![](http://qiniuyun.zijie.fun/20200501122552.png)

能够看到，通过这种方法能够根据id查询到数据。

但这个时候有另一个疑问：如果我不是要根据id去查，而是要根据name这个字段去查数据怎么办，我可没有看到这个接口呀。

既然hibernate实现了JPA，肯定也考虑到这种情况了。

接下来我在UserDao中写一个方法

```java
public interface UserDao extends CrudRepository<User, Integer> {

    User findByName(String name);

}
```

使用这种方法名，就能够通过name这个字段查询到User的信息。下面测试一下：

```java
@RestController
public class UserController {

    @Autowired
    private UserDao userDao;

    @GetMapping("findByName")
    public User findByName(HttpServletRequest request) {
        String name = request.getParameter("name");
        User user = userDao.findByName(name);
        if (user != null) {
            return user;
        } else {
            return new User();
        }
    }

}
```

![](http://qiniuyun.zijie.fun/20200501125154.png)

hibernate中，可以使用特定的关键字去组合方法，这样就能够让hibernate自动配置sql语句进行查询。

关键字及其例子

| **Keyword**     | **Sample**                                                   | **JPQL snippet**                               |
| --------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| `And`           | `findByLastnameAndFirstname`                                 | `… where x.lastname = ?1 and x.firstname = ?2` |
| `Or`            | `findByLastnameOrFirstname`                                  | `… where x.lastname = ?1 or x.firstname = ?2`  |
| `Is`, `Equals`  | `findByFirstname`,`findByFirstnameIs`,`findByFirstnameEquals` | `… where x.firstname = ?1`                     |
| `Between`       | `findByStartDateBetween`                                     | `… where x.startDate between ?1 and ?2`        |
| `LessThan`      | `findByAgeLessThan`                                          | `… where x.age < ?1`                           |
| `LessThanEqual` | `findByAgeLessThanEqual`                                     | `… where x.age <= ?1`                          |
| `GreaterThan`   | `findByAgeGreaterThan`                                       | `… where x.age > ?1`                           |
| `...`           | `...`                                                        | `...`                                          |

除此之外还有很多关键字，详情见 [Spring Data JPA 官方文档]( https://docs.spring.io/spring-data/jpa/docs/2.2.7.RELEASE/reference/html/#jpa.query-methods) 

## 自定义sql查询

这一节讲的是如何使用自定义sql查询，因为在某个时候，除了官方提供的接口外，很难使用一个简单的方法去处理复杂逻辑的查询，这里就可以使用自己写的sql语句去查询。

```java
public interface UserDao extends CrudRepository<User, Integer> {

    @Query(value="select * from user where id = (select max(id) from user)",nativeQuery=true)
    User getMaxIdUser();

}
```

这里使用jpa的@Query注解，value中填入要使用的sql，nativeQuery使用true，表名是一条原生的查询语句。

```java
@RestController
public class UserController {

    @Autowired
    private UserDao userDao;

    @GetMapping("findMaxIdUser")
    public User findMaxIdUser() {
        User user = userDao.getMaxIdUser();
        if (user != null) {
            return user;
        } else {
            return new User();
        }
    }

}
```

![](http://qiniuyun.zijie.fun/20200501131533.png)

能够看到，通过这种方式，能够是jpa支持原生sql语句，接下来看一条插入的insert语句怎么使用。

```java
public interface UserDao extends CrudRepository<User, Integer> {

    @Query(value = "insert into user(name,address) values(?1,?2)", nativeQuery = true)
    @Modifying
    @Transactional
    Integer insertNewUser(@Param("name") String name, @Param("address") String address);

}
```

更新操作比查询操作略微复杂那么一点点，在sql语句中可以看到，values后面放的是**?1**和**?2**，这个表示接受在方法参数中接收的顺序，在方法参数中使用@Param注解来绑定变量。

除此之外，还要加上@Modifying注解，表明这是一个修改的操作，既然是更新，肯定也要加上@Transactional注解，这时一个事务的注解，如果不加则会报错。

```java
@RestController
public class UserController {

    @Autowired
    private UserDao userDao;

    @GetMapping("insertNewUser")
    public Integer insertNewUser(HttpServletRequest request) {
        String name = request.getParameter("name");
        String address = request.getParameter("address");
        Integer id = userDao.insertNewUser(name, address);
        return id;
    }

}
```

![](http://qiniuyun.zijie.fun/20200501133028.png)

![](http://qiniuyun.zijie.fun/20200501133038.png)

通过结果可以看到操作成功了！

以上就是在springboot中如何使用Spring Data JPA，学习使我进步，分享也希望能够帮助到大家！