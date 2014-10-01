/**
 * Name: calendar-engine
 * Version: 0.1.0-beta
 * Description: A calendar engine to handle the date.
 * Author: Alex Chao <alexchao1990@gmail.com>
 * License: MIT
 */
;(function(win, undefined){

    var Util = {
        // Get the number of days in a month in a specified date
        daysInMonth: function(year, month) {
            return new Date(year, month, 0).getDate();
        },
        // Adjust the year and month
        adjustDate: function(year, month) {
            if (typeof year !== 'number' || typeof month !== 'number') {
                throw new Error('year and month must be integer');
            }
            return {
                year: year + Math.floor((month - 1) / 12),
                month: month > 0 ? +!(month % 12) * 12 + month % 12 : 12 + month % 12
            };
        }
    };

    // Represent a day in a month which consists of a few properties
    function Day(opts) {
        var date = Util.adjustDate(opts.year, opts.month);
        this.year = date.year;
        this.month = date.month;
        this.value = opts.value;
        this.isPrevMonth = opts.isPrevMonth;
        this.isNextMonth = opts.isNextMonth;
        this.isNow = opts.isNow;
        this.week = new Date(date.year, date.month - 1, opts.value).getDay();

        if (this.week === 0 || this.week === 6) {
            this.isWeekend = true;
        }
    }

    // Represent a month in a calender
    function Month(opts) {
        opts = opts || {};

        var now = new Date();

        this.daysList = [];
        this.year = opts.year != undefined ? opts.year : now.getFullYear();
        this.value = opts.value != undefined ? opts.value : now.getMonth() + 1;

        this.setDaysList(this.year, this.value);
    }

    // Set all days of the specified month of year
    Month.prototype.setDaysList = function(year, month) {

        var date = Util.adjustDate(year, month);

        this.year = year = date.year;
        this.value = month = date.month

        var i,
            startWeek = new Date(year, month - 1, 1).getDay(),
            curMonthDays = Util.daysInMonth(year, month),
            prevMonthDays = Util.daysInMonth(year, month - 1),
            totalDays = Math.ceil((startWeek + curMonthDays) / 7) * 7;

        this.daysList.length = 0;

        // The days of previous month
        for (i = 0; i < startWeek; i++) {
            this.daysList[i] = new Day({
                value: prevMonthDays - startWeek + i + 1,
                year: year,
                month: month - 1,
                isPrevMonth: true
            });
        }

        // The days of current month
        var now = new Date(),
            isNow = false;
        if (year === now.getFullYear() && month === now.getMonth() + 1) {
            for (i = startWeek; i < startWeek + curMonthDays; i++) {
                if (now.getDate() === i - startWeek + 1) {
                    isNow = true;
                } else {
                    isNow = false;
                }
                this.daysList[i] = new Day({
                    value: i - startWeek + 1,
                    year: year,
                    month: month,
                    isNow: isNow
                });
            }
        } else {
            for (i = startWeek; i < startWeek + curMonthDays; i++) {
                this.daysList[i] = new Day({
                    value: i - startWeek + 1,
                    year: year,
                    month: month,
                    isNow: isNow
                });
            }
        }

        // The days of next month
        for (i = startWeek + curMonthDays; i < totalDays; i++) {
            this.daysList[i] = new Day({
                value: i - startWeek - curMonthDays + 1,
                year: year,
                month: month + 1,
                isNextMonth: true
            });
        }

        return this;
    };

    // Calendar constructor to instantiate a calendar
    function Calendar(opts) {
        opts = opts || {};
        this.monthsList = [];
        this.count = opts.count || 1;

        var now = new Date();

        this.year = opts.year != undefined ? opts.year : now.getFullYear();
        this.month = opts.month != undefined ? opts.month : now.getMonth() + 1;

        this.setMonthsList(this.year, this.month);
    }

    // Set all the months in a calendar
    Calendar.prototype.setMonthsList = function(year, month) {

        var date = Util.adjustDate(year, month);

        this.year = year = date.year;
        this.month = month = date.month;

        for (var i = 0; i < this.count; i++) {
            this.monthsList[i] = new Month({
                year: year,
                value: month + i
            });
        }

        return this;
    };

    // Decrease one month
    Calendar.prototype.prevMonth = function() {
        this.setMonthsList(this.year, this.month - 1);
        return this.monthsList;
    };

    // Increase one month
    Calendar.prototype.nextMonth = function() {
        this.setMonthsList(this.year, this.month + 1);
        return this.monthsList;
    };

    // Decrease one year
    Calendar.prototype.prevYear = function() {
        this.setMonthsList(this.year - 1, this.month);
        return this.monthsList;
    };

    // Increase one year
    Calendar.prototype.nextYear = function() {
        this.setMonthsList(this.year + 1, this.month);
        return this.monthsList;
    };

    win._Calendar = win.Calendar;
    win.Calendar = Calendar;

})(window)