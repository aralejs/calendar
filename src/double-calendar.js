define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');

  var BaseCalendar = require('./base-calendar');
  var DateColumn = require('./date-column');

  var template = [
    '<div class="ui-calendar ui-double-calendar">',
    '<div class="ui-calendar-pannel" data-role="pannel">',
    '<span class="ui-calendar-control" data-role="prev-year">&lt;&lt;</span>',
    '<span class="ui-calendar-control" data-role="prev-month">&lt;</span>',
    '<span class="ui-calendar-control month" data-role="start-month"></span>',
    '<span class="ui-calendar-control year" data-role="start-year"></span>',
    '<span class="ui-calendar-control month" data-role="end-month"></span>',
    '<span class="ui-calendar-control year" data-role="end-year"></span>',
    '<span class="ui-calendar-control" data-role="next-month">&gt;</span>',
    '<span class="ui-calendar-control" data-role="next-year">&gt;&gt;</span>',
    '</div>',
    '<div class="ui-calendar-container" data-role="container">',
    '</div>',
    '</div>'
  ].join('');

  var Calendar = BaseCalendar.extend({
    attrs: {
      template: template,
    },

    events: {
      'click [data-role=prev-year]': function(ev) {
      },
      'click [data-role=next-year]': function(ev) {
      },
      'click [data-role=prev-month]': function(ev) {
      },
      'click [data-role=next-month]': function(ev) {
      }
    },

    setup: function() {
      Calendar.superclass.setup.call(this);
      this.renderPannel();

      var focus = this.get('focus');

      var attrs = {
        lang: this.get('lang'),
        range: this.get('range'),
        format: this.get('format'),
        startDay: this.get('startDay'),
        process: this.get('process')
      };

      this.startDates = new DateColumn(attrs);
      this.endDates = new DateColumn(attrs);
    },

    renderPannel: function() {
      var focus = this.get('focus');

      var startMonth = this.element.find('[data-role=start-month]');
      var startYear = this.element.find('[data-role=start-year]');
      var endMonth = this.element.find('[data-role=end-month]');
      var endYear = this.element.find('[data-role=end-year]');

      var MONTHS = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      var lang = this.get('lang');
      var month = MONTHS[focus.month()];
      month = lang[month] || month;

      startMonth.text(month);
      startYear.text(focus.year());

      focus = focus.clone();
      focus.add('months', 1)

      month = MONTHS[focus.month()];
      month = lang[month] || month;

      endMonth.text(month);
      endYear.text(focus.year());
    },

    destroy: function() {
      this.startDates.destroy();
      this.endDates.destroy();
      Calendar.superclass.destroy.call(this);
    }
  });

  module.exports = Calendar;
});
