"use strict";

angular.module('jkDashboard').directive('jkWidgetBody',
    ['$compile', '$uibModal',
    function ($compile, $uibModal) {
        return {
            templateUrl: 'ext-modules/jkDashboard/jkWidgetBodyTemplate.html',
            link: function (scope, element, attrs) {
                var newElement = angular.element(scope.item.template);
                element.append(newElement);
                $compile(newElement)(scope);

                scope.close = function () {
                    scope.widgets.splice(scope.widgets.indexOf(scope.item), 1);
                };

                scope.settings = function () {
                    var options = {
                        templateUrl: scope.item.widgetSettings.templateUrl,
                        controller: scope.item.widgetSettings.controller,
                        scope: scope
                    };
                    $uibModal.open(options);

                };

                scope.iconClicked = function () {
                    //empty body
                    // this function is used to handle icons getting clicked first
                };
            }
        };
    }
    ]);