// # calendar model's job
// ----------------------
//
// initialize model with startDay, focus, and range in an object. Which means:
//
// var m = Model({startDay: 0, focus: '2012-12-12', range: null})
//
// and it will create the model for template, the result should be
// ``m.toJSON()``:
//
// {
//  year: {
//    current: {value: 2012, label: 2012},
//    items: [{value: 2002, label: 2002, role: 'previous-10-year'}, ...]
//  },
//  month: {
//    current: {value: 12, label: 12},
//    items: [
//      [{value: 1, label: 1}, ... {value: 3, label: 3}],
//      [...], [...], [...]
//    ]
//  },
//  date: {
//    current: {value: '2012-12-12', label: 12},
//    items: [
//      [
//        {
//          value: '2012-11-25',
//          label: 25,
//          day: 0,
//          className: 'previous-month',
//          available: True
//        },
//        {..}, {..}, ...
//      ],
//      [..],
//      [..],
//      ...
//    ]
//  },
//  day: {
//    current: {value: 0, label: 'Su'},
//    items: [
//      {value: 0, label: 'Su'}, {value: 1, label: 'Mo'}, ....
//    ]
//  },
//  mode: {
//    date: true,
//    month: false,
//    year: false
//  }
// }
//

define(function(require, exports, module) {

    var $ = require('$');
    var Base = require('base');
    var moment = require('moment');

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
            this.trigger('changeYear');
        },

        changeMonth: function(number) {
            this.activeTime.add('months', number);
            this._refresh();
            this.trigger('changeMonth');
        },

        changeDate: function(number) {
            var oldTime = this.activeTime.format('YYYY-MM');
            this.activeTime.add('days', number);
            this._refresh();
            var newTime = this.activeTime.format('YYYY-MM');
            if (oldTime != newTime && this.get('mode').date) {
                this.trigger('changeMonth');
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
                   this.trigger('changeMonth');
                }
            }
            return this.activeTime.clone();
        },

        selectToday: function() {
            this.selectDate(moment());
            this.trigger('selectToday');
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
