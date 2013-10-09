define(function(require, exports, module) {
  var $ = require('$');
  var BaseColumn = require('./base-column');

  var YearColumn = BaseColumn.extend({
    attrs: {
      process: null,
      template: template,
      model: {
        getter: function() {
          return createYearModel(
            this.get('focus'), this.get('range'), this.get('process')
          );
        }
      }
    },

    events: {
      'click [data-role=year],[data-role=previous-10-year],[data-role=next-10-year]': function(ev) {
        var el = $(ev.target);
        var value = el.data('value');
        this.select(value, el);
      }
    },

    setup: function() {
      YearColumn.superclass.setup.call(this);
      this.on('change:range', function() {
        this.element.html($(this.compileTemplate()).html());
      });
    },

    prev: function() {
      var focus = this.get('focus').add('years', -1);
      return this._sync(focus);
    },

    next: function() {
      var focus = this.get('focus').add('years', 1);
      return this._sync(focus);
    },

    select: function(value, el) {
      if (el && el.hasClass('disabled-element')) {
        this.trigger('selectDisable', value, el);
        return value;
      }
      var focus;
      if (value.year) {
        focus = value;
      } else {
        focus = this.get('focus').year(value);
      }
      return this._sync(focus, el);
    },

    focus: function(focus) {
      focus = focus || this.get('focus');
      var selector = '[data-value=' + focus.year() + ']';
      this.element.find('.focused-element').removeClass('focused-element');
      this.element.find(selector).addClass('focused-element');
    },

    refresh: function() {
      var focus = this.get('focus').year();
      var years = this.element.find('[data-role=year]');
      if (focus < years.first().data('value') || focus > years.last().data('value')) {
        this.element.html($(this.compileTemplate()).html());
      }
    },

    inRange: function(date) {
      return isInRange(date, this.get('range'));
    },

    _sync: function(focus, el) {
      this.set('focus', focus);
      this.refresh();
      this.focus(focus);
      if (el !== null) {
        this.trigger('select', focus.year(), el);
      }
      return focus;
    }
  });

  module.exports = YearColumn;

  // helpers
  function createYearModel(time, range, fn) {
    var year = time.year();

    var items = [process({
      value: year - 10,
      label: '. . .',
      available: true,
      role: 'previous-10-year'
    }, fn)];

    for (var i = year - 6; i < year + 4; i++) {
      items.push(process({
        value: i,
        label: i,
        available: isInRange(i, range),
        role: 'year'
      }, fn));
    }

    items.push(process({
      value: year + 10,
      label: '. . .',
      available: true,
      role: 'next-10-year'
    }, fn));

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

  function process(item, fn) {
    if (!fn) {
      return item;
    }
    item.type = 'year';
    return fn(item);
  }

  function isInRange(date, range) {
    if (range == null) {
      return true;
    }
    if ($.isArray(range)) {
      var start = range[0];
      if (start && start.year) {
        start = start.year();
      }
      var end = range[1];
      if (end && end.year) {
        end = end.year();
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
  <table class="ui-calendar-year" data-role="year-column">
    {{#each items}}
    <tr class="ui-calendar-year-column">
      {{#each this}}
      <td {{#unless available}}class="disabled-element"{{/unless}} data-role="{{role}}" data-value="{{value}}">{{_ label}}</td>
      {{/each}}
    </tr>
    {{/each}}
  </table>
  */

  function template(model, options) {
    var _ = options.helpers._;
    var html = '<table class="ui-calendar-year" data-role="year-column">';

    $.each(model.items, function(i, items) {
      html += '<tr class="ui-calendar-year-column">';
      $.each(items, function(i, item) {
        html += '<td data-role="' + item.role + '"';
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
