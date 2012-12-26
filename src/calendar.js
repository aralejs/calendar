define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');
  var Overlay = require('overlay');
  var Templatable = require('templatable');
  var locale = './i18n/' + '{{locale}}';
  var lang = require(locale) || {};
  var template = require('./templates/calendar.tpl');

  // ## Options
  // default options for calendar
  var defaults = {
    // ### trigger and input
    // element, usually input[type=date], or date icon
    trigger: null,
    triggerType: 'click',

    // input and output format
    format: 'YYYY-MM-DD',

    // output field
    output: {
      value: '',
      getter: function(val) {
        val = val ? val : this.get('trigger');
        return $(val);
      }
    },

    // ### overlay
    align: {
      getter: function(val) {
        if (val) return val;
        var trigger = this.get('trigger');
        if (trigger) {
          return {
            selfXY: [0, 0],
            baseElement: trigger,
            baseXY: [0, $(trigger).height() + 10]
          };
        }
        return {
          selfXY: [0, 0],
          baseXY: [0, 0]
        };
      }
    },

    // ### display
    // start of a week, default is Sunday.
    startDay: 'Sun',
    hideOnSelect: true,

    // when initialize a calendar, which date should be focused.
    // default is today.
    focus: {
      value: '',
      getter: function(val) {
        val = val ? val : $(this.get('trigger')).val();
        if (!val) return moment();
        return moment(val, this.get('format'));
      }
    },
    range: null,

    template: template,

    model: {}
  };

  var Calendar = Overlay.extend({
    Implements: [Templatable],

    attrs: defaults,

    templateHelpers: {
      '_': function(key) {return lang[key] || key;}
    },

    setup: function() {
      Calendar.superclass.setup.call(this);
    }
  });

  exports = module.exports = Calendar;
});
