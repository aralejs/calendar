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

    events: {
      'click [data-role=current-month]': function(ev) {
        if (this.get('mode') === 'months') {
          this.renderContainer('dates');
        } else {
          this.renderContainer('months');
        }
      },
      'click [data-role=current-year]': function(ev) {
        if (this.get('mode') === 'years') {
          this.renderContainer('dates');
        } else {
          this.renderContainer('years');
        }
      }
    },

    setup: function() {
      Calendar.superclass.setup.call(this);
      this.renderPannel();

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
      this.dates.on('select', function(value, el) {
        self.set('focus', value);
        if (el) {
          self._output(value);
        }
      });
      this.months.on('select', function(value, el) {
        var focus = self.get('focus');
        focus.month(value);
        self.set('focus', focus);
        self.renderPannel();
        if (el) {
          self.renderContainer('dates', focus);
        }
      });
      this.years.on('select', function(value, el) {
        var focus = self.get('focus');
        focus.year(value);
        self.set('focus', focus);
        self.renderPannel();
        if (el) {
          self.renderContainer('dates', focus);
        }
      });

      var container = this.element.find('[data-role=container]');
      container.append(this.dates.element);
      container.append(this.months.element);
      container.append(this.years.element);
      this.renderContainer('dates');

      var trigger = this.get('trigger');
      if (trigger) {
        $(trigger).on(this.get('triggerType'), function() {
          self.show();
        });
      }
    },

    renderContainer: function(mode, focus) {
      this.set('mode', mode);

      focus = focus || this.get('focus');

      this.dates.hide();
      this.months.hide();
      this.years.hide();

      if (mode === 'dates') {
        this.dates.select(focus);
        this.dates.element.show();
      } else if (mode === 'months') {
        this.months.select(focus.month());
        this.months.element.show();
      } else if (mode === 'years') {
        this.years.select(focus.year());
        this.years.element.show();
      }
      return this;

    },

    renderPannel: function() {
      var focus = this.get('focus');
      var monthPannel = this.element.find('[data-role=current-month]');
      var yearPannel = this.element.find('[data-role=current-year]');

      var MONTHS = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      var month = MONTHS[focus.month()];
      month = lang[month] || month;

      monthPannel.text(month);
      yearPannel.text(focus.year());
    },

    show: function() {
      if (!this.rendered) {
        this._pin();
        this.render();
      }
      this._pin();
      this.element.show();
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
