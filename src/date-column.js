define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');
  var BaseColumn = require('./base-column');
  var template = require('./templates/date.handlebars');

  var DateColumn = BaseColumn.extend({
    attrs: {
      startDay: 'Sun',
      template: template,
      range: {
        value: null,
        setter: function(val) {
          if ($.isArray(val)) {
            var format = this.get('format');
            var range = [];
            $.each(val, function(i, date) {
              date = date === null ? null : moment(date, format);
              range.push(date);
            });
            return range;
          }
          return val;
        }
      },
      process: null,
      model: {
        getter: function() {
          var date = createDateModel(
            this.get('focus'),
            this.get('startDay'),
            this.get('range'),
            this.get('process')
          );
          var day = createDayModel(this.get('startDay'));
          return {date: date, day: day};
        }
      }
    },

    events: {
      'click [data-role=date]': function(ev) {
        var el = $(ev.target);
        var value = el.data('value');
        this.select(value, el);
      }
    },

    prev: function() {
      var pre = this.get('focus').month();
      this.get('focus').add('days', -1);
      var post = this.get('focus').month();
      if (pre !== post) this.refresh();
      this.focus();
      return this.get('focus');
    },

    next: function() {
      var pre = this.get('focus').month();
      this.get('focus').add('days', 1);
      var post = this.get('focus').month();
      if (pre !== post) this.refresh();
      this.focus();
      return this.get('focus');
    },

    select: function(value, el) {
      if (el && el.hasClass('disabled-element')) {
        this.trigger('selectDisable', value, el);
        return value;
      }

      var pre = this.get('focus').month();
      this.set('focus', value);
      var post = this.get('focus').month();
      if (pre !== post) {
        this.refresh();
      }
      this.focus();
      this.trigger('select', value, el);
      return value;
    },

    focus: function() {
      var selector = '[data-value=' + this.get('focus').format('YYYY-MM-DD') + ']';
      this.element.find('.focused-element').removeClass('focused-element');
      this.element.find(selector).addClass('focused-element');
    }
  });

  module.exports = DateColumn;

  // helpers
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


  function createDateModel(current, startDay, range, fn) {
    var items = [], delta, d, daysInMonth;
    startDay = parseStartDay(startDay);

    var pushData = function(d, className) {
      var item = {
        value: d.format('YYYY-MM-DD'),
        label: d.date(),

        day: d.day(),
        className: className,
        available: isInRange(d, range)
      };
      if (fn) {
        item.type = 'date';
        item = fn(item);
      }
      items.push(item);
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


  function isInRange(date, range) {
    if (range == null) return true;
    if ($.isArray(range)) {
      var start = range[0];
      var end = range[1];
      var result = true;
      if (start) {
        result = result && date >= start;
      }
      if (end) {
        result = result && date <= end;
      }
      return result;
    }
    if ($.isFunction(range)) {
      return range(date);
    }
    return true;
  }
});
