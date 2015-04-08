# 月份表

- order: 3

------------

<style type="text/css">
.ui-calendar-month {
position: absolute;
top: 160px;
right: 10%;
}
</style>


````javascript
var Calendar = require('arale-calendar');
var month = new Calendar.MonthColumn({});
month.show();
````


## Attributes

```javascript
var month = new MonthColumn({..attributes..});
```

### focus `moment`

初始聚焦的年份，默认为当月。接受任何 moment 支持的参数，推荐使用 `YYYY-MM-DD` 格式。

### format `string`

输出日期格式，默认为 `YYYY-MM-DD`

### range `array|function`

设置可选范围，可接受数组与函数。例如 [startMonth, endMonth], [startDate, endDate]。


## Methods

方法列表。

### prev()

焦点设置为上一月。

### next()

焦点设置为下一月。

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

选择到不可选的月份时。
