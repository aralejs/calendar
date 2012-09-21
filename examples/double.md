# 双日历

- order: 2

------------


`````html
<link rel="stylesheet" href="../src/themes/simple.css" />
`````

`````javascript
seajs.config({
    locale: 'zh-cn',
    preload: ['http://seajs.org/dist/plugin-i18n']
});
`````

````html
<div class="cell">
    <input id="date-4" type="text" />
    <span id="date-4-explain"></span>
    <input id="date-5" type="text" />
    <span id="date-5-explain"></span>
</div>
````

````javascript
seajs.use(['jquery', 'calendar'], function($, Calendar) {
    var cal4 = new Calendar({trigger: '#date-4'});
    var cal5 = new Calendar({trigger: '#date-5'});
    cal4.on('selectDate', function(date) {
        $('#date-4-explain').text('');
        cal5.range([date, null]);
    }).on('selectDisabledDate', function(date) {
        $('#date-4-explain').text('not available');
    });
    cal5.on('selectDate', function(date) {
        $('#date-5-explain').text('');
        cal4.range([null, date]);
    }).on('selectDisabledDate', function(date) {
        $('#date-5-explain').text('not available');
    });;
});
````
