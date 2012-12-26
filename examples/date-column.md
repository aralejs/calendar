# 日期表

- order: 1

-----

<link rel="stylesheet" href="../src/css/date.css" />

<style type="text/css">
.ui-calendar-date {
position: absolute;
top: 240px;
left: 50%;
margin-left: -100px;
}
</style>


````javascript
seajs.use('date-column', function(DateColumn) {
    var date = new DateColumn({});
    date.show();
});
````
