define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');

  var BaseCalendar = require('./base-calendar');
  var DateColumn = require('./date-column');
  var MonthColumn = require('./month-column');
  var YearColumn = require('./year-column');
  var template = [
    '<div class="ui-calendar">',
    '<div class="ui-calendar-pannel" data-role="pannel">',
    '<span class="ui-calendar-control" data-role="prev-year">&lt;&lt;</span>',
    '<span class="ui-calendar-control" data-role="prev-month">&lt;</span>',
    '<span class="ui-calendar-control month" data-role="current-month"></span>',
    '<span class="ui-calendar-control year" data-role="current-year"></span>',
    '<span class="ui-calendar-control" data-role="next-month">&gt;</span>',
    '<span class="ui-calendar-control" data-role="next-year">&gt;&gt;</span>',
    '</div>',
    '<div class="ui-calendar-container" data-role="container">',
    '</div>',
    '</div>'
  ].join('');

  var Calendar = BaseCalendar.extend({
    attrs: {
      mode: 'dates',
      template: template
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
      },
      'click [data-role=prev-year]': function(ev) {
        var focus = this.years.prev();
        this.dates.select(focus);
        this.months.select(focus);
      },
      'click [data-role=next-year]': function(ev) {
        var focus = this.years.next();
        this.dates.select(focus);
        this.months.select(focus);
      },
      'click [data-role=prev-month]': function(ev) {
        var focus = this.months.prev();
        this.dates.select(focus);
        this.years.select(focus);
      },
      'click [data-role=next-month]': function(ev) {
        var focus = this.months.next();
        this.dates.select(focus);
        this.years.select(focus);
      }
    },

    setup: function() {
      Calendar.superclass.setup.call(this);
      this.renderPannel();

      var attrs = {
        lang: this.get('lang'),
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
        var focus = self.get('focus');
        self.months.select(focus);
        self.years.select(focus);
        if (el) {
          self.trigger('selectDate', value);
          if (moment.isMoment(value)) {
            value = value.format(this.get('format'));
          }
          self.output(value);
        }
      });
      this.months.on('select', function(value, el) {
        var focus = self.get('focus');
        focus.month(value);
        self.set('focus', focus);
        self.renderPannel();
        if (el) {
          self.renderContainer('dates', focus);
          self.trigger('selectMonth', focus);
        }
      });
      this.years.on('select', function(value, el) {
        var focus = self.get('focus');
        focus.year(value);
        self.set('focus', focus);
        self.renderPannel();
        if (el && el.data('role') === 'year') {
          self.renderContainer('dates', focus);
          self.trigger('selectYear', focus);
        }
      });

      var container = this.element.find('[data-role=container]');
      container.append(this.dates.element);
      container.append(this.months.element);
      container.append(this.years.element);
      this.renderContainer('dates');
    },

    renderContainer: function(mode, focus) {
      this.set('mode', mode);

      focus = focus || this.get('focus');

      this.dates.hide();
      this.months.hide();
      this.years.hide();
      this.dates.select(focus, null);
      this.months.select(focus, null);
      this.years.select(focus, null);

      if (mode === 'dates') {
        this.dates.element.show();
      } else if (mode === 'months') {
        this.months.element.show();
      } else if (mode === 'years') {
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
      month = this.get('lang')[month] || month;

      monthPannel.text(month);
      yearPannel.text(focus.year());
    },

    focus: function(date) {
      date = moment(date, this.get('format'));
      this.dates.focus(date);
      this.months.focus(date);
      this.years.focus(date);
    },

    range: function(range) {
      // change range dynamically
      this.set('range', range);
      this.dates.set('range', range);
      this.months.set('range', range);
      this.years.set('range', range);
      this.renderContainer(this.get('mode'));
    },

    show: function() {
      var value = this._outputTime();
      if (value) {
        this.dates.select(value);
      }
      Calendar.superclass.show.call(this);
    },

    destroy: function() {
      this.dates.destroy();
      this.months.destroy();
      this.years.destroy();
      Calendar.superclass.destroy.call(this);
    }
  });

  Calendar.BaseColumn = require('./base-column');
  Calendar.BaseCalendar = BaseCalendar;
  Calendar.DateColumn = DateColumn;
  Calendar.MonthColumn = MonthColumn;
  Calendar.YearColumn = YearColumn;

  module.exports = Calendar;
});
