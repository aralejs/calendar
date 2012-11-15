# 双日历

- order: 2

------------

Calendar 组件本身并未实现双日历的功能，但是只需要一点点代码便可实现。


## Setup

同基本用法，首先需要引入样式文件，默认提供了一个 simple 主题。

````html
<link rel="stylesheet" href="../src/calendar.css" />
````

设置国际化支持：

````javascript
seajs.config({
    locale: 'zh-cn',
    preload: ['seajs/plugin-i18n']
});
````

## Do the work

````html
<label for="date-start">Start</label>
<input id="date-start" type="text" />

<label for="date-end">End</label>
<input id="date-end" type="text" />
````

````javascript
seajs.use(['jquery', 'calendar'], function($, Calendar) {
    var start = new Calendar({trigger: '#date-start'});
    var end = new Calendar({trigger: '#date-end'});

    start.on('selectDate', function(date) {
        end.range([date, null]);
    });

    end.on('selectDate', function(date) {
        start.range([null, date]);
    });
});
````

## Talk aloud

可以看到，其实就是动态设置 range。

下一步计划，增强 range 的写法，比如这样：

```javascript
new Calendar({trigger: "#date-start", range: [null, "#date-end"]});
new Calendar({trigger: "#date-end", range: ["#date-start", null]});
```
