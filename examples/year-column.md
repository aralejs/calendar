# 年份表

- order: 2

------------

<link rel="stylesheet" href="../src/css/year.css" />

<style type="text/css">
.ui-calendar-year {
position: absolute;
top: 240px;
left: 50%;
margin-left: -100px;
}
</style>


````javascript
seajs.use('year-column', function(Year) {
    var year = new Year({range: [2012]});
    year.show();
});
````
