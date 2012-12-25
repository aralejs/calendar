define(function(require) {
  var MonthCalendar = require('../src/month-calendar');
  var moment = require('moment');
  var cal;

  describe('Month Calendar', function() {
    it('can initialize without options', function() {
      cal = new MonthCalendar();
    });

    it('will not focus when render', function() {
      cal = new MonthCalendar({focus: '2012-08-11'});
      cal.render();
      expect(cal.element.find('.focused-element')).to.be.empty();
      cal.element.remove();
      cal.destroy();
    });

    it('can focus on Aug', function() {
      cal = new MonthCalendar({focus: '2012-08-11'});
      cal.focus();
      expect(cal.element.find('.focused-element').text()).to.equal('Aug');
      cal.destroy();
    });

    it('should focus on Aug when show', function() {
      cal = new MonthCalendar({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('Aug');
      cal.element.remove();
      cal.destroy();
    });

    it('focus on Aug, then focus on Jul', function() {
      cal = new MonthCalendar({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('Aug');
      cal.prev();
      expect(cal.element.find('.focused-element').text()).to.equal('Jul');
      cal.element.remove();
      cal.destroy();
    });

    it('focus on Aug, then focus on Sep', function() {
      cal = new MonthCalendar({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('Aug');
      cal.next();
      expect(cal.element.find('.focused-element').text()).to.equal('Sep');
      cal.element.remove();
      cal.destroy();
    });

    it('focus on Aug, then focus on Jan', function() {
      cal = new MonthCalendar({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('Aug');
      cal.select(0);
      expect(cal.element.find('.focused-element').text()).to.equal('Jan');
      cal.element.remove();
      cal.destroy();
    });

    it('can click on Jan', function() {
      cal = new MonthCalendar({focus: '2012-08-11'});
      var spy = sinon.spy(cal, 'select');
      cal.show();
      cal.element.find('li').eq(0).click();
      expect(cal.select.calledOnce);
      cal.element.find('li').eq(0).click();
      expect(cal.select.calledTwice);
      cal.element.remove();
      cal.destroy();
    });

    it('should disable on May', function() {
      cal = new MonthCalendar({focus: '2012-08-11', range: [6]});
      expect(cal.element.find('[data-value=4]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();

      cal = new MonthCalendar({focus: '2012-08-11', range: [6, 8]});
      expect(cal.element.find('[data-value=4]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();

      cal = new MonthCalendar({focus: '2012-08-11', range: [null, 2]});
      expect(cal.element.find('[data-value=4]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();

      cal = new MonthCalendar({
        focus: '2012-08-11',
        range: function(value) {
          return value !== 4;
        }
      });
      expect(cal.element.find('[data-value=4]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();
    });

    it('should not disable on May', function() {
      cal = new MonthCalendar({
        focus: '2012-08-11',
        range: 'hello'
      });
      expect(cal.element.find('[data-value=4]').hasClass('disabled-element')).to.not.be.ok();
      cal.destroy();
    });
  });
});
