# 月份表

- order: 3

------------

<link rel="stylesheet" href="../src/css/month.css" />

<style type="text/css">
.ui-calendar-month {
position: absolute;
top: 240px;
left: 50%;
margin-left: -100px;
}
</style>


````javascript
seajs.use('calendar', function(Calendar) {
    var month = new Calendar.MonthColumn({});
    month.show();
});
````
