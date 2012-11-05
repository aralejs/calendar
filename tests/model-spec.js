define(function(require) {
    var CalendarModel = require('../src/model');
    var moment = require('moment');
    var now = moment();
    var defaults = {
        lang: null,
        focus: now,
        range: null,
        showTime: true,
        startDay: 'Sun'
    };

    var config;
    var model;

    describe('CalendarModel', function() {
    });
});
