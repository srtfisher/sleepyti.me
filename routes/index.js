
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'sleepytime responsive by srtfisher' });
};

exports.viewSpecific = function(req, res) {
    var ampm = req.params.am_pm.toLowerCase(),
        hr = parseInt(req.params.hour),
        min = parseInt(req.params.minute);
    
    logic = require('../logic');
    timeIndex = logic.specificTimes(ampm, hr, min);
    
    res.render('view_specific', {
        timeIndex: timeIndex,
        title: 'sleepytime responsive by srtfisher'
    });
};

exports.viewNow = function(req, res) {
    res.render('now', {
        title: 'sleepytime responsive by srtfisher',
    });
};

exports.viewNowTiny = function(req, res) {
    res.render('knockout', {
        title: 'sleepytime responsive by srtfisher',
    });
};

// The callback for logic to see when they should fall asleep
// Client has passed us the current date/time
exports.knockoutNow = function(req, res) {
    var hr = parseInt(req.params.hour),
        min = parseInt(req.params.minute);

    logic = require('../logic');
    timeIndex = logic.knockoutTimes(hr, min);

    // Launch it out!
    res.render('knockout_callback', {
        timeIndex: timeIndex
    });
};

exports.viewSpecificInternal = function(req, res) {
    var ampm = req.params.am_pm.toLowerCase(),
        hr = parseInt(req.params.hour),
        min = parseInt(req.params.minute),
        orig = [hr, min, ampm];
    
    logic = require('../logic');
    timeIndex = logic.specificTimes(ampm, hr, min);

    res.render('view_specific_ajax', {
        timeIndex: timeIndex
    });
};