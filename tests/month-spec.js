define(function(require) {
  var expect = require('expect');
  var MonthColumn = require('calendar').MonthColumn;
  var moment = require('moment');
  var cal;

  describe('Month Column', function() {
    it('can initialize without options', function() {
      cal = new MonthColumn();
    });

    it('will not focus when render', function() {
      cal = new MonthColumn({focus: '2012-08-11'});
      cal.render();
      expect(cal.element.find('.focused-element')).to.be.empty();
      cal.element.remove();
      cal.destroy();
    });

    it('can focus on Aug', function() {
      cal = new MonthColumn({focus: '2012-08-11'});
      cal.focus();
      expect(cal.element.find('.focused-element').text()).to.equal('Aug');
      cal.destroy();
    });

    it('can delete is inrange', function() {
      cal = new MonthColumn({
        focus: '2012-08-11',
        range: function(date) {
          return date.month() > 2;
        }
      });
      expect(cal.inRange(moment('2012-01-02'))).not.to.be.ok();
      expect(cal.inRange('2012-06-02')).to.be.ok();
    });

    it('should focus on Aug when show', function() {
      cal = new MonthColumn({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('Aug');
      cal.element.remove();
      cal.destroy();
    });

    it('focus on Aug, then focus on Jul', function() {
      cal = new MonthColumn({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('Aug');
      cal.prev();
      expect(cal.element.find('.focused-element').text()).to.equal('Jul');
      cal.element.remove();
      cal.destroy();
    });

    it('focus on Aug, then focus on Sep', function() {
      cal = new MonthColumn({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('Aug');
      cal.next();
      expect(cal.element.find('.focused-element').text()).to.equal('Sep');
      cal.element.remove();
      cal.destroy();
    });

    it('focus on Aug, then focus on Jan', function() {
      cal = new MonthColumn({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('Aug');
      cal.select(0);
      expect(cal.element.find('.focused-element').text()).to.equal('Jan');
      cal.element.remove();
      cal.destroy();
    });

    it('can click on Jan', function() {
      cal = new MonthColumn({focus: '2012-08-11'});
      var spy = sinon.spy(cal, 'select');
      cal.show();
      cal.element.find('td').eq(0).click();
      expect(cal.select.calledOnce);
      cal.element.find('td').eq(0).click();
      expect(cal.select.calledTwice);
      cal.element.remove();
      cal.destroy();
    });

    it('should disable on May', function() {
      cal = new MonthColumn({focus: '2012-08-11', range: [6]});
      expect(cal.element.find('[data-value=4]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();

      cal = new MonthColumn({focus: '2012-08-11', range: [6, 8]});
      expect(cal.inRange(5)).not.to.be.ok();
      expect(cal.element.find('[data-value=4]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();

      cal = new MonthColumn({focus: '2012-08-11', range: [null, 2]});
      expect(cal.element.find('[data-value=4]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();
    });

    it('trigger selectDisable', function(done) {
      cal = new MonthColumn({focus: '2012-08-11', range: [6]});
      cal.on('selectDisable', function() {
        done();
      });
      cal.element.find('[data-value=4]').click();
      cal.destroy();
    });

    it('should not disable on May', function() {
      cal = new MonthColumn({
        focus: '2012-08-11',
        range: 'hello'
      });
      expect(cal.element.find('[data-value=4]').hasClass('disabled-element')).to.not.be.ok();
      cal.destroy();
    });

    it('can change the label', function() {
      cal = new MonthColumn({
        focus: '2012-08-11',
        process: function(item) {
          if (item.value === 1) {
            item.label = 'foo';
          }
          return item;
        }
      });
      expect(cal.element.find('[data-value=1]').text()).to.equal('foo');
      cal.destroy();
    });
  });

});
