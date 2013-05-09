define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');
  var Position = require('position');

  var lang = require('./i18n/{locale}') || {};
  var BaseColumn = require('./base-column');
  var DateColumn = require('./date-column');
  var MonthColumn = require('./month-column');
  var YearColumn = require('./year-column');
  var template = require('./templates/calendar.handlebars');

  var Calendar = BaseColumn.extend({
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
      mode: 'dates',
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
      Calendar.superclass.setup.call(this);

      var attrs = {
        lang: lang,
        focus: this.get('focus'),
        range: this.get('range'),
        format: this.get('format'),
        startDay: this.get('startDay'),
        process: this.get('process')
      };

      this.dates = new DateColumn(attrs);
      this.months = new MonthColumn(attrs);
      this.years = new YearColumn(attrs);

      var self = this;
      this.dates.on('select', function(value) {
        self.set('focus', value);
        self._output(value);
      });

      var container = this.element.find('[data-role=container]');
      this.dates.focus();
      container.html(this.dates.element);

      var trigger = this.get('trigger');
      if (trigger) {
        $(trigger).on(this.get('triggerType'), function() {
          self.show();
        });
      }
    },

    renderContainer: function(mode) {
      this.set('mode', mode);

      var focus = this.get('focus');
      var container = this.element.find('[data-role=container]');

      if (mode === 'dates') {
        this.dates.select(focus);
        container.html(this.dates.element);
      }

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

    destroy: function() {
      this.dates.destroy();
      this.months.destroy();
      this.years.destroy();
      Calendar.superclass.destroy.call(this)
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
      if (typeof output[0].value === 'undefined') {
        return;
      }
      value = value || this.get('focus');
      if (moment.isMoment(value)) {
        value = value.format(this.get('format'));
      }
      output.val(value);
      if (this.get('hideOnSelect')) {
        this.hide();
      }
    }

  });

  exports = module.exports = Calendar;
});
