define("#calendar/0.8.0/model-debug", ["$-debug", "#base/1.0.0/base-debug", "#class/1.0.0/class-debug", "#events/1.0.0/events-debug", "#moment/1.6.2/moment-debug"], function(require, exports, module) {

    var $ = require('$-debug');
    var Base = require('#base/1.0.0/base-debug');
    var moment = require('#moment/1.6.2/moment-debug');

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
                    return createDayModel(this.startDay);
                }
            },

            date: {
                setter: function(val) {
                    return createDateModel(
                        val, this.startDay, this.range
                    );
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
                    return o;
                }
            },

            message: null
        },

        initialize: function(config) {
            CalendarModel.superclass.initialize.call(this);

            this.startDay = config.startDay;
            this.activeTime = config.focus.clone();

            this.range = config.range;

            var message = config.message || {};
            message.today = 'Today';

            this.set('message', message);
            this.set('mode', 'date');
            this._refresh();
        },

        changeYear: function(number) {
            this.activeTime.add('years', number);
            this._refresh();
            this.trigger('changeYears');
        },

        changeMonth: function(number) {
            this.activeTime.add('months', number);
            this._refresh();
            this.trigger('changeMonths');
        },

        changeDate: function(number) {
            var oldTime = this.activeTime.format('YYYY-MM');
            this.activeTime.add('days', number);
            this._refresh();
            var newTime = this.activeTime.format('YYYY-MM');
            if (oldTime != newTime && this.get('mode').date) {
                this.trigger('changeMonths');
            }
        },

        changeStartDay: function(day) {
            this.startDay = day;
            this._refresh();
            this.trigger('changeStartday');
        },

        changeMode: function(mode, obj) {
            obj || (obj = {});
            if ('month' in obj) this.activeTime.month(obj.month);
            if ('year' in obj) this.activeTime.year(obj.year);

            this.set('mode', mode);
            this._refresh();
            this.trigger('changeMode');
        },

        changeRange: function(range) {
            this.range = range;
            this._refresh();
            this.trigger('changeRange');
        },

        selectDate: function(time) {
            if (time) {
                var oldTime = this.activeTime.format('YYYY-MM');
                this.activeTime = moment(time);
                this._refresh();
                var newTime = this.activeTime.format('YYYY-MM');
                if (oldTime != newTime && this.get('mode').date) {
                   this.trigger('changeMonths');
                }
            }
            return this.activeTime.clone();
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

        _refresh: function() {
            this.set('year', this.activeTime.year());
            this.set('month', this.activeTime.month());
            this.set('date', this.activeTime.clone());
            this.set('day');
            this.trigger('refresh');
        },

        range: null,
        activeTime: null,
        startDay: 0
    });


    // Helpers
    // -------

    var MONTHS = [
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
        var items = [];

        for (i = 0; i < MONTHS.length; i++) {
            items.push({
                value: i,
                label: MONTHS[i]
            });
        }

        var current = {
            value: month,
            label: MONTHS[month]
        };

        // split [1, 2, .. 12] to [[1, 2, 3, 4], [5, ...]...]
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
                role: 'previous-10-year'
            }
        ];

        for (var i = year - 6; i < year + 4; i++) {
            items.push({
                value: i,
                label: i,
                role: 'year'
            });
        }
        items[7] = {value: year, label: year, role: 'year', current: true};
        items.push({
            value: year + 10,
            label: '. . .',
            role: 'next-10-year'
        });

        var list = [];
        for (i = 0; i < items.length / 3; i++) {
            list.push(items.slice(i * 3, i * 3 + 3));
        }

        var current = {
            value: year,
            label: year
        };

        return {current: current, items: list};
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

        var current = {
            value: startDay,
            label: DAY_LABELS[startDay]
        };
        return {current: current, items: items};
    }


    function createDateModel(current, startDay, range) {
        var items = [], delta, d, daysInMonth;
        startDay = parseStartDay(startDay);

        var pushData = function(d, className) {
            items.push({
                value: d.format('YYYY-MM-DD'),
                label: d.date(),

                day: d.day(),
                className: className,
                available: isInRange(d, range)
            });
        };

        // reset to the first date of the month
        var currentMonth = current.clone().date(1);
        var previousMonth = currentMonth.clone().add('months', -1);
        var nextMonth = currentMonth.clone().add('months', 1);

        // Calculate days of previous month
        // that should be on current month's sheet
        delta = currentMonth.day() - startDay;
        if (delta < 0) delta += 7;
        if (delta != 0) {
            daysInMonth = previousMonth.daysInMonth();

            // *delta - 1**: we need decrease it first
            for (i = delta - 1; i >= 0; i--) {
                d = previousMonth.date(daysInMonth - i);
                pushData(d, 'previous-month');
            }
        }

        daysInMonth = currentMonth.daysInMonth();
        for (i = 1; i <= daysInMonth; i++) {
            d = currentMonth.date(i);
            pushData(d, 'current-month');
        }

        // Calculate days of next month
        // that should be on current month's sheet
        delta = 35 - items.length;
        if (delta != 0) {
            if (delta < 0) delta += 7;
            for (i = 1; i <= delta; i++) {
                d = nextMonth.date(i);
                pushData(d, 'next-month');
            }
        }
        var list = [];
        for (var i = 0; i < items.length / 7; i++) {
            list.push(items.slice(i * 7, i * 7 + 7));
        }

        var _current = {
            value: current.format('YYYY-MM-DD'),
            label: current.date()
        };

        return {current: _current, items: list};
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

define("#calendar/0.8.0/calendar-debug", ["./model-debug", "$-debug", "#moment/1.6.2/moment-debug", "#overlay/0.9.9/overlay-debug", "#position/0.9.2/position-debug", "#iframe-shim/0.9.3/iframe-shim-debug", "#widget/0.9.16/widget-debug", "#base/0.9.16/base-debug", "#events/0.9.1/events-debug", "#class/0.9.2/class-debug", "#widget/1.0.0/templatable-debug", "#handlebars/1.0.0/handlebars-debug", "i18n!lang-debug", "#base/1.0.0/base-debug", "#class/1.0.0/class-debug", "#events/1.0.0/events-debug"], function(require, exports, module) {

    // Calendar is designed for desktop, we don't need to consider ``zepto``.
    var $ = require('$-debug');
    var moment = require('#moment/1.6.2/moment-debug');
    var Overlay = require('#overlay/0.9.9/overlay-debug');
    var Templatable = require('#widget/1.0.0/templatable-debug');
    var lang = require('i18n!lang-debug') || {};

    var template = '<div class="ui-calendar"><ul class="ui-calendar-navigation" data-role="navigation-container"><li class="ui-calendar-previous-year" data-role="prev-year">&lt;&lt;</li><li class="ui-calendar-previous-month" data-role="prev-month">&lt;</li><li class="ui-calendar-month-year" data-role="month-year-container"><span class="month" data-role="mode-month" data-value="{{month.current.value}}">{{_ month.current.label}}</span><span class="year" data-role="mode-year">{{year.current.label}}</span></li><li class="ui-calendar-next-month" data-role="next-month">&gt;</li><li class="ui-calendar-next-year" data-role="next-year">&gt;&gt;</li></ul><ul class="ui-calendar-control" data-role="pannel-container">{{#if mode.date}}{{#each day.items}}<li class="ui-calendar-day ui-calendar-day-{{value}}" data-role="day" data-value="{{value}}">{{_ label}}</li>{{/each}}{{/if}}</ul><div class="ui-calendar-data-container" data-role="data-container">{{#if mode.date}}{{#each date.items}}<ul class="ui-calendar-date-column">{{#each this}}<li class="ui-calendar-day-{{day}} {{className}}{{#unless available}}disabled-date{{/unless}}"data-role="date" data-value="{{value}}">{{label}}</li>{{/each}}</ul>{{/each}}{{/if}}{{#if mode.month}}{{#each month.items}}<ul class="ui-calendar-month-column">{{#each this}}<li data-role="month" data-value="{{value}}">{{_ label}}</li>{{/each}}</ul>{{/each}}{{/if}}{{#if mode.year}}{{#each year.items}}<ul class="ui-calendar-year-column">{{#each this}}<li data-role="{{role}}" data-value="{{value}}">{{_ label}}</li>{{/each}}</ul>{{/each}}{{/if}}</div><ul class="ui-calendar-footer" data-role="time-container"><li class="ui-calendar-today" data-role="today">{{_ message.today}}</li>{{#if mode.time}}<li class="ui-calendar-time" colspan="2" data-role="time"><span class="ui-calendar-hour">{{time.hour}}</span> : {{time.minute}}</li>{{/if}}</ul></div>';
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

        // output field
        output: {
            value: '',
            getter: function(val) {
                val = val ? val: this.get('trigger');
                return $(val);
            }
        },

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
        hideOnSelect: true,

        // when initialize a calendar, which date should be focused.
        // default is today.
        focus: {
            value: '',
            getter: function(val) {
                val = val ? val : $(this.get('trigger')).val();
                return moment(val ? val : undefined);
            }
        },
        range: null,

        template: template,

        model: {
            getter: function() {
                if (!this.hasOwnProperty('model')) {
                    var modelConfig = {
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

        templateHelpers: {
            '_': function(key) {return lang[key] || key;}
        },

        setup: function() {
            var self = this;

            // bind trigger
            var $trigger = $(this.get('trigger'));
            $trigger.on(this.get('triggerType'), function() {
                self.show();
                setFocusedElement(self.element, self.model);
            });
            $trigger.on('keydown', function(ev) {
                self._keyControl(ev);
            });
            $trigger.on('blur', function() {
                self.hide();
            });

            self.element.on('mousedown', function(ev) {
                if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
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
            model.on('changeStartday changeMode', function() {
                self.renderPartial('[data-role=data-container]');
                self.renderPartial('[data-role=pannel-container]');
                self.renderPartial('[data-role=month-year-container]');
                setFocusedElement(self.element, self.model);
            });
            model.on('changeMonths changeYears', function() {
                var mode = model.get('mode');
                if (mode.date || mode.year) {
                    self.renderPartial('[data-role=data-container]');
                }
                self.renderPartial('[data-role=month-year-container]');
                setFocusedElement(self.element, self.model);
            });
            model.on('changeRange', function() {
                self.renderPartial('[data-role=data-container]');
            });
            model.on('refresh', function() {
                setFocusedElement(self.element, self.model);
            });
        },

        range: function(range) {
            this.model.changeRange(range);
        },

        prevYear: function() {
            this.model.changeYear(-1);
        },

        nextYear: function() {
            this.model.changeYear(1);
        },

        prevMonth: function() {
            this.model.changeMonth(-1);
        },

        nextMonth: function() {
            this.model.changeMonth(1);
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
            var date = this.model.selectDate(el.data('value'));
            this._fillDate(date);
        },

        _selectToday: function() {
            var today = moment();
            this.model.selectDate(today);
            this.trigger('selectToday');
        },

        _changeMode: function(ev) {
            var mode = $(ev.target).data('role').substring(5);
            this.model.changeMode(mode);
        },

        _keyControl: function(ev) {
            var modeMap = {
                68: 'date',
                77: 'month',
                89: 'year'
            };
            if (ev.keyCode in modeMap) {
                this.model.changeMode(modeMap[ev.keyCode]);
                ev.preventDefault();
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

            ev.preventDefault();

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
            this.model.changeDate(moves[keyboard]);
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
            this.model.changeMonth(moves[keyboard]);
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
            this.model.changeYear(moves[keyboard]);
        },

        _fillDate: function(date) {
            if (!this.model.isInRange(date)) {
                this.trigger('selectDisabledDate', date);
                return this;
            }
            this.trigger('selectDate', date);

            var trigger = this.get('trigger');
            if (!trigger) {
                return this;
            }
            var $output = this.get('output');
            if (typeof $output[0].value === 'undefined') {
                return this;
            }
            var value = date.format(this.get('format'));
            $output.val(value);
            if (this.get('hideOnSelect')) {
              this.hide();
            }
        }
    });

    function setFocusedElement(element, model) {
        var current;
        var mode = model.get('mode');
        var o = ['date', 'month', 'year'];
        for (var i = 0; i < o.length; i++) {
            if (mode[o[i]]) current = o[i];
        }
        if (!current) return;
        var selector = '[data-value=' + model.get(current).current.value + ']';
        element.find('.focused-element').removeClass('focused-element');
        element.find(selector).addClass('focused-element');
    }

    Calendar.autoRender = function(config) {
        config.trigger = config.element;
        config.element = '';
        new Calendar(config);
    };

    module.exports = Calendar;
});
