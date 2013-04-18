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
define("arale/calendar/0.8.5/calendar-debug", [ "$-debug", "gallery/moment/2.0.0/moment-debug", "arale/overlay/1.0.1/overlay-debug", "arale/position/1.0.0/position-debug", "arale/iframe-shim/1.0.1/iframe-shim-debug", "arale/widget/1.0.3/widget-debug", "arale/base/1.0.1/base-debug", "arale/class/1.0.0/class-debug", "arale/events/1.0.0/events-debug", "arale/widget/1.0.3/templatable-debug", "gallery/handlebars/1.0.0/handlebars-debug", "./calendar-tpl-debug", "./model-debug" ], function(require, exports, module) {
    // Calendar is designed for desktop, we don't need to consider ``zepto``.
    var $ = require("$-debug");
    var moment = require("gallery/moment/2.0.0/moment-debug");
    var Overlay = require("arale/overlay/1.0.1/overlay-debug");
    var Templatable = require("arale/widget/1.0.3/templatable-debug");
    var i18nlang = "i18n!lang";
    var lang = require(i18nlang) || {};
    var template = require("./calendar-tpl-debug");
    var CalendarModel = require("./model-debug");
    // ## Options
    // default options for calendar
    var defaults = {
        // ### trigger and input
        // element, usually input[type=date], or date icon
        trigger: null,
        triggerType: "click",
        // output format
        format: "YYYY-MM-DD",
        // output field
        output: {
            value: "",
            getter: function(val) {
                val = val ? val : this.get("trigger");
                return $(val);
            }
        },
        // ### overlay
        align: {
            getter: function() {
                var trigger = this.get("trigger");
                if (trigger) {
                    return {
                        selfXY: [ 0, 0 ],
                        baseElement: trigger,
                        baseXY: [ 0, $(trigger).height() + 10 ]
                    };
                }
                return {
                    selfXY: [ 0, 0 ],
                    baseXY: [ 0, 0 ]
                };
            }
        },
        // ### display
        // start of a week, default is Sunday.
        startDay: "Sun",
        showTime: false,
        hideOnSelect: true,
        // when initialize a calendar, which date should be focused.
        // default is today.
        focus: {
            value: "",
            getter: function(val) {
                val = val ? val : $(this.get("trigger")).val();
                if (!val) return moment();
                return moment(val, this.get("format"));
            }
        },
        range: null,
        template: template,
        model: {
            getter: function() {
                if (!this.hasOwnProperty("model")) {
                    var modelConfig = {
                        focus: this.get("focus"),
                        range: this.get("range"),
                        showTime: this.get("showTime"),
                        startDay: this.get("startDay")
                    };
                    this.model = new CalendarModel(modelConfig);
                }
                return this.model;
            }
        }
    };
    var Calendar = Overlay.extend({
        Implements: [ Templatable ],
        attrs: defaults,
        events: {
            "click [data-role=mode-year]": "_changeMode",
            "click [data-role=prev-year]": "prevYear",
            "click [data-role=next-year]": "nextYear",
            "click [data-role=mode-month]": "_changeMode",
            "click [data-role=prev-month]": "prevMonth",
            "click [data-role=next-month]": "nextMonth",
            "click [data-role=previous-10-year]": "_selectYear",
            "click [data-role=next-10-year]": "_selectYear",
            "click [data-role=year]": "_selectYear",
            "click [data-role=month]": "_selectMonth",
            "click [data-role=day]": "_selectDay",
            "click [data-role=date]": "_selectDate",
            "click [data-role=today]": "_selectToday"
        },
        templateHelpers: {
            _: function(key) {
                return lang[key] || key;
            }
        },
        setup: function() {
            Calendar.superclass.setup.call(this);
            var self = this;
            // bind trigger
            var $trigger = $(this.get("trigger"));
            $trigger.on(this.get("triggerType"), function() {
                self.show();
                setFocusedElement(self.element, self.model);
            });
            $trigger.on("keydown", function(ev) {
                self._keyControl(ev);
            });
            $trigger.on("blur", function() {
                self.hide();
            });
            self.element.on("mousedown", function(ev) {
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
            model.on("changeStartday changeMode", function() {
                self.renderPartial("[data-role=data-container]");
                self.renderPartial("[data-role=pannel-container]");
                self.renderPartial("[data-role=month-year-container]");
                setFocusedElement(self.element, self.model);
            });
            model.on("changeMonth changeYear", function() {
                var mode = model.get("mode");
                if (mode.date || mode.year) {
                    self.renderPartial("[data-role=data-container]");
                }
                self.renderPartial("[data-role=month-year-container]");
                setFocusedElement(self.element, self.model);
            });
            model.on("changeRange", function() {
                self.renderPartial("[data-role=data-container]");
            });
            model.on("refresh", function() {
                setFocusedElement(self.element, self.model);
            });
        },
        show: function() {
            Calendar.superclass.show.call(this);
            var $output = this.get("output");
            var date = $output.val();
            if (date) this.setFocus(moment(date, this.get("format")));
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
        setFocus: function(date) {
            this.model.selectDate(date);
            this.model.changeMode("date");
            setFocusedElement(this.element, this.model);
        },
        _selectYear: function(ev) {
            var el = $(ev.target);
            if (el.data("role") === "year") {
                this.model.changeMode("date", {
                    year: el.data("value")
                });
            } else {
                this.model.changeMode("year", {
                    year: el.data("value")
                });
            }
        },
        _selectMonth: function(ev) {
            var el = $(ev.target);
            this.model.changeMode("date", {
                month: el.data("value")
            });
        },
        _selectDay: function(ev) {
            var el = $(ev.target);
            this.model.changeStartDay(el.data("value"));
        },
        _selectDate: function(ev) {
            var el = $(ev.target);
            var date = this.model.selectDate(el.data("value"));
            this._fillDate(date);
        },
        _selectToday: function(ev) {
            var today = moment().format("YYYY-MM-DD");
            var date = this.model.selectDate(today);
            this._fillDate(date);
        },
        _changeMode: function(ev) {
            var mode = $(ev.target).data("role").substring(5);
            this.model.changeMode(mode);
        },
        _keyControl: function(ev) {
            var modeMap = {
                68: "date",
                77: "month",
                89: "year"
            };
            if (ev.keyCode in modeMap) {
                this.model.changeMode(modeMap[ev.keyCode]);
                ev.preventDefault();
                return false;
            }
            var codeMap = {
                13: "enter",
                27: "esc",
                37: "left",
                38: "up",
                39: "right",
                40: "down"
            };
            if (!(ev.keyCode in codeMap)) return;
            ev.preventDefault();
            var keyboard = codeMap[ev.keyCode];
            var mode = this.model.get("mode");
            if (ev.shiftKey && keyboard === "down") {
                this.nextYear();
            } else if (ev.shiftKey && keyboard === "up") {
                this.prevYear();
            } else if (ev.shiftKey && keyboard === "right") {
                this.nextMonth();
            } else if (ev.shiftKey && keyboard === "left") {
                this.prevMonth();
            } else if (keyboard === "esc") {
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
            if (keyboard === "enter") {
                var date = this.model.selectDate();
                this._fillDate(date);
                return;
            }
            var moves = {
                right: 1,
                left: -1,
                up: -7,
                down: 7
            };
            this.model.changeDate(moves[keyboard]);
        },
        _keyControlMonth: function(keyboard) {
            if (keyboard === "enter") {
                var date = this.model.selectDate();
                this.model.changeMode("date", {
                    month: date.month()
                });
                return;
            }
            var moves = {
                right: 1,
                left: -1,
                up: -3,
                down: 3
            };
            this.model.changeMonth(moves[keyboard]);
        },
        _keyControlYear: function(keyboard) {
            if (keyboard === "enter") {
                var date = this.model.selectDate();
                this.model.changeMode("date", {
                    year: date.year()
                });
                return;
            }
            var moves = {
                right: 1,
                left: -1,
                up: -3,
                down: 3
            };
            this.model.changeYear(moves[keyboard]);
        },
        _fillDate: function(date) {
            if (!this.model.isInRange(date)) {
                this.trigger("selectDisabledDate", date);
                return this;
            }
            this.trigger("selectDate", date);
            var trigger = this.get("trigger");
            if (!trigger) {
                return this;
            }
            var $output = this.get("output");
            if (typeof $output[0].value === "undefined") {
                return this;
            }
            var value = date.format(this.get("format"));
            $output.val(value);
            if (this.get("hideOnSelect")) {
                this.hide();
            }
        }
    });
    function setFocusedElement(element, model) {
        var current;
        var mode = model.get("mode");
        var o = [ "date", "month", "year" ];
        for (var i = 0; i < o.length; i++) {
            if (mode[o[i]]) current = o[i];
        }
        if (!current) return;
        var selector = "[data-value=" + model.get(current).current.value + "]";
        element.find(".focused-element").removeClass("focused-element");
        element.find(selector).addClass("focused-element");
    }
    Calendar.autoRender = function(config) {
        config.trigger = config.element;
        config.element = "";
        new Calendar(config);
    };
    module.exports = Calendar;
});

define("arale/calendar/0.8.5/calendar-tpl-debug", [ "gallery/handlebars/1.0.0/handlebars-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.0/handlebars-debug");
    (function() {
        var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
        module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
            this.compilerInfo = [ 2, ">= 1.0.0-rc.3" ];
            helpers = helpers || Handlebars.helpers;
            data = data || {};
            var buffer = "", stack1, stack2, options, functionType = "function", escapeExpression = this.escapeExpression, helperMissing = helpers.helperMissing, self = this;
            function program1(depth0, data) {
                var buffer = "", stack1, stack2;
                buffer += "\n        ";
                stack2 = helpers.each.call(depth0, (stack1 = depth0.day, stack1 == null || stack1 === false ? stack1 : stack1.items), {
                    hash: {},
                    inverse: self.noop,
                    fn: self.program(2, program2, data),
                    data: data
                });
                if (stack2 || stack2 === 0) {
                    buffer += stack2;
                }
                buffer += "\n        ";
                return buffer;
            }
            function program2(depth0, data) {
                var buffer = "", stack1, options;
                buffer += '\n        <li class="ui-calendar-day ui-calendar-day-';
                if (stack1 = helpers.value) {
                    stack1 = stack1.call(depth0, {
                        hash: {},
                        data: data
                    });
                } else {
                    stack1 = depth0.value;
                    stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
                }
                buffer += escapeExpression(stack1) + '" data-role="day" data-value="';
                if (stack1 = helpers.value) {
                    stack1 = stack1.call(depth0, {
                        hash: {},
                        data: data
                    });
                } else {
                    stack1 = depth0.value;
                    stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
                }
                buffer += escapeExpression(stack1) + '">';
                options = {
                    hash: {},
                    data: data
                };
                buffer += escapeExpression((stack1 = helpers["_"], stack1 ? stack1.call(depth0, depth0.label, options) : helperMissing.call(depth0, "_", depth0.label, options))) + "</li>\n        ";
                return buffer;
            }
            function program4(depth0, data) {
                var buffer = "", stack1, stack2;
                buffer += "\n        ";
                stack2 = helpers.each.call(depth0, (stack1 = depth0.date, stack1 == null || stack1 === false ? stack1 : stack1.items), {
                    hash: {},
                    inverse: self.noop,
                    fn: self.program(5, program5, data),
                    data: data
                });
                if (stack2 || stack2 === 0) {
                    buffer += stack2;
                }
                buffer += "\n        ";
                return buffer;
            }
            function program5(depth0, data) {
                var buffer = "", stack1;
                buffer += '\n        <ul class="ui-calendar-date-column">\n            ';
                stack1 = helpers.each.call(depth0, depth0, {
                    hash: {},
                    inverse: self.noop,
                    fn: self.program(6, program6, data),
                    data: data
                });
                if (stack1 || stack1 === 0) {
                    buffer += stack1;
                }
                buffer += "\n        </ul>\n        ";
                return buffer;
            }
            function program6(depth0, data) {
                var buffer = "", stack1;
                buffer += '\n            <li class="ui-calendar-day-';
                if (stack1 = helpers.day) {
                    stack1 = stack1.call(depth0, {
                        hash: {},
                        data: data
                    });
                } else {
                    stack1 = depth0.day;
                    stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
                }
                buffer += escapeExpression(stack1) + " ";
                if (stack1 = helpers.className) {
                    stack1 = stack1.call(depth0, {
                        hash: {},
                        data: data
                    });
                } else {
                    stack1 = depth0.className;
                    stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
                }
                buffer += escapeExpression(stack1) + "\n            ";
                stack1 = helpers.unless.call(depth0, depth0.available, {
                    hash: {},
                    inverse: self.noop,
                    fn: self.program(7, program7, data),
                    data: data
                });
                if (stack1 || stack1 === 0) {
                    buffer += stack1;
                }
                buffer += '\n            "\n            data-role="date" data-value="';
                if (stack1 = helpers.value) {
                    stack1 = stack1.call(depth0, {
                        hash: {},
                        data: data
                    });
                } else {
                    stack1 = depth0.value;
                    stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
                }
                buffer += escapeExpression(stack1) + '"\n            >';
                if (stack1 = helpers.label) {
                    stack1 = stack1.call(depth0, {
                        hash: {},
                        data: data
                    });
                } else {
                    stack1 = depth0.label;
                    stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
                }
                buffer += escapeExpression(stack1) + "</li>\n            ";
                return buffer;
            }
            function program7(depth0, data) {
                return "disabled-date";
            }
            function program9(depth0, data) {
                var buffer = "", stack1, stack2;
                buffer += "\n        ";
                stack2 = helpers.each.call(depth0, (stack1 = depth0.month, stack1 == null || stack1 === false ? stack1 : stack1.items), {
                    hash: {},
                    inverse: self.noop,
                    fn: self.program(10, program10, data),
                    data: data
                });
                if (stack2 || stack2 === 0) {
                    buffer += stack2;
                }
                buffer += "\n        ";
                return buffer;
            }
            function program10(depth0, data) {
                var buffer = "", stack1;
                buffer += '\n        <ul class="ui-calendar-month-column">\n            ';
                stack1 = helpers.each.call(depth0, depth0, {
                    hash: {},
                    inverse: self.noop,
                    fn: self.program(11, program11, data),
                    data: data
                });
                if (stack1 || stack1 === 0) {
                    buffer += stack1;
                }
                buffer += "\n        </ul>\n        ";
                return buffer;
            }
            function program11(depth0, data) {
                var buffer = "", stack1, options;
                buffer += '\n            <li data-role="month" data-value="';
                if (stack1 = helpers.value) {
                    stack1 = stack1.call(depth0, {
                        hash: {},
                        data: data
                    });
                } else {
                    stack1 = depth0.value;
                    stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
                }
                buffer += escapeExpression(stack1) + '">';
                options = {
                    hash: {},
                    data: data
                };
                buffer += escapeExpression((stack1 = helpers["_"], stack1 ? stack1.call(depth0, depth0.label, options) : helperMissing.call(depth0, "_", depth0.label, options))) + "</li>\n            ";
                return buffer;
            }
            function program13(depth0, data) {
                var buffer = "", stack1, stack2;
                buffer += "\n        ";
                stack2 = helpers.each.call(depth0, (stack1 = depth0.year, stack1 == null || stack1 === false ? stack1 : stack1.items), {
                    hash: {},
                    inverse: self.noop,
                    fn: self.program(14, program14, data),
                    data: data
                });
                if (stack2 || stack2 === 0) {
                    buffer += stack2;
                }
                buffer += "\n        ";
                return buffer;
            }
            function program14(depth0, data) {
                var buffer = "", stack1;
                buffer += '\n        <ul class="ui-calendar-year-column">\n            ';
                stack1 = helpers.each.call(depth0, depth0, {
                    hash: {},
                    inverse: self.noop,
                    fn: self.program(15, program15, data),
                    data: data
                });
                if (stack1 || stack1 === 0) {
                    buffer += stack1;
                }
                buffer += "\n        </ul>\n        ";
                return buffer;
            }
            function program15(depth0, data) {
                var buffer = "", stack1, options;
                buffer += '\n            <li data-role="';
                if (stack1 = helpers.role) {
                    stack1 = stack1.call(depth0, {
                        hash: {},
                        data: data
                    });
                } else {
                    stack1 = depth0.role;
                    stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
                }
                buffer += escapeExpression(stack1) + '" data-value="';
                if (stack1 = helpers.value) {
                    stack1 = stack1.call(depth0, {
                        hash: {},
                        data: data
                    });
                } else {
                    stack1 = depth0.value;
                    stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
                }
                buffer += escapeExpression(stack1) + '">';
                options = {
                    hash: {},
                    data: data
                };
                buffer += escapeExpression((stack1 = helpers["_"], stack1 ? stack1.call(depth0, depth0.label, options) : helperMissing.call(depth0, "_", depth0.label, options))) + "</li>\n            ";
                return buffer;
            }
            function program17(depth0, data) {
                var buffer = "", stack1;
                buffer += '\n        <li class="ui-calendar-time" colspan="2" data-role="time"><span class="ui-calendar-hour">' + escapeExpression((stack1 = (stack1 = depth0.time, 
                stack1 == null || stack1 === false ? stack1 : stack1.hour), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</span> : " + escapeExpression((stack1 = (stack1 = depth0.time, 
                stack1 == null || stack1 === false ? stack1 : stack1.minute), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</li>\n        ";
                return buffer;
            }
            buffer += '<div class="ui-calendar">\n    <ul class="ui-calendar-navigation" data-role="navigation-container">\n        <li class="ui-calendar-previous-year" data-role="prev-year">&lt;&lt;</li>\n        <li class="ui-calendar-previous-month" data-role="prev-month">&lt;</li>\n        <li class="ui-calendar-month-year" data-role="month-year-container">\n        <span class="month" data-role="mode-month" data-value="' + escapeExpression((stack1 = (stack1 = (stack1 = depth0.month, 
            stack1 == null || stack1 === false ? stack1 : stack1.current), stack1 == null || stack1 === false ? stack1 : stack1.value), 
            typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers["_"], stack1 ? stack1.call(depth0, (stack1 = (stack1 = depth0.month, 
            stack1 == null || stack1 === false ? stack1 : stack1.current), stack1 == null || stack1 === false ? stack1 : stack1.label), options) : helperMissing.call(depth0, "_", (stack1 = (stack1 = depth0.month, 
            stack1 == null || stack1 === false ? stack1 : stack1.current), stack1 == null || stack1 === false ? stack1 : stack1.label), options))) + '</span>\n        <span class="year" data-role="mode-year">' + escapeExpression((stack1 = (stack1 = (stack1 = depth0.year, 
            stack1 == null || stack1 === false ? stack1 : stack1.current), stack1 == null || stack1 === false ? stack1 : stack1.label), 
            typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '</span>\n        </li>\n        <li class="ui-calendar-next-month" data-role="next-month">&gt;</li>\n        <li class="ui-calendar-next-year" data-role="next-year">&gt;&gt;</li>\n    </ul>\n\n    <ul class="ui-calendar-control" data-role="pannel-container">\n        ';
            stack2 = helpers["if"].call(depth0, (stack1 = depth0.mode, stack1 == null || stack1 === false ? stack1 : stack1.date), {
                hash: {},
                inverse: self.noop,
                fn: self.program(1, program1, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += '\n    </ul>\n\n    <div class="ui-calendar-data-container" data-role="data-container">\n        ';
            stack2 = helpers["if"].call(depth0, (stack1 = depth0.mode, stack1 == null || stack1 === false ? stack1 : stack1.date), {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\n\n        ";
            stack2 = helpers["if"].call(depth0, (stack1 = depth0.mode, stack1 == null || stack1 === false ? stack1 : stack1.month), {
                hash: {},
                inverse: self.noop,
                fn: self.program(9, program9, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\n\n        ";
            stack2 = helpers["if"].call(depth0, (stack1 = depth0.mode, stack1 == null || stack1 === false ? stack1 : stack1.year), {
                hash: {},
                inverse: self.noop,
                fn: self.program(13, program13, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += '\n    </div>\n\n    <ul class="ui-calendar-footer" data-role="time-container">\n        <li class="ui-calendar-today" data-role="today">';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers["_"], stack1 ? stack1.call(depth0, (stack1 = depth0.message, 
            stack1 == null || stack1 === false ? stack1 : stack1.today), options) : helperMissing.call(depth0, "_", (stack1 = depth0.message, 
            stack1 == null || stack1 === false ? stack1 : stack1.today), options))) + "</li>\n        ";
            stack2 = helpers["if"].call(depth0, (stack1 = depth0.mode, stack1 == null || stack1 === false ? stack1 : stack1.time), {
                hash: {},
                inverse: self.noop,
                fn: self.program(17, program17, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\n    </ul>\n</div>\n";
            return buffer;
        });
    })();
});

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
define("arale/calendar/0.8.5/model-debug", [ "$-debug", "arale/base/1.0.1/base-debug", "arale/class/1.0.0/class-debug", "arale/events/1.0.0/events-debug", "gallery/moment/2.0.0/moment-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var Base = require("arale/base/1.0.1/base-debug");
    var moment = require("gallery/moment/2.0.0/moment-debug");
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
                    return createDateModel(val, this.startDay, this.range);
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
            this.startDay = config.startDay || 0;
            this.activeTime = moment(config.focus).clone();
            this.range = config.range || null;
            var message = config.message || {};
            message.today = "Today";
            this.set("message", message);
            this.set("mode", "date");
            this._refresh();
        },
        changeYear: function(number) {
            this.activeTime.add("years", number);
            this._refresh();
            this.trigger("changeYear");
        },
        changeMonth: function(number) {
            this.activeTime.add("months", number);
            this._refresh();
            this.trigger("changeMonth");
        },
        changeDate: function(number) {
            var oldTime = this.activeTime.format("YYYY-MM");
            this.activeTime.add("days", number);
            this._refresh();
            var newTime = this.activeTime.format("YYYY-MM");
            if (oldTime != newTime && this.get("mode").date) {
                this.trigger("changeMonth");
            }
        },
        changeStartDay: function(day) {
            this.startDay = day;
            this._refresh();
            this.trigger("changeStartday");
        },
        changeMode: function(mode, obj) {
            obj || (obj = {});
            if ("month" in obj) this.activeTime.month(obj.month);
            if ("year" in obj) this.activeTime.year(obj.year);
            if (this.get("mode")[mode]) {
                this.set("mode", "date");
            } else {
                this.set("mode", mode);
            }
            this._refresh();
            this.trigger("changeMode");
        },
        changeRange: function(range) {
            this.range = range;
            this._refresh();
            this.trigger("changeRange");
        },
        selectDate: function(time) {
            if (time) {
                var oldTime = this.activeTime.format("YYYY-MM");
                this.activeTime = moment(time);
                this._refresh();
                var newTime = this.activeTime.format("YYYY-MM");
                if (oldTime != newTime && this.get("mode").date) {
                    this.trigger("changeMonth");
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
            this.set("year", this.activeTime.year());
            this.set("month", this.activeTime.month());
            this.set("date", this.activeTime.clone());
            this.set("day");
            this.trigger("refresh");
        },
        range: null,
        activeTime: null,
        startDay: 0
    });
    // Helpers
    // -------
    var MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    var DAYS = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ];
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
        return {
            current: current,
            items: list
        };
    }
    function createYearModel(year) {
        var items = [ {
            value: year - 10,
            label: ". . .",
            role: "previous-10-year"
        } ];
        for (var i = year - 6; i < year + 4; i++) {
            items.push({
                value: i,
                label: i,
                role: "year"
            });
        }
        items[7] = {
            value: year,
            label: year,
            role: "year",
            current: true
        };
        items.push({
            value: year + 10,
            label: ". . .",
            role: "next-10-year"
        });
        var list = [];
        for (i = 0; i < items.length / 3; i++) {
            list.push(items.slice(i * 3, i * 3 + 3));
        }
        var current = {
            value: year,
            label: year
        };
        return {
            current: current,
            items: list
        };
    }
    var DAY_LABELS = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ];
    function createDayModel(startDay) {
        // Translate startDay to number. 0 is Sunday, 6 is Saturday.
        startDay = parseStartDay(startDay);
        var items = [];
        for (var i = startDay; i < 7; i++) {
            items.push({
                label: DAY_LABELS[i],
                value: i
            });
        }
        for (i = 0; i < startDay; i++) {
            items.push({
                label: DAY_LABELS[i],
                value: i
            });
        }
        var current = {
            value: startDay,
            label: DAY_LABELS[startDay]
        };
        return {
            current: current,
            items: items
        };
    }
    function createDateModel(current, startDay, range) {
        var items = [], delta, d, daysInMonth;
        startDay = parseStartDay(startDay);
        var pushData = function(d, className) {
            items.push({
                value: d.format("YYYY-MM-DD"),
                label: d.date(),
                day: d.day(),
                className: className,
                available: isInRange(d, range)
            });
        };
        // reset to the first date of the month
        var currentMonth = current.clone().date(1);
        var previousMonth = currentMonth.clone().add("months", -1);
        var nextMonth = currentMonth.clone().add("months", 1);
        // Calculate days of previous month
        // that should be on current month's sheet
        delta = currentMonth.day() - startDay;
        if (delta < 0) delta += 7;
        if (delta != 0) {
            daysInMonth = previousMonth.daysInMonth();
            // *delta - 1**: we need decrease it first
            for (i = delta - 1; i >= 0; i--) {
                d = previousMonth.date(daysInMonth - i);
                pushData(d, "previous-month");
            }
        }
        daysInMonth = currentMonth.daysInMonth();
        for (i = 1; i <= daysInMonth; i++) {
            d = currentMonth.date(i);
            pushData(d, "current-month");
        }
        // Calculate days of next month
        // that should be on current month's sheet
        delta = 35 - items.length;
        if (delta != 0) {
            if (delta < 0) delta += 7;
            for (i = 1; i <= delta; i++) {
                d = nextMonth.date(i);
                pushData(d, "next-month");
            }
        }
        var list = [];
        for (var i = 0; i < items.length / 7; i++) {
            list.push(items.slice(i * 7, i * 7 + 7));
        }
        var _current = {
            value: current.format("YYYY-MM-DD"),
            label: current.date()
        };
        return {
            current: _current,
            items: list
        };
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
