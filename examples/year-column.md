# 年份表

- order: 4

------------

<link rel="stylesheet" href="../src/css/year.css" />

<style type="text/css">
.ui-calendar-year {
position: absolute;
top: 160px;
right: 10%;
}
</style>


````javascript
seajs.use('calendar', function(Calendar) {
    var year = new Calendar.YearColumn({range: [2012]});
    year.show();
});
````

## Attributes

```javascript
var year = new YearColumn({..attributes..});
```

### focus `moment`

初始聚焦的年份，默认为今年。接受任何 moment 支持的参数，推荐使用 ``YYYY-MM-DD`` 格式。


### format `string`

输出日期格式，默认为 ``YYYY-MM-DD``


### range `array|function`

设置可选范围，可接受数组与函数。例如 [startYear, endYear]。

推荐使用： ``["2012", "2014"]`` 这种写法，方便阅读。


## Methods

方法列表。

### prev()

焦点设置为上一年。

### next()

焦点设置为下一年。

### focus(moment)

焦点设置为指定时间。

### inRange(date)

指定时间是否可用。

### refresh

重新渲染。

## Events

事件

### select(value, element)

选择事件。

### selectDisable(value, element)

选择不可选的年份时。
