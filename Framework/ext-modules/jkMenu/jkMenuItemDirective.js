"use strict";

angular.module('jkMenu').directive('jkMenuItem', function () {
    return {
        require: '^jkMenu',
        scope: {
            label: '@',
            icon: '@',
            route: '@'
        },
        templateUrl: 'ext-modules/jkMenu/jkMenuItemTemplate.html',
        link: function (scope, el, attr, ctrl) {

            scope.isActive = function () {
                return el === ctrl.getActiveElement();
            };

            scope.isVertical = function () {
                return ctrl.isVertical() || el.parents('.jk-subitem-section').length > 0;
            }

            el.on('click', function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                scope.$apply(function () {
                    ctrl.setActiveElement(el);
                    ctrl.setRoute(scope.route);
                });
            });
        }
    };
});