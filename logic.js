/**
 * The Logic Behind the System
 *
 * @author Sean Fisher <hi+github@seanfisher.co>
 */

module.exports = {
    knockoutTimes: function() {
        var rightnow = new Date(),
            hr = rightnow.getHours(),
            dhr = 0, // separate variable to display because (24 hr clock)
            ap = '',
            min = rightnow.getMinutes() + 14; // Takes 14 minutes to go to sleep

        if (min > 60) {
            min += -60;
            hr += 1;

            if (hr >= 24) 
                hr += -24;
        }

        // Let's do some math
        timeIndex = [];
        for (var ctr = 0; ctr < 6; ctr++) {
            if (ctr == 0) {
                var running_hour = hr,
                    running_min = min,
                    running_ampm = 'am',
                    hour_count = 3;

                // Add three hours to skip one cycle
                running_hour += 3;

            } else {
                // Increase it by 1.5 hours
                running_hour += 1;
                running_min += 30;

                hour_count += 1.5;
            }

            // Clean up the times
            if (running_hour > 23)
                running_hour += -24;

            if (running_min > 59)
                running_min += -60;

            if (running_hour >= 12)
                running_ampm = 'pm';
            else
                running_ampm = 'am';

            item = {};
            item.hr = item.human_hr = running_hour;

            if (running_hour > 12)
                item.human_hr += -12;
            else if (running_hour == 0)
                item.human_hr = 12;

            item.human_hr = String(item.human_hr);
            item.min = running_min;

            if (running_min > 9)
                item.human_min = String(running_min);
            else
                item.human_min = '0' + running_min;

            item.am_pm = running_ampm.toUpperCase();
            item.hours = hour_count;

            timeIndex[ctr] = item;
        }

        return timeIndex;
    },

    /**
     * Calculate logic for specific times
     */
    specificTimes: function(ampm, hr, min) {
        // Sanitize
        if (min > 59) min = 0;
        if (hr > 23) hr = 0;

        if (ampm !== 'am' && ampm !== 'pm') ampm = 'am';
        
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
            else if (running_hour == 0)
                item.human_hr = 12;

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

        return timeIndex;
    }
}