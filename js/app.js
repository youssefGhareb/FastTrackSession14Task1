/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */

var model = {
    attendance: [],
    init: function () {
        if (!localStorage.attendance) {
            console.log('Creating attendance records...');
            function getRandom() {
                return (Math.random() >= 0.5);
            }

            var nameColumns = $('tbody .name-col'),
                attendance = {};

            nameColumns.each(function () {
                var name = this.innerText;
                attendance[name] = [];

                for (var i = 0; i <= 11; i++) {
                    attendance[name].push(getRandom());
                }
            });

            localStorage.attendance = JSON.stringify(attendance);
            this.attendance = attendance;
        } else {
            this.attendance = JSON.parse(localStorage.attendance);
        }
    }
}

var controller = {
    init: function () {
        model.init();
        view.init();
    },
    getAttendance: function () {
        return model.attendance;
    },
    onCheckChange: function () {
        var studentRows = $('tbody .student'),
            newAttendance = {};

        studentRows.each(function () {
            var name = $(this).children('.name-col').text(),
                $allCheckboxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            $allCheckboxes.each(function () {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        localStorage.attendance = JSON.stringify(newAttendance);
        model.attendance = newAttendance;
        view.render();
    }
}

var view = {
    attendance: {},
    $allMissed: null,
    $allCheckboxes: null,
    init: function () {
        this.attendance = controller.getAttendance();
        this.$allMissed = $('tbody .missed-col');
        this.$allCheckboxes = $('tbody input');
        this.render();
        this.bindEvents();
    },

    render: function () {
        // Count a student's missed days
        this.attendance = controller.getAttendance();
        $.each(this.attendance, function (name, days) {
            var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                dayChecks = $(studentRow).children('.attend-col').children('input');

            dayChecks.each(function (i) {
                $(this).prop('checked', days[i]);
            });
        });
        this.$allMissed.each(function () {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function () {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
        // Check boxes, based on attendace records
    },

    bindEvents: function () {
        this.$allCheckboxes.on("click", controller.onCheckChange)
    }
}


/* STUDENT APPLICATION */
$(function () {
    controller.init();
}());
