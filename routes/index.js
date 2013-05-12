
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

exports.viewSpecificInternal = function(req, res) {
    var ampm = req.params.am_pm.toLowerCase(),
        hr = parseInt(req.params.hour),
        min = parseInt(req.params.minute),
        orig = [hr, min, ampm];
    
    // Sanitize
    if (min > 59) min = 0;
    if (hr > 23) hr = 0;

    if (ampm !== 'am' && ampm !== 'pm') ampm = 'am';
    console.log(hr + ' ' + min + ' ' + ampm);
    
    // Array we're passing to a view
    timeIndex = [];

    // Count the hours of sleep they'll get
    hour_count = 9;

    for (var c = 0; c < 4; c++ ) {
        if (c == 0) {
            var running_hour = hr - 9;

            if (running_hour < 0)
                running_hour = 24 + running_hour;

            running_min = min;

            if (running_hour >= 12)
                running_ampm = 'pm';
            else
                running_ampm = 'am';
        } else {
            // Increase it by 1.5 hours
            running_hour += 1;
            running_min += 30;

            if (running_hour > 23)
                running_hour += -24;

            if (running_min > 59)
                running_min += -60;

            if (running_hour >= 12)
                running_ampm = 'pm';
            else
                running_ampm = 'am';
        }

        item = {};
        item.hr = item.human_hr = running_hour;

        if (running_hour > 12)
            item.human_hr += -12;

        item.human_hr = String(item.human_hr);
        item.min = running_min;

        if (running_min > 9)
            item.human_min = String(running_min);
        else
            item.human_min = '0' + running_min;

        item.am_pm = running_ampm.toUpperCase();

        item.hours = hour_count;

        timeIndex[c] = item;

        // Lower the hour count
        hour_count -= 1.5;
    }

    res.render('view_specific_ajax', {
        timeIndex: timeIndex
    });
};