define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');
  var Templatable = require('templatable');
  var Widget = require('widget');

  var BaseColumn = Widget.extend({
    Implements: [Templatable],

    attrs: {
      focus: {
        value: moment(),
        setter: function(val) {
          if (!val) return moment();
          return moment(val, this.get('format'));
        }
      },
      template: '',
      format: 'YYYY-MM-DD',
      lang: {}
    },

    templateHelpers: {},

    parseElement: function() {
      var self = this;
      this.templateHelpers['_'] = function(key) {
        var lang = self.get('lang') || {};
        return lang[key] || key;
      };
      BaseColumn.superclass.parseElement.call(this);
    },

    show: function() {
      this.render();
      this.focus();
    },

    refresh: function() {
      var model = this.get('model');
      var template = this.get('template');
      this.element.html($(this.compile(template, model)).html());
    }
  });

  module.exports = BaseColumn;
});
