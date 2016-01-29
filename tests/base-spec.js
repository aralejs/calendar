var expect = require('spm-expect.js');
var BaseColumn = require('../index').BaseColumn;
var moment = require('spm-moment');
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
