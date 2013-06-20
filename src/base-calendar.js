define(function(require, exports, module) {

  var $ = require('$');
  var Position = require('position');
  var moment = require('moment');
  var Widget = require('widget');
  var lang = require('./i18n/{locale}') || {};

  var BaseCalendar = Widget.extend({
    attrs: {
      lang: lang,
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
          if (!val) {
            return moment();
          }
          return moment(val, this.get('format'));
        },
        setter: function(val) {
          if (!val) {
            return moment();
          }
          return moment(val, this.get('format'));
        }
      },

      format: 'YYYY-MM-DD',

      startDay: 'Sun',

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

      align: {
        getter: function(val) {
          if (val) return val;

          var trigger = $(this.get('trigger'));
          if (trigger) {
            return {
              selfXY: [0, 0],
              baseElement: trigger,
              baseXY: [0, trigger.height() + 10]
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
      BaseCalendar.superclass.setup.call(this);

      this.enable();
      this.element.on('mousedown', function(e) {
        // TODO: ie
        e.preventDefault();
      });
    },

    show: function() {
      if (!this.rendered) {
        this._pin();
        this.render();
      }
      this._pin();
      this.element.show();
    },

    hide: function() {
      this.element.hide();
    },

    _pin: function(align) {
      align = align || this.get('align');
      Position.pin({
        element: this.element,
        x: align.selfXY[0],
        y: align.selfXY[1]
      }, {
        element: align.baseElement,
        x: align.baseXY[0],
        y: align.baseXY[1]
      });
    },

    _output: function(value) {
      var output = this.get('output');
      if (!output.length) {
        return;
      }
      if (typeof output[0].value === 'undefined') {
        output.text(value);
      } else {
        output.val(value);
      }
      if (this.get('hideOnSelect')) {
        this.hide();
      }
    },

    enable: function() {
      var trigger = this.get('trigger');
      var self = this;
      if (trigger) {
        var $trigger = $(this.get('trigger'));
        var event = this.get('triggerType') + '.calendar';
        $trigger.on(event, function() {
          self.show();
        });
        $trigger.on('blur.calendar', function() {
          self.hide();
        });
      }
    },

    disable: function() {
      var trigger = this.get('trigger');
      var self = this;
      if (trigger) {
        var $trigger = $(this.get('trigger'));
        var event = this.get('triggerType') + '.calendar';
        $trigger.off(event);
        $trigger.off('blur.calendar');
      }
    }

  });

  module.exports = BaseCalendar;
});
