define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');
  var Templatable = require('templatable');
  var Overlay = require('overlay');
  var lang = require('i18n!lang') || {};
  var template = require('./year.tpl');

  var Year = Overlay.extend({
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
      'click [data-role=year]': 'selectYear',
      'click [data-role=previous-10-year]': '_renderYear',
      'click [data-role=next-10-year]': '_renderYear'
    },

    templateHelpers: {
      '_': function(key) {return lang[key] || key;}
    },

    initialize: function(config) {
      Year.superclass.initialize.call(this);
      var focus = moment(config.focus);
      this.set('focus', focus);
    },

    show: function() {
      Year.superclass.show.call(this);
      this.setFocus();
    },

    prevYear: function() {
      this.get('focus').add('years', -1);
      this.setFocus();
      return this.get('focus');
    },

    nextYear: function() {
      this.get('focus').add('years', 1);
      this.setFocus();
      return this.get('focus');
    },

    changeYear: function(value) {
      this.get('focus').year(value);
      this.setFocus();
      return value;
    },

    selectYear: function(ev) {
      var el = $(ev.target);
      var value = el.data('value');
      this.changeYear(value);
      this.trigger('selectYear', value);
      return value;
    },

    setFocus: function() {
      var selector = '[data-value=' + this.get('focus').year() + ']';
      this.element.find('.focused-element').removeClass('focused-element');
      this.element.find(selector).addClass('focused-element');
    },

    _renderYear: function(ev) {
      var el = $(ev.target);
      var value = el.data('value');
      this.get('focus').year(value);
      var template = this.get('template');
      var model = this.get('model');
      this.element.html(this.compile(template, model));
      this.setFocus();
    }
  });

  module.exports = Year;

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
