/**
 * Sleepyti.me
 *
 * @author David Shaw <dshaw dot jobs at gmail dot com>
 *
 * Forked by Sean Fisher <hi@seanfisher.co>
 */
window.Sleepy = (function()
{
    "use strict";

    $(document).ready(function() { Sleepy.load(); });

    return {
        load: function()
        {
            // Show some stuff
            $("#title").show();
            $('#dropdown-hours').show();

            // Setuo bindings
            this.bind();

            // Show the stuff
            $('.prompt').show();
        },

        /**
         * Bind the application
         */
        bind: function()
        {
            /**
             * Calls on /json/now to get the HTML for now
             */
            $("#sleepnow").click(function(e) {
                $.get('/json/now', function(data)
                {
                    $('#result-text').html(data);

                    // Hide Prompts show the stuff
                    $('.prompt').hide();
                    $('#result-text').fadeIn();
                    $('#bit').show(250);

                    Sleepy.setupURL('now');
                }, 'html');
            });
            
            /**
             * Clicks calculate button, refers to on screen calcuate function
             */
            $('#wake-up-calculate').click(function () {
                if ($("#hour").val() == '(hour)' || $("#minute").val() == '(minute)')
                    return false;

                Sleepy.setupURL('specific');
                Sleepy.calculateOnscreen();
            });

            /**
             * user changes the list, so we calculate times
             */
            $('#dropdown-hours select').change(function () {
                if ($("#hour").val() == '(hour)' || $("#minute").val() == '(minute)')
                    return false;

                Sleepy.setupURL('specific');
                Sleepy.calculateOnscreen();
            });
        },

        /*
         * calculates an hour and a half back
         *
         * @param int
         * @param int
         * @param int
         */
        sleepback: function(hr, min, an) {
            var rmin = 0;
            var rhr = 0;
            var a = an;
            if (min < 30) {
                rmin = (min * 1) + (30 * 1);
                rhr = hr - 2;
            }
            else if (min >= 30) {
                rmin = min - 30;
                rhr = hr - 1;
            }

            if (rhr < 1) {
                rhr = 12 + rhr;

                if (a == "AM")
                    a = "PM";
                else
                    a = "AM";
            }

            var r = [rhr, rmin, a];
            return r;
        },

        /**
         * Calculate their wake up time from the options on the screen
         * Internally called function
         */
        calculateOnscreen: function() {
            $('.prompt').hide();

            var ampm = $("#ampm").val();    
            var hr = $("#hour").val();
            var min = $("#minute").val();
            var orig = [hr, min, ampm];
            
            if (hr == 12) {
                if (ampm == "AM")
                    ampm = "PM";
                else
                    ampm = "AM";
            }
            
            var txt = '<p>You should try to <strong>fall asleep</strong> at one of the following times:</p><p>';
            txt += '<h2><font color="#666666">';

            var first = true;
            var times = new Array();
            
            for (var c = 1; c <= 10; c++) {
                var back = Sleepy.sleepback(hr, min, ampm);

                var nhr = back[0];
                var nmin = back[1];
                ampm = back[2];
                var ampmt = "";
                ampmt = back[2];
                
                // countdown from 12, but that's not
                // how am/pm system works... whoops!
                if (nhr == 12) {
                    if (ampm == "AM")
                        ampmt = "PM";
                    else
                        ampmt = "AM";
                }

                // TODO: reverse display order
                if (c >= 3 && c <= 6) {
                    var temp = '';

                    if (nmin > 9) {
                        if (c == 6) {
                            temp = '<font color="#01DF74" size="7">' + nhr + ':' + nmin + ' ' + ampmt + '</font>';
                            times.push(temp);
                        }
                        else {
                            temp = ' <i>or</i> ' + '<font color="#01DF74" size="7">' + nhr + ':' + nmin + ' ' + ampmt + '</font>';
                            times.push(temp);
                        }
                    } else { // insert 0
                        if (c == 6) {
                            temp = '<font color="#01DF74" size="7">' + nhr + ':0' + nmin + ' ' + ampmt + '</font>';
                            times.push(temp);
                        } else {
                            temp = ' <i>or</i> ' + '<font color="#01DF74" size="7">' + nhr + ':0' + nmin + ' ' + ampmt + '</font>';
                            times.push(temp);
                        }
                    }
                }

                hr = nhr;
                min = nmin;
            }

            for (var i = 3; i >= 0; i--)
                txt += times[i];
            
            txt += '</font></h2>'; 
            
            txt += '<p>Please keep in mind that you should be <i>falling asleep</i> at these times.</p>';
            txt += '<p>The average adult human takes <strong>fourteen minutes</strong> to fall asleep, so plan accordingly!</p>';
            txt += '<p>sleepyti.me works by counting backwards in <strong>sleep cycles</strong>. Sleep cycles typically last <strong>90 minutes</strong>.</p>';
            txt += '<p>Waking up in the middle of a sleep cycle leaves you feeling tired and groggy, but waking up <em>in between</em> cycles lets you wake up feeling refreshed and alert!</p>';
            txt += '<p><a href="/">Go back to the home page</a>.</p>';
            $('#result-text').html(txt).fadeIn()
            
            var wtime = "";

            if (orig[1] > 9)
                wtime = '<b>' + orig[0] + ':' + orig[1] + ' ' + orig[2] + '</b>';   
            else 
                wtime = '<b>' + orig[0] + ':0' + orig[1] + ' ' + orig[2] + '</b>';

            $('.waketime').html(wtime)
                .fadeIn(2000);
        },

        /**
         * View a specific linkable time
         */
        viewSpecific: function(hour, minute, am_pm) {
            am_pm = am_pm.toUpperCase();

            $("#hour").val(hour);
            $("#minute").val(minute);
            $('#ampm').val(am_pm);

            Sleepy.calculateOnscreen();
        },

        /**
         * Use pushState to save the URL
         */
        setupURL: function(which) {
            if(! history.pushState) return;
            
            if (which == 'specific')
            {
                var am_pm = $("#ampm").val().toLowerCase(),
                    hour = $("#hour").val(),
                    minute = $("#minute").val();

                history.pushState({}, document.title, "/at/"+hour+"/"+minute+"/"+am_pm);
            } else if (which == 'now') {
                history.pushState({}, "If You Go to Sleep Right Now... - " + document.title, "/now");
            }
        }
    }
})();