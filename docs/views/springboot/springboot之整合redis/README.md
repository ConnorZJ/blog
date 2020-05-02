---
title: SpringBoot之整合redis（十一）
date: 2020-04-25
tags:
 - spring boot
categories:
 - spring boot
---

众所周知，redis是一种nosql，它的速度非常快，因为它采用的是内存读写，完全基于内存，数据结构也简单，使用单线程，避免了没必要的上下文切换等等。

## 开始使用

既然redis这么好，我肯定要学习如何使用它。首先创建一个springboot项目，依赖勾选web、redis依赖。

springboot自动配置的redis底层是lettuce，一般我们使用的是Jedis，但在此处只是演示，就只使用lettuce，若要使用Jedis，则在pom中引入Jedis依赖，再排除lettuce即可。

```properties
spring.redis.database=0
spring.redis.host=106.15.44.65
spring.redis.port=6379
spring.redis.password=123456
```

配置只需配这些即可，但前提是要保证你的redis客户端支持远程访问。

redis在springboot中的配置都是靠**RedisAutoConfiguration**这个类

```java
@Configuration(
    proxyBeanMethods = false
)
@ConditionalOnClass({RedisOperations.class})
@EnableConfigurationProperties({RedisProperties.class})
@Import({LettuceConnectionConfiguration.class, JedisConnectionConfiguration.class})
public class RedisAutoConfiguration {
    public RedisAutoConfiguration() {
    }

    @Bean
    @ConditionalOnMissingBean(
        name = {"redisTemplate"}
    )
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) throws UnknownHostException {
        RedisTemplate<Object, Object> template = new RedisTemplate();
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }

    @Bean
    @ConditionalOnMissingBean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) throws UnknownHostException {
        StringRedisTemplate template = new StringRedisTemplate();
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }
}
```

能够看到第三个方法使用到的是**StringRedisTemplate**，这个是用来处理字符串类型的变量的bean，接下来我们就能够在例子中通过它去使用。

```java
@RestController
public class RedisController {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @GetMapping("/get")
    public String get() {
        ValueOperations<String, String> ops = stringRedisTemplate.opsForValue();
        String name = ops.get("name");
        return name;
    }

    @GetMapping("set")
    public void set() {
        ValueOperations<String, String> ops = stringRedisTemplate.opsForValue();
        ops.set("name","zhangsan");
        stringRedisTemplate.expire("name",1000, TimeUnit.SECONDS);
    }
}
```

这里写了两个简单的例子，先调用set方法，在redis中写入一个name的key，value为zhangsan，设置过期时间是1000，单位是秒。

![](http://qiniuyun.zijie.fun/20200502132432.png)

在redis中可以看到这个键值对也被设置成功了，接下来调用get方法。

![](http://qiniuyun.zijie.fun/20200502132514.png)

能够看到，在springboot中使用redis是非常简单的一件事！