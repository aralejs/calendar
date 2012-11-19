# Calendar

-------------

提供图形化的日历界面供用户选择日期与时间，提供简洁的接口供开发者输出自定义格式的时间。

`````html
<link rel="stylesheet" href="src/calendar.css" />
<input id="date-1" type="text" />
<script>
seajs.config({
    locale: 'zh-cn',
    preload: ['seajs/plugin-i18n']
});
seajs.use('calendar', function(Calendar) {
    var cal1 = new Calendar({trigger: '#date-1'});
});
</script>
`````

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


## Methods

一般情况下，你不需要使用下面的方法。

### range(aRange)

动态修改日历的 range，参考双日历演示。

```javascript
cal.range(['2012-10-10', '2012-10-19'])
```

### prevYear()

切换到上一年。

### nextYear()

切换到下一年。

### prevMonth()

切换到上一月。

### nextMonth()

切换到下一月。


## Events

事件监听：

```javascript
cal.on('..event..', function(param){
    // do something
})
```

### selectDate `moment`

当用户选择日期时。

```javascript
.on('selectDate', function(date) {
    // date is a moment instance
})
```

### selectDisabledDate `moment`

当用户选择了不可用的日期时。

```javascript
.on('selectDisabledDate', function(date) {
    // date is a moment instance
})
```

## More information

该日历大量使用 [moment](http://momentjs.com)，请查看 moment 官网，获取更多帮助。
