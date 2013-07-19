# Calendar

-------------

[![Build Status](https://travis-ci.org/aralejs/calendar.png)](https://travis-ci.org/aralejs/calendar)
[![Coverage Status](https://coveralls.io/repos/aralejs/calendar/badge.png)](https://coveralls.io/r/aralejs/calendar)


提供图形化的日历界面供用户选择日期与时间，提供简洁的接口供开发者输出自定义格式的时间。

------------


## Attributes

```javascript
var cal = new Calendar({..attributes..});
```


### trigger `element`

trigger 唤出日历的元素，可以是：

- 选择器
- element
- jQuery Object


### triggerType `event`

唤出日历的事件，默认为 click

### focus `moment`

日历初始聚焦的日期，默认为今天。接受任何 moment 支持的参数，推荐使用 ``YYYY-MM-DD`` 格式。

### format `string`

输出日期格式，默认为 ``YYYY-MM-DD``

### align `overlay.align`

同 Overlay 的设置，一般不用处理，如需了解详情，请参考 arale.position 的 pin 方法。

基本设置方法：

```javascript
{
    selfXY: [0, 0],     // element 的定位点，默认为左上角
    baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
    baseXY: [0, 0]      // 基准定位元素的定位点，默认为左上角
}
```

### startDay `string|number`

一周从哪一天开始，默认周日是一周的开始。

可使用数字 0-6，可使用 'Sun', 'Tue' 等简写，还可以使用 'Sunday', 'Thursday' 等全称。

### range `array|function`

设置可选范围，可接受数组与函数。例如 [startDate, endDate]，其中 startDate 与 endDate 支持所有 moment 支持的写法。

推荐使用： ``["2012-12-12", "2014-01-01"]`` 这种写法，方便阅读。

函数示例：

```javascript
range: function(time) {
    return time.day() > 1;
}
```

### hideOnSelect `boolean`

选择日期时日历自动隐藏，默认为 true

### output `element`

选择日期时自动填充到 output，默认 output 同 trigger。


## Methods

一般情况下，你不需要使用下面的方法。

### show()

显示日历。

### hide()

隐藏日历。


### disable()

禁用 trigger。

### enable()

启用 trigger。

### autohide()

当时 trigger 不是 input 时，调用此方法可自动隐藏日历。


### focus(date)

焦点设置为指定时间。

```javascript
cal.focus('2012-12-25');
```

### range(range)

重新设置 range。


## Events

事件监听：

```javascript
cal.on('..event..', function(param){
    // do something
})
```

### show

日历显示时。

### hide

日历隐藏时。

### selectDate `moment`

当用户选择日期时。

```javascript
.on('selectDate', function(date) {
    // date is a moment instance
})
```

### selectMonth `moment`

当用户选择月份时。

```javascript
.on('selectMonth', function(date) {
    // date is a moment instance
})
```


### selectYear `moment`

当用户选择年份时。

```javascript
.on('selectYear', function(date) {
    // date is a moment instance
})
```

## Developer API

Calendar 自身也是基于 Developer API 来实现的。

### Calendar.DateColumn

日期表，见示例: [date-column](http://aralejs.org/calendar/examples/date-column.html)

### Calendar.MonthColumn

月份表，见示例: [month-column](http://aralejs.org/calendar/examples/month-column.html)

### Calendar.YearColumn

年份表，见示例: [year-column](http://aralejs.org/calendar/examples/year-column.html)

### Calendar.BaseCalendar

基础日历。
