(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{351:function(t,a,n){"use strict";n.r(a);var s=n(2),r=Object(s.a)({},(function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h1",{attrs:{id:"快速入门"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#快速入门"}},[t._v("#")]),t._v(" 快速入门")]),t._v(" "),n("h2",{attrs:{id:"构建方式"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#构建方式"}},[t._v("#")]),t._v(" 构建方式")]),t._v(" "),n("p",[t._v("spring boot项目可以通过以下几种方式搭建")]),t._v(" "),n("ul",[n("li",[t._v("在spring boot网站通过maven构建下载一个压缩包，导入至IDE中")]),t._v(" "),n("li",[t._v("使用idea快速搭建出一个spring boot项目")]),t._v(" "),n("li",[t._v("......")])]),t._v(" "),n("p",[t._v("这里展示两种搭建spring boot项目的方式")]),t._v(" "),n("h3",{attrs:{id:"_1-maven构建"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-maven构建"}},[t._v("#")]),t._v(" 1.maven构建")]),t._v(" "),n("p",[t._v("首先访问"),n("a",{attrs:{href:"https://start.spring.io/",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://start.spring.io/"),n("OutboundLink")],1),t._v("，project选择Maven Project，language选择Java，spring boot版本选择默认版本，项目元数据根据自己的需要填写，比如packaging方式是Jar还是War，JDK版本是8或以上等，构建方式是Maven，所以可以在dependencies中选择要依赖的东西，详细细节可以参考下图\n"),n("img",{attrs:{src:"http://qiniuyun.zijie.fun/springboot-io.png",alt:"image"}}),t._v("\n信息填写完成后，点击绿色的Generate，或者快捷键Ctrl+回车即可下载压缩包，解压之后用IDE将文件夹通过引入Maven项目的方式引入即可。")]),t._v(" "),n("h3",{attrs:{id:"_2-idea构建"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-idea构建"}},[t._v("#")]),t._v(" 2. idea构建")]),t._v(" "),n("p",[t._v("使用idea构建spring boot项目同样很方便快速，在idea中new project，左边选择Spring Initializr，右边选择JDK，下面让你选择Service URL，默认的正好就是第一种构建方式的访问地址，可以想象得到，idea其实也是通过第一种方式创建spring boot项目的。\n"),n("img",{attrs:{src:"http://qiniuyun.zijie.fun/idea1.png",alt:"image"}}),t._v("\n点击next就到下一步，输入项目的元数据\n"),n("img",{attrs:{src:"http://qiniuyun.zijie.fun/idea2.png",alt:"image"}}),t._v("\n再点击next，就到了选择依赖的地方，还能选择spring boot的版本号，之后再finish\n"),n("img",{attrs:{src:"http://qiniuyun.zijie.fun/idea3.png",alt:"image"}}),t._v("\n这样进入idea的界面后，Maven会自动引入spring boot所需要的依赖包，一个spring boot项目就这样搭好了。")]),t._v(" "),n("h2",{attrs:{id:"项目结构介绍"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#项目结构介绍"}},[t._v("#")]),t._v(" 项目结构介绍")]),t._v(" "),n("p",[t._v("如一般的Maven/SSM工程一样，项目目录中分别含有java、resources、test的文件夹，分别用以存放Java文件、配置文件和测试文件，还有着pom.xml，但却缺少了web.xml文件和applicationContext.properties等文件，这是为什么呢？")]),t._v(" "),n("blockquote",[n("p",[t._v("spring boot遵循着约定优于配置的理念，特点是简单、快速和便捷。spring boot提供了一系列的Starter依赖来简化jar包的配置。")])]),t._v(" "),n("p",[t._v("所以我们创建了一个spring boot项目之后，一切工作都如我们创建了普通的SSM框架的默认配置一样，接下来，我在包结构中创建一个controller，里面写一个简单的返回字符串的方法。")]),t._v(" "),n("p",[t._v("src/main/java/org.connor.springbootdemo.controller")]),t._v(" "),n("h5",{attrs:{id:"ps-controller的package目录要和springbootdemoapplication在同一级"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#ps-controller的package目录要和springbootdemoapplication在同一级"}},[t._v("#")]),t._v(" Ps:controller的package目录要和SpringbootDemoApplication在同一级")]),t._v(" "),n("div",{staticClass:"language-Java line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-java"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("package")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token namespace"}},[t._v("org"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("connor"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("springbootdemo"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("controller")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token namespace"}},[t._v("org"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("springframework"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("web"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("bind"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("annotation")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("GetMapping")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token namespace"}},[t._v("org"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("springframework"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("web"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("bind"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("annotation")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("RestController")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n * created by Connor Xiong\n */")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@RestController")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HelloController")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@GetMapping")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/hello"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("sayHello")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Hello Connor!"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br"),n("span",{staticClass:"line-number"},[t._v("7")]),n("br"),n("span",{staticClass:"line-number"},[t._v("8")]),n("br"),n("span",{staticClass:"line-number"},[t._v("9")]),n("br"),n("span",{staticClass:"line-number"},[t._v("10")]),n("br"),n("span",{staticClass:"line-number"},[t._v("11")]),n("br"),n("span",{staticClass:"line-number"},[t._v("12")]),n("br"),n("span",{staticClass:"line-number"},[t._v("13")]),n("br"),n("span",{staticClass:"line-number"},[t._v("14")]),n("br"),n("span",{staticClass:"line-number"},[t._v("15")]),n("br"),n("span",{staticClass:"line-number"},[t._v("16")]),n("br")])]),n("p",[t._v("然后右键点击SpringbootDemoApplication，点击run，虽然我没有手动配置Tomcat服务器，但是因为spring boot内置了Tomcat，所以run之后就是Tomcat启动起来了。\n"),n("img",{attrs:{src:"http://qiniuyun.zijie.fun/spring-boot-1.png",alt:"image"}}),t._v("\n在浏览器上输入localhost:8080/hello，就可以看到在HelloController中方法返回的字符串了。\n"),n("img",{attrs:{src:"http://qiniuyun.zijie.fun/spring-boot-2.png",alt:"image"}})])])}),[],!1,null,null,null);a.default=r.exports}}]);