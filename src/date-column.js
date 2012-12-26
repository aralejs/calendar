define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');
  var Templatable = require('templatable');
  var Widget = require('widget');
  var template = require('./templates/date.tpl');

  var DateColumn = Widget.extend({
    Implements: [Templatable],

    attrs: {
      focus: moment(),
      range: null,
      format: 'YYYY-MM-DD',
      template: template,
      model: {
        getter: function() {
          var focus = moment(this.get('focus'), this.get('format'));
          return createDateModel(focus, this.get('range'));
        }
      }
    },

    events: {
      'click [data-role=date]': function(ev) {
        var el = $(ev.target);
        var value = el.data('value');
        this.select(value);
      }
    },

    templateHelpers: {},

    initialize: function(config) {
      config = config || {};
      this.templateHelpers['_'] = function(key) {
        var lang = config.lang || {};
        return lang[key] || key;
      };
      this.set('range', config.range || null);
      this.set('format', config.format || 'YYYY-MM-DD');

      DateColumn.superclass.initialize.call(this);
      var focus = moment(config.focus, this.get('format'));
      this.set('focus', focus);
    },

    show: function() {
      this.render();
      this.focus();
    },

    prev: function() {
      this.get('focus').add('dates', -1);
      this.focus();
      return this.get('focus');
    },

    next: function() {
      this.get('focus').add('dates', 1);
      this.focus();
      return this.get('focus');
    },

    select: function(value) {
      this.get('focus').date(value);
      this.focus();
      this.trigger('select', value);
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

