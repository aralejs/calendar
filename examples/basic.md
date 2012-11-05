# 基本用法

- order: 1

------------

首先需要引入样式文件，默认提供了一个 simple 主题。

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

最简示例

````html
<div class="cell">
    <input id="date-1" type="text" />
</div>
````

````javascript
seajs.use('calendar', function(Calendar) {
    var cal1 = new Calendar({trigger: '#date-1'});
});
````


不可选：

````html
<div class="cell">
    <input id="date-2" type="text" />
    <span id="date-2-explain"></span>
</div>
<div class="cell">
    <input type="text" id="date-3">
    <span id="date-3-explain"></span>
</div>
````

````javascript
seajs.use(['jquery', 'calendar'], function($, Calendar) {
    var range = function(time) {
        var day = time.day();
        return day != 2;
    };
    var cal2 = new Calendar({trigger: '#date-2', range: range});
    cal2.on('selectDisabledDate', function(date) {
        $('#date-2-explain').text('you select a disabled date');
    });

    var cal3 = new Calendar({trigger: '#date-3', range: ['2012-12-12', null]});
});
````
