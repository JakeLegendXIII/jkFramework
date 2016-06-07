"use strict";

angular.module('jkMenu').directive('jkMenu', ['$timeout', function ($timeout) {
    return {
        scope: {

        },
        transclude: true,
        templateUrl: 'ext-modules/jkMenu/jkMenuTemplate.html',
        controller: 'jkMenuController',
        link: function (scope, el, attr) {
            var item = el.find('.jk-selectable-item:first');
            $timeout(function () {
                item.trigger('click');
            });
        }
    };
}]);