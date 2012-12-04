# 月例

- order: 2

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

````javascript
seajs.use('year', function(Year) {
    var year = new Year({});
    year.show();
});
````
