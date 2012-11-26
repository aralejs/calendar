define(function(require) {
  var Model = require('../src/model');
  var moment = require('moment');

  var m;

  describe('Model Year', function() {
    it('should be 2012', function() {
      m = new Model({focus: '2012-12-12'});
      expect(m.get('year').current.value).to.equal(2012);
    });
    it('should be 4x3 columns', function() {
      expect(m.get('year').items.length).to.equal(4);
      expect(m.get('year').items[0].length).to.equal(3);
    });
    it('2012 should be at 3x2 position', function() {
      m = new Model({focus: '2012-12-12'});
      var year = m.get('year').items[2][1];
      expect(year.value).to.equal(2012);
    });
    it('should change to 2013', function() {
      m = new Model({focus: '2012-12-12'});
      m.changeYear(1);
      var year = m.get('year').items[2][1];
      expect(year.value).to.equal(2013);
      expect(m.activeTime.format('YYYY-MM-DD')).to.equal('2013-12-12');
    });
    it('should change to 2011', function() {
      m = new Model({focus: '2013-12-12'});
      m.changeYear(-2);
      var year = m.get('year').items[2][1];
      expect(year.value).to.equal(2011);
      expect(m.activeTime.format('YYYY-MM-DD')).to.equal('2011-12-12');
    });
  });

  describe('Model Month', function() {
    it('should be December', function() {
      m = new Model({focus: '2012-12-12'});
      expect(m.get('month').current.value).to.equal(11);
    });

    it('should be 4x3 columns', function() {
      m = new Model({focus: '2012-12-12'});
      expect(m.get('month').items.length).to.equal(4);
      expect(m.get('month').items[0].length).to.equal(3);
    });

    it('should change to November', function() {
      m = new Model({focus: '2012-12-12'});
      m.changeMonth(-1);
      expect(m.get('month').current.value).to.equal(10);
    });
  });

  describe('Model Day', function() {
    it('Sun should be 0', function() {
      m = new Model({startDay: 'Sun'});
      expect(m.get('day').current.value).to.equal(0);
    });

    it('Sunday should be 0', function() {
      m = new Model({startDay: 'Sunday'});
      expect(m.get('day').current.value).to.equal(0);
    });

    it('0 should be 0', function() {
      m = new Model({startDay: '0'});
      expect(m.get('day').current.value).to.equal(0);
    });

    it('should start on Tuesday and end on Monday', function() {
      m = new Model({startDay: 'Tue'});
      expect(m.get('day').items[0].value).to.equal(2);
      expect(m.get('day').items[0].label).to.equal('Tu');
      expect(m.get('day').items[6].value).to.equal(1);
      expect(m.get('day').items[6].label).to.equal('Mo');
    });
  });

  describe('Model Date', function() {
    it('should be 2012-12-12', function() {
      m = new Model({focus: '2012-12-12'});
      expect(m.get('date').current.label).to.equal(12);
      expect(m.get('date').current.value).to.equal('2012-12-12');
    });

    it('should be 6x7 columns', function() {
      m = new Model({focus: '2012-12-12'});
      expect(m.get('date').items.length).to.equal(6);
      expect(m.get('date').items[0].length).to.equal(7);
    });

    it('when day of the week is Saturday, it should be 5x7 columns', function() {
      m = new Model({focus: '2012-12-12', startDay: 'Saturday'});
      expect(m.get('date').items.length).to.equal(5);
      expect(m.get('date').items[0].length).to.equal(7);
    });

    it('should be 5x7 columns', function() {
      m = new Model({focus: '2012-11-12'});
      expect(m.get('date').items.length).to.equal(5);
      expect(m.get('date').items[0].length).to.equal(7);
    });

    it('should change to 2012-12-25', function() {
      m = new Model({focus: '2012-12-12'});
      m.changeDate(13);
      expect(m.get('date').current.label).to.equal(25);
      expect(m.get('date').current.value).to.equal('2012-12-25');
    });

    it('should change to 2013-01-01', function() {
      m = new Model({focus: '2012-12-12'});
      m.changeDate(20);
      expect(m.get('date').current.value).to.equal('2013-01-01');
    });

    it('should be at 3x4 point', function() {
      m = new Model({focus: '2012-12-12'});
      var today = m.get('date').items[2][3];
      expect(today.value).to.equal('2012-12-12');
      expect(today.label).to.equal(12);
      expect(today.day).to.equal(3);
      expect(today.className).to.equal('current-month');
    });

    it('should not be available', function() {
      m = new Model({focus: '2012-12-12', range: ['2012-12-10', null]});
      expect(m.get('date').items[2][0].available).to.not.be.ok();

      m.range(['2012-11-10', null]);
      expect(m.get('date').items[2][0].available).to.be.ok();
    });
  });
});
