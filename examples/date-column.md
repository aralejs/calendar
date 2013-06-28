# 日期表

- order: 2

-----

<link rel="stylesheet" href="../src/css/date.css" />

<style type="text/css">
.ui-calendar-date {
position: absolute;
top: 160px;
right: 10%;
}
</style>


````javascript
seajs.use('calendar', function(Calendar) {
    var date = new Calendar.DateColumn({});
    date.show();
});
````


## Attributes

```javascript
var date = new DateColumn({..attributes..});
```

### startDay `string|number`

一周从哪一天开始，默认周日是一周的开始。

可使用数字 0-6，可使用 'Sun', 'Tue' 等简写，还可以使用 'Sunday', 'Thursday' 等全称。

### focus `moment`

初始聚焦的年份，默认为当月。接受任何 moment 支持的参数，推荐使用 ``YYYY-MM-DD`` 格式。

### format `string`

输出日期格式，默认为 ``YYYY-MM-DD``

### range `array|function`

设置可选范围，可接受数组与函数。例如 [startDate, endDate]，其中 startDate 与 endDate 支持所有 moment 支持的写法。

推荐使用： ``["2012-12-12", "2014-01-01"]`` 这种写法，方便阅读。

函数示例：

```javascript
range: function(time) {
    return time.day() > 1;
}
```


## Methods

方法列表。

### prev()

焦点设置为上一日。

### next()

焦点设置为下一日。

### focus(moment)

焦点设置为指定时间。

### refresh

重新渲染。

## Events

事件

### select(value, element)

选择事件。

### selectDisable(value, element)

选择到不可选的日期时。
