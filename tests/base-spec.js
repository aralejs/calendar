define(function(require) {
  var expect = require('expect');
  var BaseColumn = require('calendar').BaseColumn;
  var moment = require('moment');
  var cal;

  describe('Base Column', function() {
    it('can initialize without options', function() {
      cal = new BaseColumn();
    });

    it('set no focus', function() {
      cal = new BaseColumn();
      cal.set('focus');
      expect(cal.get('focus').format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'));
    });
  });
});

