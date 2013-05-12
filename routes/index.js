
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

exports.knockoutNow = function(req, res) {
    var rightnow = new Date(),
        hr = rightnow.getHours(),
        dhr = 0, // separate variable to display because (24 hr clock)
        ap = '',
        min = rightnow.getMinutes() + 14; // Takes 14 minutes to go to sleep

    if (min > 60) {
        min -= 60;
        hr += 1;

        if (hr >= 24) {
            if (hr == 24) {
                hr = 0; // midnight, must adjust!
            } else if (hr == 25) {
                hr = 1;
            }
        }
    }

    // Let's do some math
    timeIndex = [];
    for (var ctr = 0; ctr < 6; ctr++) {
        // Object we're going to push
        item = {};

        if (min < 30) {
            min = min + 30;
        } else {
            min -= 30;
            hr += 1;
        }
        
        hr += 1;

        if (hr == 24) hr = 0;
        if (hr == 25) hr = 1;
        
        if (hr < 12) {
            ap = 'AM';
            dhr = hr;
            
            if (hr === 0)
                dhr = "12";
        }
        else {
            ap = 'PM';
            dhr = hr - 12;  
        }
        if (dhr === 0)
            dhr = 12;

        item.hour = hr;
        item.min = min;
        item.human_hr = dhr;
        item.ap = ap;

        // Convert Minute
        if (min > 9)
            item.human_min = String(min);
        else
            item.human_min = '0' + min;

        if (ctr == 4 || ctr == 5)
            item.color = '#00CC33';
        else if (ctr == 3)
            item.color = '#99CC66';
        else
            item.color = '#666666';

        timeIndex[ctr] = item;
    }

    // Launch it out!
    res.render('knockout', {
        hr: hr,
        min: min,
        ap: ap,
        timeIndex: timeIndex
    });
};