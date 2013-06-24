define(function(require, exports, module) {
  var $ = require('$');
  var BaseColumn = require('./base-column');

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
      var focus = this.get('focus').add('months', -1);
      return this._sync(focus);
    },

    next: function() {
      var focus = this.get('focus').add('months', 1);
      return this._sync(focus);
    },

    select: function(value, el) {
      if (el && el.hasClass('disabled-element')) {
        this.trigger('selectDisable', value, el);
        return value;
      }

      var focus;
      if (value.month) {
        focus = value;
      } else {
        focus = this.get('focus').month(value);
      }
      return this._sync(focus, el);
    },

    focus: function(focus) {
      focus = focus || this.get('focus');
      var selector = '[data-value=' + focus.month() + ']';
      this.element.find('.focused-element').removeClass('focused-element');
      this.element.find(selector).addClass('focused-element');
    },

    _sync: function(focus, el) {
      this.set('focus', focus);
      this.focus(focus);
      // if user call select(value, null) it will not trigger an event
      if (el !== null) {
        this.trigger('select', focus.month(), el);
      }
      return focus;
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

  function isInRange(date, range) {
    if (range == null) {
      return true;
    }
    if ($.isArray(range)) {
      var start = range[0];
      if (start && start.month) {
        start = start.month();
      }
      var end = range[1];
      if (end && end.month) {
        end = end.month();
      }
      var result = true;
      if (start) {
        result = result && date >= start;
      }
      if (end) {
        result = result && date <= end;
      }
      return result;
    }
    return true;
  }

  /* template in handlebars
  <table class="ui-calendar-month" data-role="month-column">
  {{#each items}}
  <tr class="ui-calendar-month-column">
      {{#each this}}
      <td class="{{#unless available}}disabled-element{{/unless}}" data-role="month" data-value="{{value}}">{{_ label}}</td>
      {{/each}}
  </tr>
  {{/each}}
  </table>
  */

  function template(model, options) {
    var _ = options.helpers._;
    html = '<table class="ui-calendar-month" data-role="month-column">';

    $.each(model.items, function(i, items) {
      html += '<tr class="ui-calendar-month-column">';
      $.each(items, function(i, item) {
        html += '<td data-role="month"';
        if (!item.available) {
          html += ' class="disabled-element"';
        }
        html += 'data-value="' + item.value + '">';
        html += _(item.label) + '</td>';
      });
      html += '</tr>';
    });

    html += '</table>';
    return html;
  }

});
