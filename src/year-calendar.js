define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');
  var Templatable = require('templatable');
  var Widget = require('widget');
  var template = require('./templates/year.tpl');

  var YearCalendar = Widget.extend({
    Implements: [Templatable],

    attrs: {
      focus: moment(),
      range: null,
      template: template,
      model: {
        getter: function() {
          return createYearModel(this.get('focus'), this.get('range'));
        }
      }
    },

    events: {
      'click [data-role=year]': 'select',
      'click [data-role=previous-10-year]': 'select',
      'click [data-role=next-10-year]': 'select'
    },

    templateHelpers: {},

    initialize: function(config) {
      this.templateHelpers['_'] = function(key) {
        var lang = config.lang || {};
        return lang[key] || key;
      };

      YearCalendar.superclass.initialize.call(this);

      var focus = moment(config.focus);
      this.set('focus', focus);
    },

    show: function() {
      this.render();
      this.focus();
    },

    prev: function() {
      this.get('focus').add('years', -1);
      this.refresh();
      this.focus();
      return this.get('focus');
    },

    next: function() {
      this.get('focus').add('years', 1);
      this.refresh();
      this.focus();
      return this.get('focus');
    },

    to: function(value) {
      this.get('focus').year(value);
      this.refresh();
      this.focus();
      return value;
    },

    select: function(ev) {
      var el = $(ev.target);
      var value = el.data('value');
      this.to(value);
      this.trigger('select', value);
      return value;
    },

    focus: function() {
      var selector = '[data-value=' + this.get('focus').year() + ']';
      this.element.find('.focused-element').removeClass('focused-element');
      this.element.find(selector).addClass('focused-element');
    },

    refresh: function() {
      var focus = this.get('focus').year();
      var years = this.element.find('[data-role=year]');
      if (focus < years.first().data('value') || focus > years.last().data('value')) {
        var model = this.get('model');
        var template = this.get('template');
        this.element.html($(this.compile(template, model)).html());
      }
    }
  });

  module.exports = YearCalendar;

  // helpers
  function createYearModel(time, range) {
    var year = time.year();

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
