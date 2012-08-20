define("#calendar/0.8.0/model-debug", ["$-debug", "#base/1.0.0/base-debug", "#class/1.0.0/class-debug", "#events/1.0.0/events-debug", "#moment/1.6.2/moment-debug"], function(require, exports, module) {

    var $ = require('$-debug');
    var Base = require('#base/1.0.0/base-debug');
    var moment = require('#moment/1.6.2/moment-debug');

    var dateCustomize;

    // Create a model data on calendar. For example, now is May, 2012.
    // And the week begin at Sunday.
    var CalendarModel = Base.extend({

        attrs: {
            year: {
                setter: function(val) {
                    return createYearModel(val);
                }
            },

            month: {
                setter: function(val) {
                    return createMonthModel(val);
                }
            },

            day: {
                setter: function(val) {
                    return createDayModel(this._startDay);
                }
            },

            date: {
                setter: function(val) {
                    return createDateModel(
                        val, this._startDay, this.range
                    );
                }
            },

            time: {
                setter: function(val) {
                    return createTimeModel(val);
                }
            },

            mode: {
                setter: function(current) {
                    var o = {
                        date: false,
                        month: false,
                        year: false
                    };
                    o[current] = true;
                    o.time = this._showTime;
                    return o;
                }
            },

            message: null
        },

        initialize: function(config) {
            this._startDay = config.startDay;
            this._activeTime = config.focus.clone();
            dateCustomize = config.dateCustomize;

            this.range = config.range;
            this._showTime = config.showTime;

            var message = config.message || {};
            message.today = 'Today';

            this.set('message', message);
            this.set('mode', 'date');
            this.renderData();
        },

        renderData: function() {
            this.set('year', this._activeTime.year());
            this.set('month', this._activeTime.month());
            this.set('date', this._activeTime.clone());
            this.set('day');
            this.set('time');
        },

        changeTime: function(key, number) {
            this._activeTime.add(key, number);
            this.renderData();
        },

        changeStartDay: function(day) {
            this._startDay = day;
            this.renderData();
        },

        changeMode: function(mode, obj) {
            obj || (obj = {});
            if ('month' in obj) {
                this._activeTime.month(obj.month);
            }
            if (obj.year) this._activeTime.year(obj.year);
            this.set('mode', mode);
            this.renderData();
        },

        selectDate: function(time) {
            if (time) {
                this._activeTime = moment(time);
                this.renderData();
            }
            return this._activeTime.clone();
        },

        isInRange: function(date) {
            return isInRange(date, this.range);
        },

        toJSON: function() {
            var object = {};
            var attrs = this.attrs;

            for (var attr in attrs) {
                object[attr] = this.get(attr);
            }

            return object;
        },

        range: null,
        _activeTime: null,
        _startDay: 0,
        _showTime: false
    });


    // Helpers
    // -------

    var showMonths = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    var DAYS = [
        'sunday', 'monday', 'tuesday', 'wednesday',
        'thursday', 'friday', 'saturday'
    ];

    function parseStartDay(startDay) {
        startDay = (startDay || 0).toString().toLowerCase();

        if ($.isNumeric(startDay)) {
            startDay = parseInt(startDay);
            return startDay;
        }

        for (var i = 0; i < DAYS.length; i++) {
            if (DAYS[i].indexOf(startDay) === 0) {
                startDay = i;
                break;
            }
        }
        return startDay;
    }

    function createMonthModel(month) {
        var items = [], current;

        for (i = 0; i < showMonths.length; i++) {
            current = i == month;

            items.push({
                value: i,
                label: showMonths[i],
                current: current
            });
        }

        current = {
            value: month,
            label: showMonths[month]
        };

        var list = [];
        for (var i = 0; i < items.length / 3; i++) {
            list.push(items.slice(i * 3, i * 3 + 3));
        }

        return {current: current, items: list};
    }

    function createYearModel(year) {
        var items = [
            {
                value: year - 10,
                label: '. . .',
                role: 'previous-10-year',
                current: false
            }
        ];

        for (var i = year - 6; i < year + 4; i++) {
            items.push({
                value: i,
                label: i,
                role: 'year',
                current: false
            });
        }
        items[7] = {value: year, label: year, role: 'year', current: true};
        items.push({
            value: year + 10,
            label: '. . .',
            role: 'next-10-year',
            current: false
        });

        var list = [];
        for (i = 0; i < items.length / 3; i++) {
            list.push(items.slice(i * 3, i * 3 + 3));
        }

        return {current: year, items: list};
    }


    var DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    function createDayModel(startDay) {
        // Translate startDay to number. 0 is Sunday, 6 is Saturday.
        startDay = parseStartDay(startDay);
        var items = [];
        for (var i = startDay; i < 7; i++) {
            items.push({label: DAY_LABELS[i], value: i});
        }
        for (i = 0; i < startDay; i++) {
            items.push({label: DAY_LABELS[i], value: i});
        }
        return {startDay: startDay, items: items};
    }


    function createDateModel(current, startDay, range) {
        var items = [], delta, d, daysInMonth;
        startDay = parseStartDay(startDay);

        var pushData = function(d, className) {
            if (dateCustomize) {
                className += ' ' + dateCustomize(d);
            }
            items.push({
                datetime: d.format('YYYY-MM-DD'),
                date: d.date(),
                day: d.day(),
                className: className,
                available: isInRange(d, range)
            });
        };

        // reset to the first date of the month
        var current_month = current.clone().date(1);
        var previous_month = current_month.clone().add('months', -1);
        var next_month = current_month.clone().add('months', 1);

        // Calculate days of previous month
        // that should be on current month's sheet
        delta = current_month.day() - startDay;
        if (delta < 0) delta += 7;
        if (delta != 0) {
            daysInMonth = previous_month.daysInMonth();

            // *delta - 1**: we need decrease it first
            for (i = delta - 1; i >= 0; i--) {
                d = previous_month.date(daysInMonth - i);
                pushData(d, 'previous-month');
            }
        }

        var formattedCurrent = current.format('YYYY-MM-DD');
        daysInMonth = current_month.daysInMonth();
        for (i = 1; i <= daysInMonth; i++) {
            d = current_month.date(i);

            if (d.format('YYYY-MM-DD') === formattedCurrent) {
                pushData(d, 'focused-element');
            } else {
                pushData(d, '')
            }
        }

        // Calculate days of next month
        // that should be on current month's sheet
        delta = 35 - items.length;
        if (delta != 0) {
            if (delta < 0) delta += 7;
            for (i = 1; i <= delta; i++) {
                d = next_month.date(i);
                pushData(d, 'next-month');
            }
        }
        var list = [];
        for (var i = 0; i < items.length / 7; i++) {
            list.push(items.slice(i * 7, i * 7 + 7));
        }

        var focus = {
            date: current.date(),
            day: current.day()
        };

        return {focus: focus, items: list};
    }

    function createTimeModel(val) {
        var now = moment(val);
        return {hour: now.hours(), minute: now.minutes()};
    }

    function isInRange(time, range) {
        if (range == null) return true;
        if ($.isArray(range)) {
            var start = range[0];
            var end = range[1];
            var result = true;
            if (start) {
                result = result && time >= moment(start);
            }
            if (end) {
                result = result && time <= moment(end);
            }
            return result;
        }
        if ($.isFunction(range)) {
            return range(time);
        }
        return true;
    }

    module.exports = CalendarModel;
});


