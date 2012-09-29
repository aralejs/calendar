# Calendar Example

---

首先需要引入样式文件，默认提供了一个 simple 主题。

````html
<link rel="stylesheet" href="../src/themes/simple.css" />
````

设置国际化支持：

````javascript
seajs.config({
    locale: 'zh-cn',
    preload: ['http://seajs.org/dist/plugin-i18n']
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
    cal2.on('select-disabled-date', function(date) {
        $('#date-2-explain').text('you select a disabled date');
    });

    var cal3 = new Calendar({trigger: '#date-3', range: ['2012-12-12', null]});
});
````


双日历联动：

````html
<div class="cell">
    <input id="date-4" type="text" />
    <span id="date-4-explain"></span>
    <input id="date-5" type="text" />
    <span id="date-5-explain"></span>
</div>
````

````javascript
seajs.use(['jquery', 'calendar'], function($, Calendar) {
    var cal4 = new Calendar({trigger: '#date-4'});
    var cal5 = new Calendar({trigger: '#date-5'});
    cal4.on('select-date', function(date) {
        $('#date-4-explain').text('');
        cal5.range([date, null]);
    }).on('select-disabled-date', function(date) {
        $('#date-4-explain').text('not available');
    });
    cal5.on('select-date', function(date) {
        $('#date-5-explain').text('');
        cal4.range([null, date]);
    }).on('select-disabled-date', function(date) {
        $('#date-5-explain').text('not available');
    });;
});
````
