define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');
  var Widget = require('widget');
  
  var current_date = moment();
  current_date = moment([current_date.year(), current_date.month(), current_date.date()]);

  var BaseColumn = Widget.extend({
    attrs: {
      focus: {
        value: '',
        getter: function(val) {
          if (val) {
            return val;
          }
          return current_date;
        },
        setter: function(val) {
          if (!val) {
            return current_date;
          }
          if (moment.isMoment(val)) {
            return val;
          }
          return moment(val, this.get('format'));
        }
      },
      template: null,
      format: 'YYYY-MM-DD',
      range: {
        value: '',
        getter: function(val) {
          if (!val) {
            return null;
          }
          if ($.isArray(val)) {
            var start = val[0];
            if (start && start.length > 4) {
              start = moment(start, this.get('format'));
            }
            var end = val[1];
            if (end && end.length > 4) {
              end = moment(end, this.get('format'));
            }
            return [start, end];
          }
          return val;
        }
      },
      lang: {}
    },

    compileTemplate: function() {
      // the template is a runtime handlebars function
      var fn = this.get('template');
      if (!fn) {
        return '';
      }
      var model = this.get('model');

      var self = this;
      var lang = this.get('lang') || {};

      return fn(model, {
        helpers: {
          '_': function(key) {
            return lang[key] || key;
          }
        }
      });
    },

    parseElement: function() {
      // rewrite parseElement of widget
      this.element = $(this.compileTemplate());
    },

    show: function() {
      this.render();
      this.focus();
    },

    hide: function() {
      this.element.hide();
    },

    refresh: function() {
      this.element.html($(this.compileTemplate()).html());
    }

  });

  module.exports = BaseColumn;

  BaseColumn.isInRange = function(date, range) {
    if (range == null) {
      return true;
    }
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
  };
});
