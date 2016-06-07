"use strict";

angular.module("jkFramework").directive("jkFramework", function () {
    return {
        transclude: true,
        scope: {
            title: '@',
            subtitle: '@',
            iconFile: '@'
        },
        controller: "jkFrameworkController",
        templateUrl: "ext-modules/jkFramework/jkFrameworkTemplate.html"

    };
});