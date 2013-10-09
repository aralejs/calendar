define(function(require) {
  var expect = require('expect');
  var sinon = require('sinon');
  var DateColumn = require('calendar').DateColumn;
  var moment = require('moment');
  var cal;

  describe('Date Column', function() {
    it('can initialize without options', function() {
      cal = new DateColumn();
    });

    it('will not focus when render', function() {
      cal = new DateColumn({focus: '2012-08-11'});
      cal.render();
      expect(cal.element.find('.focused-element')).to.be.empty();
      cal.element.remove();
      cal.destroy();
    });

    it('can focus on 2012-08-11', function() {
      cal = new DateColumn({focus: '2012-08-11'});
      cal.focus();
      var element = cal.element.find('.focused-element');
      expect(element.text()).to.equal('11');
      expect(element.data('value')).to.equal('2012-08-11');
      cal.destroy();
    });

    it('should focus on 2012-08-11 when show', function() {
      cal = new DateColumn({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').data('value')).to.equal('2012-08-11');
      cal.element.remove();
      cal.destroy();
    });

    it('focus on 11, then focus on 10', function() {
      cal = new DateColumn({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('11');
      cal.prev();
      expect(cal.element.find('.focused-element').text()).to.equal('10');
      cal.element.remove();
      cal.destroy();
    });

    it('focus on 11 , then focus on 12', function() {
      cal = new DateColumn({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('11');
      cal.next();
      expect(cal.element.find('.focused-element').text()).to.equal('12');
      cal.element.remove();
      cal.destroy();
    });

    it('focus on 11, then focus on 2', function() {
      cal = new DateColumn({focus: '2012-08-11'});
      cal.show();
      expect(cal.element.find('.focused-element').text()).to.equal('11');
      cal.select('2012-12-02');
      expect(cal.element.find('.focused-element').text()).to.equal('2');
      cal.element.remove();
      cal.destroy();
    });

    it('can click on 2012-11-25', function() {
      cal = new DateColumn({focus: '2012-12-11'});
      sinon.spy(cal, 'select');

      cal.show();

      cal.element.find('.ui-calendar-date-column td').eq(0).click();
      expect(cal.select.calledOnce).to.be.ok();

      cal.element.find('.ui-calendar-date-column td').eq(0).click();
      expect(cal.select.calledTwice).to.be.ok();

      cal.element.remove();
      cal.destroy();
    });

    it('should disable on 2012-12-25', function() {
      cal = new DateColumn({focus: '2012-12-26', range: ['2012-12-26']});
      expect(cal.element.find('[data-value=2012-12-25]').hasClass('disabled-element')).to.be.ok();
      expect(cal.element.find('[data-value=2012-12-28]').hasClass('disabled-element')).to.not.be.ok();
      cal.destroy();

      cal = new DateColumn({focus: '2012-12-26', range: ['2012-12-26', '2012-12-28']});
      expect(cal.inRange('2012-12-25')).not.to.be.ok();
      expect(cal.element.find('[data-value=2012-12-25]').hasClass('disabled-element')).to.be.ok();
      expect(cal.element.find('[data-value=2012-12-28]').hasClass('disabled-element')).to.not.be.ok();
      cal.destroy();

      cal = new DateColumn({focus: '2012-12-24', range: [null, '2012-12-24']});
      expect(cal.element.find('[data-value=2012-12-25]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();
    });

    it('trigger selectDisable event', function(done) {
      cal = new DateColumn({focus: '2012-12-26', range: ['2012-12-26']});
      cal.on('selectDisable', function() {
        done();
      });
      cal.element.find('[data-value=2012-12-25]').click();
      cal.destroy();
    });

    it('should not disable on 2012-12-25', function() {
      cal = new DateColumn({
        focus: '2012-12-21',
        range: 'hello'
      });
      expect(cal.element.find('[data-value=2012-12-25]').hasClass('disabled-element')).to.not.be.ok();
      cal.destroy();
    });

    it('range can be a function', function() {
      cal = new DateColumn({
        focus: '2012-12-21',
        range: function(d) {
          return d.date() < 21;
        }
      });
      expect(cal.element.find('[data-value=2012-12-25]').hasClass('disabled-element')).to.be.ok();
      cal.destroy();
    });

    it('can start week at Friday', function() {
      cal = new DateColumn({focus: '2012-12-21', startDay: 'Friday'});
      expect(cal.element.find('th').eq(0).text()).to.be('Fr');
      cal.destroy();

      cal = new DateColumn({focus: '2012-12-21', startDay: 5});
      expect(cal.element.find('th').eq(0).text()).to.be('Fr');
      cal.destroy();
    });

    it('can change the className', function() {
      cal = new DateColumn({
        focus: '2012-08-11',
        process: function(item) {
          if (item.value === '2012-08-11') {
            item.className += ' foo';
          }
          return item;
        }
      });
      cal.focus();
      var element = cal.element.find('.focused-element');
      expect(element.hasClass('foo')).to.be.ok();
      expect(cal.element.find('.foo')).to.have.length(1);
      cal.destroy();
    });

  });
});
