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

## There is nothing to do

最简示例，没有任何特殊要求：

````html
<input id="date-nothing" type="text" />
````

````javascript
seajs.use('calendar', function(Calendar) {
    new Calendar({trigger: '#date-nothing'});
});
````


## You should focus on me

设定初始值，比如初始值为世界末日：

````html
<input id="date-focus-1" type="text" />
````

````javascript
seajs.use('calendar', function(Calendar) {
    new Calendar({trigger: '#date-focus-1', focus: '2012-12-12'});
});
````

另外，如果 ``input`` 框中有值，会将此值做为初始值：

````html
<input id="date-focus-2" type="text" value="2012-12-25" />
````

````javascript
seajs.use('calendar', function(Calendar) {
    new Calendar({trigger: '#date-focus-2'});
});
````

## You can't select this date

比如只能选择 2012-12-06 到 2012-12-25 之间的日期：

````html
<input id="date-disable-1" type="text" value="2012-12-08" />
````

````javascript
seajs.use('calendar', function(Calendar) {
    var cal = new Calendar({
        trigger: '#date-disable-1',
        range: ['2012-12-06', '2012-12-25']
    });
    cal.on('selectDisabledDate', function(date) {
        alert('you selected a disabled date ' + date.format('YYYY-MM-DD'));
    });
});
````

比如只能选择 2012-12-25 之前的日期：

````html
<input id="date-disable-2" type="text" value="2012-12-08" />
````

````javascript
seajs.use('calendar', function(Calendar) {
    var cal = new Calendar({
        trigger: '#date-disable-2',
        range: [null, '2012-12-25']
    });
    cal.on('selectDisabledDate', function(date) {
        alert('you selected a disabled date ' + date.format('YYYY-MM-DD'));
    });
});
````

比如不能选择周二的日期：

````html
<input id="date-disable-3" type="text" />
````

````javascript
seajs.use('calendar', function(Calendar) {
    var cal = new Calendar({
        trigger: '#date-disable-3',
        range: function(date) {
            return date.day() != 2;
        }
    });
    cal.on('selectDisabledDate', function(date) {
        alert('you selected a disabled date ' + date.format('YYYY-MM-DD'));
    });
});
````

## Format of ouput

默认的输入输出格式为 ``YYYY-MM-DD``，你可以设置为任何自己想要的格式，比如：
``MM-DD YYYY``。

````html
<input id="date-format" type="text" />
````

````javascript
seajs.use('calendar', function(Calendar) {
    new Calendar({trigger: '#date-format', format: 'MM-DD YYYY'});
});
````

## Day of the week

默认一周的开始为周日，你可以设置为其它的星期，比如周三。

````html
<input id="date-startday" type="text" />
````

````javascript
seajs.use('calendar', function(Calendar) {
    // new Calendar({trigger: '#date-startday', startDay: 2});
    // new Calendar({trigger: '#date-startday', startDay: 'Wed'});
    new Calendar({trigger: '#date-startday', startDay: 'Wednesday'});
});
````