// # Calendar
//
// Calendar is also known as date-picker. It is widely used in web apps.
//
// This calendar is a part of [arale](http://aralejs.org) project, therefore,
// it is suitable for any project that is powered by [seajs](http://seajs.org).
//
// ## Syntax Overview:
//
//     var Calendar = require('undefined-debug');
//     var cal = new Calendar({
//         trigger: 'input.date-picker',
//         format: "YYYY-MM-DD"
//     });
//
// Need more complex task? Head over to Options section.
//

define("#calendar/0.8.0/calendar-debug", ["./model-debug", "$-debug", "#moment/1.6.2/moment-debug", "#overlay/0.9.9/overlay-debug", "#position/1.0.0/position-debug", "#iframe-shim/1.0.0/iframe-shim-debug", "#widget/1.0.0/widget-debug", "#base/1.0.0/base-debug", "#class/1.0.0/class-debug", "#events/1.0.0/events-debug", "#widget/1.0.0/templatable-debug", "#handlebars/1.0.0/handlebars-debug"], function(require, exports, module) {

    // Calendar is designed for desktop, we don't need to consider ``zepto``.
    var $ = require('$-debug');
    var moment = require('#moment/1.6.2/moment-debug');
    var Overlay = require('#overlay/0.9.9/overlay-debug');
    var Templatable = require('#widget/1.0.0/templatable-debug');

    var template = '<div class="ui-calendar"><ul class="ui-calendar-navigation" data-role="navigation-container"><li class="ui-calendar-previous-year" data-role="prev-year">&lt;&lt;</li><li class="ui-calendar-previous-month" data-role="prev-month">&lt;</li><li class="ui-calendar-month-year" data-role="month-year-container"><span class="month" data-role="mode-month" data-value="{{month.current.value}}">{{_ month.current.label}}</span><span class="year" data-role="mode-year">{{year.current}}</span></li><li class="ui-calendar-next-month" data-role="next-month">&gt;</li><li class="ui-calendar-next-year" data-role="next-year">&gt;&gt;</li></ul><ul class="ui-calendar-control" data-role="pannel-container">{{#if mode.date}}{{#each day.items}}<li class="ui-calendar-day ui-calendar-day-{{value}}" data-role="day" data-value="{{value}}">{{_ label}}</li>{{/each}}{{/if}}</ul><div class="ui-calendar-data-container" data-role="data-container">{{#if mode.date}}{{#each date.items}}<ul class="ui-calendar-date-column">{{#each this}}<li class="ui-calendar-day-{{day}} {{className}}{{#unless available}}disabled-date{{/unless}}"data-role="date" data-datetime="{{datetime}}">{{date}}</li>{{/each}}</ul>{{/each}}{{/if}}{{#if mode.month}}{{#each month.items}}<ul class="ui-calendar-month-column">{{#each this}}<li {{#if current}}class="focused-element"{{/if}} data-role="month" data-value="{{value}}">{{_ label}}</li>{{/each}}</ul>{{/each}}{{/if}}{{#if mode.year}}{{#each year.items}}<ul class="ui-calendar-year-column">{{#each this}}<li {{#if current}}class="focused-element"{{/if}} data-role="{{role}}" data-value="{{value}}">{{_ label}}</li>{{/each}}</ul>{{/each}}{{/if}}</div><ul class="ui-calendar-footer" data-role="time-container"><li class="ui-calendar-today" data-role="today">{{_ message.today}}</li>{{#if mode.time}}<li class="ui-calendar-time" colspan="2" data-role="time"><span class="ui-calendar-hour">{{time.hour}}</span> : {{time.minute}}</li>{{/if}}</ul></div>';
    var CalendarModel = require('./model-debug');

    // ## Options
    // default options for calendar
    var defaults = {
        // ### trigger and input
        // element, usually input[type=date], or date icon
        trigger: null,

        triggerType: 'click',

        // output format
        format: 'YYYY-MM-DD',

        // ### overlay
        align: {
            getter: function() {
                var trigger = this.get('trigger');
                if (trigger) {
                    return {
                        selfXY: [0, 0],
                        baseElement: trigger,
                        baseXY: [0, $(trigger).height() + 10]
                    };
                }
                return {
                    selfXY: [0, 0],
                    baseXY: [0, 0]
                };
            }
        },

        // ### display
        // start of a week, default is Sunday.
        startDay: 'Sun',

        showTime: false,

        lang: null,

        // when initialize a calendar, which date should be focused.
        // default is today.
        focus: {
            value: '',
            getter: function(val) {
                return moment(val ? val : undefined);
            }
        },

        // ### range for selecting
        //
        // determine if a date is available for selecting, accept:
        //
        // - list: [start, end]. ``start`` and ``end`` can be anything
        //   that moment.parse accepts.
        // - function: a function return ``true`` or ``false``, the function
        //   accepts a moment date, and it determines if this date is available
        //   for selecting.
        range: null,

        template: template,

        model: {
            getter: function() {
                if (!this.hasOwnProperty('model')) {
                    var modelConfig = {
                        lang: this.get('lang'),
                        focus: this.get('focus'),
                        range: this.get('range'),
                        showTime: this.get('showTime'),
                        startDay: this.get('startDay')
                    };
                    this.model = new CalendarModel(modelConfig);
                }

                return this.model;
            }
        }
    };

    var Calendar = Overlay.extend({
        Implements: [Templatable],

        attrs: defaults,

        events: {
            'click [data-role=mode-year]': '_changeMode',
            'click [data-role=prev-year]': 'prevYear',
            'click [data-role=next-year]': 'nextYear',
            'click [data-role=mode-month]': '_changeMode',
            'click [data-role=prev-month]': 'prevMonth',
            'click [data-role=next-month]': 'nextMonth',

            'click [data-role=previous-10-year]': '_selectYear',
            'click [data-role=next-10-year]': '_selectYear',
            'click [data-role=year]': '_selectYear',
            'click [data-role=month]': '_selectMonth',
            'click [data-role=day]': '_selectDay',
            'click [data-role=date]': '_selectDate',
            'click [data-role=today]': '_selectToday'
        },

        setup: function() {
            var that = this;

            // bind trigger
            var $trigger = $(this.get('trigger'));
            $trigger.on(this.get('triggerType'), function() {
                that.render().show();
            });
            $trigger.on('keydown', function(ev) {
                that._keyControl(ev);
            });
            $trigger.on('blur', function() {
                that.hide();
            });
            that.element.on('mousedown', function(ev) {
                if ($.browser.msie && parseInt($.browser.version) < 9) {
                    var trigger = $trigger[0];
                    trigger.onbeforedeactivate = function() {
                        window.event.returnValue = false;
                        trigger.onbeforedeactivate = null;
                    };
                }
                ev.preventDefault();
            });

            // bind model change event
            var model = this.model;
            var hash = {
                'change:year change:month': '[data-role=month-year-container]',
                'change:day': '[data-role=pannel-container]',
                'change:date': '[data-role=data-container]',
                'change:time': '[data-role=time-container]',
                'change:mode': [
                    '[data-role=data-container]', '[data-role=pannel-container]'
                ]
            };

            $.each(hash, function(eventType, selectors) {
                model.on(eventType, function() {
                    $.isArray(selectors) || (selectors = [selectors]);
                    $.each(selectors, function(i, selector) {
                        that.renderPartial(selector);
                    });
                });
            });

            if (that.get('showTime')) {
                setInterval(function() {
                    model.set('time');
                }, 1000);
            }
        },

        range: function(range) {
            this.model.range = range;
            this.model.renderData();
        },

        prevYear: function() {
            this.model.changeTime('years', -1);
            return this;
        },

        nextYear: function() {
            this.model.changeTime('years', 1);
            return this;
        },

        prevMonth: function() {
            this.model.changeTime('months', -1);
            return this;
        },

        nextMonth: function() {
            this.model.changeTime('months', 1);
            return this;
        },

        _selectYear: function(ev) {
            var el = $(ev.target);
            if (el.data('role') === 'year') {
                this.model.changeMode('date', {year: el.data('value')});
            } else {
                this.model.changeMode('year', {year: el.data('value')});
            }
        },

        _selectMonth: function(ev) {
            var el = $(ev.target);
            this.model.changeMode('date', {month: el.data('value')});
        },

        _selectDay: function(ev) {
            var el = $(ev.target);
            this.model.changeStartDay(el.data('value'));
        },

        _selectDate: function(ev) {
            var el = $(ev.target);
            var date = this.model.selectDate(el.data('datetime'));
            this._fillDate(date);
        },

        _selectToday: function() {
            var today = moment();
            this.model.selectDate(today);
        },

        _changeMode: function(ev) {
            var mode = $(ev.target).data('role').substring(5);
            this.model.changeMode(mode);
        },

        _keyControl: function(ev) {
            ev.preventDefault();
            var modeMap = {
                68: 'date',
                77: 'month',
                89: 'year'
            };
            if (ev.keyCode in modeMap) {
                this.model.changeMode(modeMap[ev.keyCode]);
                return false;
            }
            var codeMap = {
                13: 'enter',
                27: 'esc',
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down',

                // vim bind
                72: 'left',
                76: 'right',
                74: 'down',
                75: 'up'
            };
            if (!(ev.keyCode in codeMap)) return;

            var keyboard = codeMap[ev.keyCode];
            var mode = this.model.get('mode');
            if (ev.shiftKey && keyboard === 'down') {
                this.nextYear();
            } else if (ev.shiftKey && keyboard === 'up') {
                this.prevYear();
            } else if (ev.shiftKey && keyboard === 'right') {
                this.nextMonth();
            } else if (ev.shiftKey && keyboard === 'left') {
                this.prevMonth();
            } else if (keyboard === 'esc') {
                this.hide();
            } else if (mode.date) {
                this._keyControlDate(keyboard);
            } else if (mode.month) {
                this._keyControlMonth(keyboard);
            } else if (mode.year) {
                this._keyControlYear(keyboard);
            }
        },

        _keyControlDate: function(keyboard) {
            if (keyboard === 'enter') {
                var date = this.model.selectDate();
                this._fillDate(date);
                return;
            }
            var moves = {
                'right': 1,
                'left': -1,
                'up': -7,
                'down': 7
            };
            this.model.changeTime('days', moves[keyboard]);
        },

        _keyControlMonth: function(keyboard) {
            if (keyboard === 'enter') {
                var date = this.model.selectDate();
                this.model.changeMode('date', {month: date.month()});
                return;
            }
            var moves = {
                'right': 1,
                'left': -1,
                'up': -3,
                'down': 3
            };
            this.model.changeTime('months', moves[keyboard]);
        },

        _keyControlYear: function(keyboard) {
            if (keyboard === 'enter') {
                var date = this.model.selectDate();
                this.model.changeMode('date', {year: date.year()});
                return;
            }
            var moves = {
                'right': 1,
                'left': -1,
                'up': -3,
                'down': 3
            };
            this.model.changeTime('years', moves[keyboard]);
        },

        _fillDate: function(date) {
            if (!this.model.isInRange(date)) {
                this.trigger('select-disabled-date', date);
                return this;
            }
            this.trigger('select-date', date);

            var trigger = this.get('trigger');
            if (!trigger) {
                return this;
            }
            var $trigger = $(trigger);
            if (typeof $trigger[0].value === 'undefined') {
                return this;
            }
            var value = date.format(this.get('format'));
            $trigger.val(value);
        }
    });

    Calendar.autoRender = function(config) {
        config.trigger = config.element;
        config.element = '';
        new Calendar(config);
    }
    
    module.exports = Calendar;
});
