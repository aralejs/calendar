define(function(require, exports, module) {

  var $ = require('$');
  var Position = require('position');
  var moment = require('moment');
  var Widget = require('widget');
  var Shim = require('iframe-shim');
  var lang = require('./i18n/zh-cn') || {};

  var ua = (window.navigator.userAgent || "").toLowerCase();
  var match = ua.match(/msie\s+(\d+)/);
  var insaneIE = false;
  if (match && match[1]) {
    // IE < 9
    insaneIE = parseInt(match[1], 10) < 9;
  }
  if (document.documentMode && document.documentMode < 9) {
    insaneIE = true;
  }

  var current_date = moment();
  current_date = moment([current_date.year(), current_date.month(), current_date.date()]);

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
          val = val || this._outputTime();
          if (val) {
            return moment(val, this.get('format'));
          }
          return current_date;
        },
        setter: function(val) {
          if (!val) {
            return current_date;
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
              baseXY: [0, '100%']
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

      this._shim = new Shim(this.element).sync();

      var self = this;

      // keep cursor focus in trigger
      this.element.on('mousedown', function(e) {
        if (insaneIE) {
          var trigger = $(self.get('trigger'))[0];
          trigger.onbeforedeactivate = function() {
            window.event.returnValue = false;
            trigger.onbeforedeactivate = null;
          };
        }
        e.preventDefault();
      });
    },

    show: function() {
      this.trigger('show');
      if (!this.rendered) {
        this._pin();
        this.render();
      }
      this._pin();
      this.element.show();
    },

    hide: function() {
      this.trigger('hide');
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

    _outputTime: function() {
      // parse time from output value
      var output = $(this.get('output'));
      var value = output.val() || output.text();
      if (value) {
        value = moment(value, this.get('format'));
        if (value.isValid()) {
          return value;
        }
      }
    },

    output: function(value) {
      // send value to output
      var output = this.get('output');
      if (!output.length) {
        return;
      }
      value = value || this.get('focus');
      var tagName = output[0].tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea') {
        output.val(value);
      } else {
        output.text(value);
      }
      if (this.get('hideOnSelect')) {
        this.hide();
      }
    },

    enable: function() {
      // enable trigger for show calendar
      var trigger = this.get('trigger');
      if (!trigger) {
        return;
      }
      var self = this;
      var $trigger = $(trigger);
      if ($trigger.attr('type') === 'date') {
        try {
          // remove default style for type date
          $trigger.attr('type', 'text');
        } catch (e) {
        }
      }
      var event = this.get('triggerType') + '.calendar';
      $trigger.on(event, function() {
        self.show();
      });
      $trigger.on('blur.calendar', function() {
        self.hide();
      });
      // enable auto hide feature
      if ($trigger[0].tagName.toLowerCase() !== 'input') {
        self.autohide();
      }
    },

    disable: function() {
      // disable trigger
      var trigger = this.get('trigger');
      var self = this;
      if (trigger) {
        var $trigger = $(trigger);
        var event = this.get('triggerType') + '.calendar';
        $trigger.off(event);
        $trigger.off('blur.calendar');
      }
    },

    autohide: function() {
      // autohide when trigger is not input
      var me = this;

      var trigger = $(this.get('trigger'))[0];
      var element = this.element;

      // click anywhere except calendar and trigger
      $('body').on('mousedown.calendar', function(e) {
        // not click on element
        if (element.find(e.target).length || element[0] === e.target) {
          return;
        }
        // not click on trigger
        if (trigger !== e.target) {
          me.hide();
        }
      });
    },

    destroy: function() {
      if (this._shim) {
        this._shim.destroy();
      }
      // clean event binding of autohide
      $('body').off('mousedown.calendar');
      BaseCalendar.superclass.destroy.call(this);
    }

  });

  module.exports = BaseCalendar;
});
