define(function(require) {
  var expect = require('expect');
  var sinon = require('sinon');
  var Calendar = require('calendar');
  var moment = require('moment');
  var cal;

  describe('Calendar', function() {
    it('can initialize without options', function() {
      cal = new Calendar();
      expect(cal.element.find('table').length > 2).to.be.ok();
      cal.destroy();
    });

    it('should focus on 2012-08-11 when show', function() {
      cal = new Calendar({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').data('value')).to.equal('2012-08-11');
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
      expect(cal.element.find('td').eq(0).data('value')).to.be.equal('2011-11-27');
      cal.element.remove();
      cal.destroy();
    });

    it('can switch to next year', function() {
      cal = new Calendar({focus: '2012-12-25'});
      cal.render();
      cal.element.find('[data-role=next-year]').click();
      expect(cal.element.find('td').eq(0).data('value')).to.be.equal('2013-12-01');
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

  });
});

