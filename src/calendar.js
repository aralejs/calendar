define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');
  var Overlay = require('overlay');
  var Templatable = require('templatable');
  var locale = './i18n/{{locale}}';
  var lang = require(locale) || {};
  var template = require('./templates/calendar.tpl');


  var Calendar = Overlay.extend({
    Implements: [Templatable],

    attrs: {
      trigger: null,
      triggerType: 'click',
      output: {
        value: '',
        getter: function(val) {
          val = val ? val : this.get('trigger');
          return $(val);
        }
      },
      hideOnSelect: true,

      focus: {
        value: '',
        getter: function(val) {
          val = val ? val : $(this.get('trigger')).val();
          if (!val) return moment();
          return moment(val, this.get('format'));
        },
        setter: function(val) {
          if (!val) return moment();
          return moment(val, this.get('format'));
        }
      },

      format: 'YYYY-MM-DD',

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
      }

    },


    setup: function() {
      Calendar.superclass.setup.call(this);
    }
  });

  exports = module.exports = Calendar;
});
