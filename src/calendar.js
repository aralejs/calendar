// # Calendar
//
// Calendar is also known as date-picker. It is widely used in web apps.
//
// This calendar is a part of [arale](http://aralejs.org) project, therefore,
// it is suitable for any project that is powered by [seajs](http://seajs.org).
//
// ## Syntax Overview:
//
//     var Calendar = require('calendar');
//     var cal = new Calendar({
//         trigger: 'input.date-picker',
//         format: "YYYY-MM-DD"
//     });
//
// Need more complex task? Head over to Options section.
//

define(function(require, exports, module) {

    // Calendar is designed for desktop, we don't need to consider ``zepto``.
    var $ = require('$');
    var moment = require('moment');
    var Overlay = require('overlay');
    var Templatable = require('templatable');
    var lang = require('i18n!lang') || {};

    var template = require('./calendar.tpl');
    var CalendarModel = require('./model');

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
                val = val ? val : this.get('trigger');
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
                if (!val) return moment();
                return moment(val, this.get('format'));
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

            this._blurHide([this.get('trigger')]);

            // bind model change event
            var model = this.model;
            model.on('changeStartday changeMode', function() {
                self.renderPartial('[data-role=data-container]');
                self.renderPartial('[data-role=pannel-container]');
                self.renderPartial('[data-role=month-year-container]');
                setFocusedElement(self.element, self.model);
            });
            model.on('changeMonth changeYear selectToday', function() {
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
            this.model.selectToday();
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
