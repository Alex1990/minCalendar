/**
 * A jquery plugin to display a calendar.
 */
$(function(){

    $.fn.events = function(obj) {
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                this.on(p.slice(0, p.indexOf(' ')),
                        p.slice(p.indexOf(' ') + 1),
                        obj[p]);
            }
        }
        return this;
    };

    $.fn.calendar = function(opts) {
        var $cl = this;
        var now = new Date();
        var defaults = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            minYear: now.getFullYear(),
            maxYear: now.getFullYear() + 30
        };

        opts = $.extend(defaults, opts);
        var calendar = new Calendar({
            count: 1,
            year: opts.year,
            month: opts.month
        });

        this.html(calendarHtml(calendar, opts));

        this.events({
            'click .cl-prev-year': prevYear,
            'click .cl-next-year': nextYear,
            'change .cl-year-list': changeYear,
            'click .cl-prev-month': prevMonth,
            'click .cl-next-month': nextMonth,
            'change .cl-month-list': changeMonth,
            'click .cl-current-date': curDate
        });

        function prevYear() {
            if (parseInt($cl.find('.cl-year-list').val()) > opts.minYear) {
                calendar.prevYear();
                $cl.html(calendarHtml(calendar, opts));
            }
        }

        function nextYear() {
            if (parseInt($cl.find('.cl-year-list').val()) < opts.maxYear) {
                calendar.nextYear();
                $cl.html(calendarHtml(calendar, opts));
            }
        }

        function changeYear() {
            var year = parseInt($(this).val());
            calendar.setMonthsList(year, calendar.month);
            $cl.html(calendarHtml(calendar, opts));
        }

        function prevMonth() {
            if (parseInt($cl.find('.cl-year-list').val()) === opts.minYear &&
                    parseInt($cl.find('.cl-month-list').val()) === 1) {
                return;
            }
            calendar.prevMonth();
            $cl.html(calendarHtml(calendar, opts));
        }

        function nextMonth() {
            if (parseInt($cl.find('.cl-year-list').val()) === opts.maxYear &&
                    parseInt($cl.find('.cl-month-list').val()) === 12) {
                return;
            }
            calendar.nextMonth();
            $cl.html(calendarHtml(calendar, opts));
        }

        function changeMonth() {
            var month = parseInt($(this).val());
            calendar.setMonthsList(calendar.year, month);
            $cl.html(calendarHtml(calendar, opts));
        }

        function curDate() {
            var now = new Date();
            calendar.setMonthsList(now.getFullYear(), now.getMonth() + 1);
            $cl.html(calendarHtml(calendar, opts));
        }

        return this;
    };

    var weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    function weekHtml() {
        var html = '';

        html += '<ul class="week-titles cf">';
        for (var i = 0; i < weeks.length; i++) {
            html += '<li>' + weeks[i] + '</li>';
        }
        html += '</ul>';

        return html;
    }

    function yearHtml(min, max, selected) {
        var html = '<div class="cl-year fl">' +
                    '<span class="cl-prev-year icon-left-open"></span>' +
                    '<select class="cl-year-list">';

        for (var i = min; i <= max; i++) {
            html += '<option value="' + i + '"' +
                    (selected == i ? 'selected="selected"' : '') +
                    '>' + i + '</option>';
        }
        html += '</select>' +
                '<span class="cl-next-year icon-right-open"></span>' +
                '</div>';
        return html;
    }

    function monthHtml(selected) {
        var html = '<div class="cl-month fl">' +
                    '<span class="cl-prev-month icon-left-open"></span>' +
                    '<select class="cl-month-list">';

        for (var i = 1; i < 13; i++) {
            html += '<option value="' + i + '"' +
                    (selected == i ? 'selected="selected"' : '') +
                    '>' + i + '</option>';
        }
        html += '</select>' +
                '<span class="cl-next-month icon-right-open"></span>' +
                '</div>';
        return html;
    }

    function curHtml() {
        return '<div class="cl-current fr">' +
                '<span class="cl-current-date" title="Current date"></span>' +
                '</div>';
    }

    function daysHtml(daysList) {
        var html = '<ul class="days-list cf">';
        for (var i = 0, l = daysList.length; i < l; i++) {
            html += '<li class="';

            if (daysList[i].isWeekend) {
                html += 'weekend ';
            }
            if (daysList[i].isNow) {
                html += 'now ';
            }
            if (daysList[i].isPrevMonth) {
                html += 'prev-month';
            } else if (daysList[i].isNextMonth) {
                html += 'next-month';
            } else {
                html += 'cur-month';
            }

            html += '">' + daysList[i].value + '</li>';
        }
        html += '</ul>';

        return html;
    }

    function calendarHtml(calendar, opts) {
        return '<div class="cl-head cf">' +
                yearHtml(opts.minYear, opts.maxYear, calendar.year) +
                monthHtml(calendar.month) +
                curHtml() +
                '</div><div class="cl-body">' +
                weekHtml() +
                daysHtml(calendar.monthsList[0].daysList) +
                '</div>';
    }
});