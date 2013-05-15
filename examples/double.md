# 双日历

- order: 2

------------


首先需要引入样式文件，默认提供了一个 simple 主题。

````html
<link rel="stylesheet" href="../src/calendar.css" />
````

设置国际化支持：

````javascript
seajs.config({
    vars: {
        locale: 'zh-cn',
    }
});
````

## There is nothing to do

最简示例，没有任何特殊要求：

````html
<input id="date-nothing" type="text" />
````

````javascript
seajs.use('double-calendar', function(Calendar) {
    new Calendar({trigger: '#date-nothing'});
});
````
