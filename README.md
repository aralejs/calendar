# Calendar

----


## 模块依赖

+ seajs
+ jquery
+ overlay
+ events
+ moment

## 使用说明

```javascript
seajs.use(['calendar'], function(Calendar) {
    var cal = new Calendar({
        trigger: '#id'
    });
})
```

### Options

- trigger

    trigger 唤出日历的元素，可以是：

    - 选择器
    - element
    - jQuery Object

- triggerType

    唤出日历的事件，默认为 click

- focus

    日历初始聚焦的日期，默认为今天。接受任何 moment 支持的参数，推荐使用 ``YYYY-MM-DD`` 格式。

- format

    输出日期格式，默认为 ``YYYY-MM-DD``

- align

    同 Overlay 的设置，一般不用处理，如需了解详情，请参考 arale.position 的 pin 方法。

    基本设置方法：

    ```javascript
    {
        selfXY: [0, 0],     // element 的定位点，默认为左上角
        baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
        baseXY: [0, 0]      // 基准定位元素的定位点，默认为左上角
    }
    ```

- startDay

    一周从哪一天开始，默认周日是一周的开始。

    可使用数字 0-6，可使用 'Sun', 'Tue' 等简写，还可以使用 'Sunday', 'Thursday' 等全称。

- range

    设置可选范围，可接受数组与函数。例如 [startDate, endDate]，其中 startDate 与 endDate 支持所有 moment 支持的写法。

    推荐使用： ``["2012-12-12", "2014-01-01"]`` 这种写法，方便阅读。

    函数示例：

    ```javascript
    range: function(time) {
        return time.day() > 1;
    }
    ```


## API Reference

