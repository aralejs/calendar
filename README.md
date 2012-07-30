# Calendar

提供图形化的日历界面供用户选择日期与时间，提供简洁的接口供开发者输出自定义格式的时间。


## 模块依赖

+ seajs
+ jquery
+ overlay
+ events
+ moment

## 使用说明

```
seajs.use(['calendar'], function(Calendar) {
    var cal = new Calendar({
        trigger: '#id'
    });
})
```

### Options

- trigger
- triggerType
- format
- align
- startDay
- range


## API Reference

