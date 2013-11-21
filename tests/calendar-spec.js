define(function(require) {
  var $ = require('jquery');
  var expect = require('expect');
  var moment = require('moment');
  var Calendar = require('calendar');
  var cal;

  var ua = (window.navigator.userAgent || "").toLowerCase();
  var isIE = ua.match(/msie\s+(\d+)/);

  describe('Calendar', function() {
    it('can initialize without options', function() {
      cal = new Calendar();
      expect(cal.element.find('table').length > 2).to.be.ok();
      cal.destroy();
    });

    it('set no focus', function() {
      cal = new Calendar();
      cal.set('focus');
      expect(cal.get('focus').format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'));
      cal.destroy();
    });

    it('should focus on 2012-08-11 when show', function() {
      cal = new Calendar({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').data('value')).to.equal('2012-08-11');
      cal.element.remove();
      cal.destroy();
    });

    it('can reset focus', function() {
      cal = new Calendar({focus: '2012-08-11'});
      cal.show();
      cal.focus('2012-08-13');
      expect(cal.element.find('.focused-element').data('value')).to.equal('2012-08-13');
      cal.element.remove();
      cal.destroy();
    });

    it('can switch to month', function() {
      cal = new Calendar();
      cal.render();
      expect(cal.element.find('[data-role=date-column]').is(':visible')).to.be.ok();

      cal.element.find('[data-role=current-month]').click();
      expect(cal.element.find('[data-role=date-column]').is(':visible')).to.not.be.ok();
      expect(cal.element.find('[data-role=month-column]').is(':visible')).to.be.ok();

      // switch back
      cal.element.find('[data-role=current-month]').click();
      expect(cal.element.find('[data-role=date-column]').is(':visible')).to.be.ok();

      cal.element.remove();
      cal.destroy();
    });

    it('can switch to year', function() {
      cal = new Calendar();
      cal.render();
      expect(cal.element.find('[data-role=date-column]').is(':visible')).to.be.ok();

      cal.element.find('[data-role=current-year]').click();
      expect(cal.element.find('[data-role=date-column]').is(':visible')).to.not.be.ok();
      expect(cal.element.find('[data-role=year-column]').is(':visible')).to.be.ok();

      // switch back
      cal.element.find('[data-role=current-year]').click();
      expect(cal.element.find('[data-role=date-column]').is(':visible')).to.be.ok();

      cal.element.remove();
      cal.destroy();
    });

    it('can switch to prev year', function() {
      cal = new Calendar({focus: '2012-12-25'});
      cal.render();
      cal.element.find('[data-role=prev-year]').click();
      expect(cal.element.find('.ui-calendar-date-column td').eq(0).data('value')).to.be.equal('2011-11-27');
      cal.element.remove();
      cal.destroy();
    });

    it('can switch to next year', function() {
      cal = new Calendar({focus: '2012-12-25'});
      cal.render();
      cal.element.find('[data-role=next-year]').click();
      expect(cal.element.find('.ui-calendar-date-column td').eq(0).data('value')).to.be.equal('2013-12-01');
      cal.element.remove();
      cal.destroy();
    });

    it('can switch to prev month', function() {
      cal = new Calendar({focus: '2012-12-25'});
      cal.render();
      cal.element.find('[data-role=prev-month]').click();
      expect(cal.element.find('td').eq(0).data('value')).to.be.equal('2012-10-28');
      cal.element.remove();
      cal.destroy();
    });

    it('can switch to next year', function() {
      cal = new Calendar({focus: '2012-12-25'});
      cal.render();
      cal.element.find('[data-role=next-month]').click();
      expect(cal.element.find('td').eq(0).data('value')).to.be.equal('2012-12-30');
      cal.element.remove();
      cal.destroy();
    });

    it('can select a date', function(done) {
      cal = new Calendar({focus: '2012-12-25'});
      cal.render();
      cal.dates.on('select', function(value, el) {
        expect(el.data('value')).to.equal('2012-12-25');
        cal.element.remove();
        cal.destroy();
        done();
      });
      cal.element.find('[data-value=2012-12-25]').click();
    });

    it('can select a month', function(done) {
      cal = new Calendar({focus: '2012-12-25'});
      cal.render();
      cal.months.on('select', function(value, el) {
        expect(el.data('value')).to.eql(4);
        cal.element.remove();
        cal.destroy();
        done();
      });
      cal.element.find('[data-role=month-column] [data-value=4]').click();
    });

    it('can select a year', function(done) {
      cal = new Calendar({focus: '2012-12-25'});
      cal.render();
      cal.years.on('select', function(value, el) {
        expect(el.data('value')).to.eql(2012);
        cal.element.remove();
        cal.destroy();
        done();
      });
      cal.element.find('[data-value=2012]').click();
    });

    it('should disable on 2012-12-25', function() {
      cal = new Calendar({focus: '2012-12-26', range: ['2012-12-26']});
      expect(cal.element.find('[data-value=2012-12-25]').hasClass('disabled-element')).to.be.ok();
      expect(cal.element.find('[data-value=2012-12-28]').hasClass('disabled-element')).to.not.be.ok();
      cal.destroy();

      cal = new Calendar({focus: '2012-12-26', range: ['2012-12-26', '2012-12-28']});
      expect(cal.element.find('[data-value=2012-12-25]').hasClass('disabled-element')).to.be.ok();
      expect(cal.element.find('[data-value=2012-12-28]').hasClass('disabled-element')).to.not.be.ok();
      cal.destroy();

      cal = new Calendar({focus: '2012-12-24', range: [null, '2012-12-24']});
      expect(cal.element.find('[data-value=2012-12-25]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();
    });

    it('can be triggered', function() {
      var input = $('<input>');
      input.appendTo('body');
      cal = new Calendar({trigger: input});
      expect(cal.element.is(':visible')).to.not.be.ok();
      input.trigger('click');
      expect(cal.element.is(':visible')).to.be.ok();
      input.trigger('blur');
      expect(cal.element.is(':visible')).to.not.be.ok();
      cal.element.remove();
      input.remove();
      cal.destroy();
    });

    it('can hide when trigger is not input', function() {
      var input = $('<span>');
      var output = $('<span>');
      input.appendTo('body');
      output.appendTo('body');
      cal = new Calendar({trigger: input, output: output});
      expect(cal.element.is(':visible')).to.not.be.ok();

      input.trigger('click');
      expect(cal.element.is(':visible')).to.be.ok();

      cal.element.trigger('mousedown');
      expect(cal.element.is(':visible')).to.be.ok();

      output.trigger('mousedown');
      expect(cal.element.is(':visible')).to.not.be.ok();

      cal.element.remove();
      input.remove();
      output.remove();
      cal.destroy();
    });

    it('can be disabled', function() {
      var input = $('<input>');
      input.appendTo('body');
      cal = new Calendar({trigger: input});
      expect(cal.element.is(':visible')).to.not.be.ok();
      cal.disable();
      input.click();
      expect(cal.element.is(':visible')).to.not.be.ok();
      cal.enable();
      input.click();
      expect(cal.element.is(':visible')).to.be.ok();
      cal.element.remove();
      input.remove();
      cal.destroy();
    });

    it('can output to trigger', function(done) {
      var input = $('<input>');

      cal = new Calendar({trigger: input, focus: '2012-12-25'});
      cal.render();
      cal.element.find('[data-value=2012-12-25]').click();

      setTimeout(function() {
        expect(input.val()).to.equal('2012-12-25');
        cal.element.remove();
        cal.destroy();
        done();
      }, 1);
    });

    it('output is not input', function() {
      var span = $('<span>');
      cal = new Calendar({trigger: span, focus: '2012-12-25'});
      cal.render();
      cal.element.find('[data-value=2012-12-25]').click();
      cal.element.remove();
      cal.destroy();
    });

    it('can get time from output', function() {
      var input = $('<input>');
      input.val('2012-12-15');
      input.appendTo('body');
      cal = new Calendar({trigger: input});
      cal.show();
      expect(cal.element.find('.focused-element').data('value')).to.equal('2012-12-15');
      input.remove();
      cal.element.remove();
      cal.destroy();
    });

    it('can change input type', function() {
      var input = $('<input>');
      input.attr('type', 'date');
      cal = new Calendar({trigger: input});
      if (!isIE) {
        expect(input.attr('type')).to.equal('text');
      }
      cal.destroy();
    });

    it('can change range dynamically', function() {
      cal = new Calendar({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('[data-value=2012-08-15]').hasClass('disabled-element')).not.to.be.ok();
      cal.range(['2012-08-01', '2012-08-12']);
      expect(cal.element.find('[data-value=2012-08-15]').hasClass('disabled-element')).to.be.ok();
      expect(cal.element.find('[data-value=2012-08-10]').hasClass('disabled-element')).not.to.be.ok();
      cal.element.remove();
      cal.destroy();
    });

    it('can change language', function() {
      cal = new Calendar({
        lang: require('i18n/en')
      });
      cal.show();
      expect(cal.element.html().indexOf('Jun') >= 0).to.be.ok();
      cal.destroy();
    });

  });
});

