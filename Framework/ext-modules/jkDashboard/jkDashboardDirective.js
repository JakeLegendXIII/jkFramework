"use strict";

angular.module('jkDashboard').directive('jkDashboard', function () {
    return {
        templateUrl: 'ext-modules/jkDashboard/jkDashboardTemplate.html',
        link: function (scope, element, attrs) {
            scope.addNewWidget = function (widget) {
                var newWidget = angular.copy(widget.settings);
                scope.widgets.push(newWidget);
            }
        }
    };
});