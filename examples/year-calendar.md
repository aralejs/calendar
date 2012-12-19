# 年历

- order: 2

------------

首先需要引入样式文件，默认提供了一个 simple 主题。

````html
<link rel="stylesheet" href="../src/calendar.css" />
````

## There is nothing to do

````javascript
seajs.use('year-calendar', function(Year) {
    var year = new Year({});
    year.show();
});
````
