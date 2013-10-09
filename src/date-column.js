define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');
  var BaseColumn = require('./base-column');

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
      var prev = this.get('focus').format('YYYY-MM-DD');
      var focus = this.get('focus').add('days', -1);
      return this._sync(focus, prev);
    },

    next: function() {
      var prev = this.get('focus').format('YYYY-MM-DD');
      var focus = this.get('focus').add('days', 1);
      return this._sync(focus, prev);
    },

    select: function(value, el) {
      if (el && el.hasClass('disabled-element')) {
        this.trigger('selectDisable', value, el);
        return value;
      }
      var prev = this.get('focus').format('YYYY-MM-DD');
      this.set('focus', value);
      return this._sync(this.get('focus'), prev, el);
    },

    focus: function(focus) {
      focus = focus || this.get('focus');
      var selector = '[data-value=' + focus.format('YYYY-MM-DD') + ']';
      this.element.find('.focused-element').removeClass('focused-element');
      this.element.find(selector).addClass('focused-element');
    },

    inRange: function(date) {
      if (!moment.isMoment(date)) {
        date = moment(date, this.get('format'));
      }
      return BaseColumn.isInRange(date, this.get('range'));
    },

    _sync: function(focus, prev, el) {
      this.set('focus', focus);
      if (focus.format('YYYY-MM') !== prev) {
        this.refresh();
      }
      this.focus(focus);
      // if user call select(value, null) it will not trigger an event
      if (el !== null) {
        this.trigger('select', focus, el);
      }
      return focus;
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
      startDay = parseInt(startDay, 10);
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
        available: BaseColumn.isInRange(d, range)
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


  /* template in handlebars
  <table class="ui-calendar-date" data-role="date-column">
    <tr class="ui-calendar-day-column">
      {{#each day.items}}
      <th class="ui-calendar-day ui-calendar-day-{{value}}" data-role="day" data-value="{{value}}">{{_ label}}</th>
      {{/each}}
    </tr>
    {{#each date.items}}
    <tr class="ui-calendar-date-column">
      {{#each this}}
      <td class="ui-calendar-day-{{day}} {{className}} {{#unless available}}disabled-element{{/unless}}" data-role="date" data-value="{{value}}">{{label}}</td>
      {{/each}}
    </tr>
    {{/each}}
  </table>
  */

  function template(model, options) {
    // keep the same API as handlebars

    var _ = options.helpers._;
    var html = '<table class="ui-calendar-date" data-role="date-column">';

    // day column
    html += '<tr class="ui-calendar-day-column">';
    $.each(model.day.items, function(i, item) {
      html += '<th class="ui-calendar-day ui-calendar-day-' + item.value + '" ';
      html += 'data-role="day" data-value="' + item.value + '">';
      html += _(item.label);
      html += '</th>';
    });
    html += '</tr>';

    // date column
    $.each(model.date.items, function(i, items) {
      html += '<tr class="ui-calendar-date-column">'
      $.each(items, function(i, item) {
        var className = [
          'ui-calendar-day-' + item.day,
          item.className || ''
        ];
        if (!item.available) {
          className.push('disabled-element');
        }
        html += '<td class="' + className.join(' ') + '" data-role="date"';
        html += 'data-value="' + item.value + '">';
        html += item.label + '</td>';
      });
      html += '</tr>';
    });

    html += '</table>';
    return html;
  }
});
