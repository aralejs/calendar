# 基本用法

- order: 1

------------

## There is nothing to do

最简示例，没有任何特殊要求：

````html
<input id="date-nothing" type="text" />
````

````javascript
seajs.use('../index', function(Calendar) {
    new Calendar({trigger: '#date-nothing'});
});
````

## Set language later

你也可以自己传入语言：

````html
<input id="date-lang" type="text" />
````

````javascript
seajs.use('../index', function(Calendar) {
    var lang = {
        'Su': '日', 'Mo': '月', 'Tu': '火', 'We': '水', 'Th': '木',
        'Fr': '金', 'Sa': '土',
        'Jan': '1月', 'Feb': '2月', 'Mar': '3月', 'Apr': '4月',
        'May': '5月', 'Jun': '6月', 'Jul': '7月', 'Aug': '8月',
        'Sep': '9月', 'Oct': '10月', 'Nov': '11月', 'Dec': '12月'
    };
    new Calendar({
        trigger: '#date-lang',
        lang: lang,
        align: {
          selfXY: [0, 0],
          baseElement: '#date-lang',
          baseXY: [0, 10]
        }
    });
});
````

## You should focus on me

设定初始值，比如初始值为世界末日：

````html
<input id="date-focus-1" type="text" />
````

````javascript
seajs.use('../index', function(Calendar) {
    new Calendar({trigger: '#date-focus-1', focus: '2012-12-12'});
});
````

另外，如果 ``input`` 框中有值，会将此值做为初始值：

````html
<input id="date-focus-2" type="text" value="2012-12-25" />
````

````javascript
seajs.use('../index', function(Calendar) {
    new Calendar({trigger: '#date-focus-2'});
});
````

## You can't select this date

比如只能选择 2012-12-06 到 2012-12-20 之间的日期：

````html
<input id="date-disable-1" type="text" value="2012-12-08" />
````

````javascript
seajs.use('../index', function(Calendar) {
    var cal = new Calendar({
        trigger: '#date-disable-1',
        range: ['2012-12-06', '2012-12-20']
    });
});
````

比如只能选择 2012-12-25 之前的日期：

````html
<input id="date-disable-2" type="text" value="2012-12-08" />
````

````javascript
seajs.use('../index', function(Calendar) {
    var cal = new Calendar({
        trigger: '#date-disable-2',
        range: [null, '2012-12-25']
    });
});
````

比如不能选择周二的日期：

````html
<input id="date-disable-3" type="text" />
````

````javascript
seajs.use('../index', function(Calendar) {
    var cal = new Calendar({
        trigger: '#date-disable-3',
        range: function(date) {
            if (date.day) {
                return date.day() != 2;
            }
            return true;
        }
    });
});
````

## Format of ouput

默认的输入输出格式为 ``YYYY-MM-DD``，你可以设置为任何自己想要的格式，比如：
``YYYY MM-DD HH:mm:ss``。

````html
<input id="date-format" type="text" />
````

````javascript
seajs.use('../index', function(Calendar) {
    new Calendar({trigger: '#date-format', format: 'YYYY MM-DD HH:mm:ss'});
});
````

## Day of the week

默认一周的开始为周日，你可以设置为其它的星期，比如周三。

````html
<input id="date-startday" type="text" />
````

````javascript
seajs.use('../index', function(Calendar) {
    // new Calendar({trigger: '#date-startday', startDay: 2});
    // new Calendar({trigger: '#date-startday', startDay: 'Wed'});
    new Calendar({trigger: '#date-startday', startDay: 'Wednesday'});
});
````


## Don't be smart

当用户选择了日期后，日历会自动隐藏。也许这并不是你想要的。

````html
<input id="date-not-hide" type="text" />
````

````javascript
seajs.use('../index', function(Calendar) {
    new Calendar({trigger: '#date-not-hide', hideOnSelect: false});
});
````


## It's too complicated

输入框不是触发点。

````html
<input id="date-output" type="text" />
<a id="date-trigger" href="javascript:;">点这里出现日历</a>
````

````javascript
seajs.use('../index', function(Calendar) {
    new Calendar({trigger: '#date-trigger', output: "#date-output"});
});
````

甚至都没有输入框。

````html
<span id="date-output-2">这里显示日期</span>
<a id="date-trigger-2" href="javascript:;">点这里出现日历</a>
````

````javascript
seajs.use(['jquery', '../index'], function($, Calendar) {
    new Calendar({trigger: '#date-trigger-2', output: '#date-output-2'});
});
````


## Double Calendar

````html
<input id="start-cal" type="text" />
<input id="end-cal" type="text" />
````

````javascript
seajs.use('../index', function(Calendar) {
    var t1 = '2012-01-01';
    var t2 = '2015-01-01';
    var c1 = new Calendar({trigger: '#start-cal', range: [t1, null]})
    var c2 = new Calendar({trigger: '#end-cal', range: [null, t2]})

    c1.on('selectDate', function(date) {
        c2.range([date, t2]);
    });

    c2.on('selectDate', function(date) {
        c1.range([t1, date]);
    });
});
````

## 实现一个年月历

````html
<input id="year-month-cal" type="text" />
````

````javascript
seajs.use('../index', function(Calendar) {
    var cal = new Calendar({
        trigger: "#year-month-cal",
        events: {
          'click [data-role=current-month]': function(ev) {
            this.renderContainer('months');
          },
          'click [data-role=current-year]': function(ev) {
            this.renderContainer('years');
          }
        }
    }).on('show selectYear', function() {
        this.renderContainer('months');
    }).on('selectMonth', function(date) {
        this.hide();
        this.output(date.format('YYYY-MM'));
    });
});
````
