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
    insaneIE = parseInt(match[1], 10) < 9;
  }

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

      this._shim = new Shim(this.element).sync();

      var self = this;
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
      var trigger = this.get('trigger');
      if (!trigger) {
        return;
      }
      var self = this;
      var $trigger = $(trigger);
      if ($trigger.attr('type') === 'date') {
        // remove default style for type date
        $trigger.attr('type', 'text');
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
      var me = this;

      var trigger = $(this.get('trigger'))[0];
      var element = this.element;
      $('body').on('click.calendar', function(e) {
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
      $('body').off('click.calendar');
      BaseCalendar.superclass.destroy.call(this);
    }

  });

  module.exports = BaseCalendar;
});
