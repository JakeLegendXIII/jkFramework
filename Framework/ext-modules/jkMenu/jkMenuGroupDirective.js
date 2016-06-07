"use strict";

angular.module('jkMenu').directive('jkMenuGroup', function () {
    return {
        require: '^jkMenu',
        transclude: true,
        scope: {
            label: '@',
            icon: '@'
        },
        templateUrl: 'ext-modules/jkMenu/jkMenuGroupTemplate.html',
        link: function (scope, el, attrs, ctrl) {
            scope.isOpen = false;
            scope.closeMenu = function () {
                scope.isOpen = false;
            };
            scope.clicked = function () {
                scope.isOpen = !scope.isOpen;

                if (el.parents('.jk-subitem-section').length == 0)
                    scope.setSubmenuPosition();

                ctrl.setOpenMenuScope(scope);
            };
            scope.isVertical = function () {
                return ctrl.isVertical() || el.parents('.jk-subitem-section').length > 0;
            };

            scope.setSubmenuPosition = function () {
                var pos = el.offset();
                $('.jk-subitem-section').css({ 'left': pos.left + 20, 'top': 36 });
            };
        }
    };
});