define(function(require) {
  var expect = require('expect');
  var YearColumn = require('year-column');
  var moment = require('moment');
  var cal;

  describe('Year Column', function() {
    it('can initialize without options', function() {
      cal = new YearColumn();
    });

    it('will not focus when render', function() {
      cal = new YearColumn({focus: '2012-08-11'});
      cal.render();
      expect(cal.element.find('.focused-element')).to.be.empty();
      cal.element.remove();
      cal.destroy();
    });

    it('can focus on 2012', function() {
      cal = new YearColumn({focus: '2012-08-11'});
      cal.focus();
      expect(cal.element.find('.focused-element').text()).to.equal('2012');
      cal.destroy();
    });

    it('should focus on 2012 when show', function() {
      cal = new YearColumn({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('2012');
      cal.element.remove();
      cal.destroy();
    });

    it('focus on 2012, then focus on 2011', function() {
      cal = new YearColumn({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('2012');
      cal.prev();
      expect(cal.element.find('.focused-element').text()).to.equal('2011');
      cal.element.remove();
      cal.destroy();
    });

    it('focus on 2012, then focus on 2013', function() {
      cal = new YearColumn({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('2012');
      cal.next();
      expect(cal.element.find('.focused-element').text()).to.equal('2013');
      cal.element.remove();
      cal.destroy();
    });

    it('focus on 2012, then focus on 1989', function() {
      cal = new YearColumn({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('2012');
      cal.select(1989);
      expect(cal.element.find('.focused-element').text()).to.equal('1989');
      cal.element.remove();
      cal.destroy();
    });

    it('can click on 2006', function() {
      cal = new YearColumn({focus: '2012-08-11'});
      var spy = sinon.spy(cal, 'select');
      cal.show();
      cal.element.find('td').eq(1).click();
      expect(cal.select.calledOnce);
      cal.element.find('td').eq(1).click();
      expect(cal.select.calledTwice);
      cal.element.remove();
      cal.destroy();
    });

    it('should disable on 2011', function() {
      cal = new YearColumn({focus: '2012-08-11', range: [2012]});
      expect(cal.element.find('[data-value=2011]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();

      cal = new YearColumn({focus: '2012-08-11', range: [2012, 2014]});
      expect(cal.element.find('[data-value=2011]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();

      cal = new YearColumn({focus: '2012-08-11', range: [null, 2000]});
      expect(cal.element.find('[data-value=2011]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();

      cal = new YearColumn({
        focus: '2012-08-11',
        range: function(value) {
          return value !== 2011;
        }
      });
      expect(cal.element.find('[data-value=2011]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();
    });

    it('trigger selectDisable', function(done) {
      cal = new YearColumn({focus: '2012-08-11', range: [2012]});
      cal.on('selectDisable', function() {
        done();
      });
      cal.element.find('[data-value=2011]').click();
      cal.destroy();
    });

    it('should not disable on 2011', function() {
      cal = new YearColumn({
        focus: '2012-08-11',
        range: 'hello'
      });
      expect(cal.element.find('[data-value=2011]').hasClass('disabled-element')).to.not.be.ok();
      cal.destroy();
    });

    it('can change the label', function() {
      cal = new YearColumn({
        focus: '2012-08-11',
        process: function(item) {
          if (item.value === 2012) {
            item.label = 'foo';
          }
          return item;
        }
      });
      expect(cal.element.find('[data-value=2012]').text()).to.equal('foo');
      cal.destroy();
    });
  });
});
