define(function(require, exports, module) {
  var $ = require('$');
  var BaseColumn = require('./base-column');
  var template = require('./templates/month.handlebars');

  var MonthColumn = BaseColumn.extend({
    attrs: {
      template: template,
      range: null,
      process: null,
      model: {
        getter: function() {
          return createMonthModel(
            this.get('focus'), this.get('range'), this.get('process')
          );
        }
      }
    },

    events: {
      'click [data-role=month]': function(ev) {
        var el = $(ev.target);
        var value = el.data('value');
        this.select(value, el);
      }
    },

    prev: function() {
      this.get('focus').add('months', -1);
      this.focus();
      return this.get('focus');
    },

    next: function() {
      this.get('focus').add('months', 1);
      this.focus();
      return this.get('focus');
    },

    select: function(value, el) {
      if (el && el.hasClass('disabled-element')) {
        this.trigger('selectDisable', value, el);
        return value;
      }
      this.get('focus').month(value);
      this.focus();
      this.trigger('select', value, el);
      return value;
    },

    focus: function() {
      var selector = '[data-value=' + this.get('focus').month() + ']';
      this.element.find('.focused-element').removeClass('focused-element');
      this.element.find(selector).addClass('focused-element');
    }
  });

  module.exports = MonthColumn;

  // helpers
  var MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  function createMonthModel(time, range, fn) {
    var month = time.month();
    var items = [];

    for (i = 0; i < MONTHS.length; i++) {
      var item = {
        value: i,
        available: isInRange(i, range),
        label: MONTHS[i]
      };
      if (fn) {
        item.type = 'month';
        item = fn(item);
      }
      items.push(item);
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

  function isInRange(month, range) {
    if (range == null) return true;
    if ($.isArray(range)) {
      var start = range[0];
      var end = range[1];
      var result = true;
      if (start) {
        result = result && month >= start;
      }
      if (end) {
        result = result && month <= end;
      }
      return result;
    }
    if ($.isFunction(range)) {
      return range(month);
    }
    return true;
  }
});
