
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'sleepytime responsive by srtfisher' });
};

exports.viewSpecific = function(req, res) {
    var hour = req.params.hour,
        minute = req.params.minute,
        am_pm = req.params.am_pm;

    res.render('view_specific', {
        title: 'sleepytime responsive by srtfisher',
        hour: hour,
        minute: minute,
        am_pm: am_pm
    })
};

exports.viewNow = function(req, res) {
    res.render('now', {
        title: 'sleepytime responsive by srtfisher',
    });
};