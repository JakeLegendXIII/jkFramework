

angular.module("jkFramework", ["jkMenu", "jkDashboard"]);


angular.module('jkFramework').directive('jkUserProfileSmall', function () {
    return {
        templateUrl: 'ext-modules/jkFramework/jkUserProfile/jkUserProfileSmallTemplate.html'
    };
});


angular.module('jkFramework').directive('jkUserProfile', function () {
    return {
        templateUrl: 'ext-modules/jkFramework/jkUserProfile/jkUserProfileTemplate.html'
    };
});


angular.module("jkMenu", ["ngAnimate"]);
angular.module("jkMenu").run(["$templateCache", function($templateCache) {$templateCache.put("ext-modules/jkMenu/jkMenuGroupTemplate.html","\r\n<li class=\"jk-selectable-item\" ng-click=\"clicked()\" ng-class=\"{\'jk-item-horizontal\': !isVertical()}\">\r\n    <div class=\"jk-noselect\">\r\n        <i class=\"fa {{icon}} jk-menu-icon\"></i>\r\n        {{label}}\r\n        <i ng-if=\"isVertical()\"\r\n           class=\"fa fa-chevron-left jk-group-indicator-left\"\r\n           ng-class=\"{\'fa-rotate-270\': isOpen}\"></i>\r\n    </div>\r\n</li>\r\n<div ng-show=\"isOpen\" class=\"jk-subitem-section jk-fade-in-animation\" ng-class=\"{\'jk-popup-menu\': !isVertical() }\">\r\n    <ul ng-transclude></ul>\r\n</div>");
$templateCache.put("ext-modules/jkMenu/jkMenuItemTemplate.html","\r\n<li class=\"jk-selectable-item\" ng-class=\"{\'jk-item-horizontal\': !isVertical()}\">\r\n    <div class=\"jk-noselect\">\r\n        <i class=\"fa {{icon}} jk-menu-icon\"></i>\r\n        {{label}}\r\n    </div>\r\n    <i ng-if=\"isActive() && isVertical()\"\r\n       class=\"fa fa-2x fa-caret-left jk-menu-active-indicator\"></i>\r\n</li>\r\n");
$templateCache.put("ext-modules/jkMenu/jkMenuTemplate.html","<div class=\"jk-menu-area\"\r\n     ng-show=\"showMenu\"\r\n     ng-class=\"{\'jk-menu-area-vertical\': isVertical, \'jk-menu-area-horizontal\': !isVertical}\">\r\n    <ul class=\"jk-menu\" ng-transclude></ul>\r\n    <a class=\"btn jk-menu-layout-button\"\r\n       ng-show=\"allowHorizontalToggle\"\r\n       ng-class=\"{\'jk-layout-button-horizontal\': !isVertical}\"\r\n       ng-click=\"toggleMenuOrientation()\">\r\n        <i class=\"fa\"\r\n           ng-class=\"{\'fa-chevron-up\': isVertical, \'fa-chevron-left\': !isVertical}\"></i>\r\n    </a>\r\n</div>");}]);


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


angular.module('jkMenu').controller('jkMenuController',
    ['$scope', '$rootScope',
        function ($scope, $rootScope) {

            $scope.isVertical = true;
            $scope.openMenuScope = null;
            $scope.showMenu = true;
            $scope.allowHorizontalToggle = true;

            this.getActiveElement = function () {
                return $scope.activeElement;
            };

            this.setActiveElement = function (el) {
                $scope.activeElement = el;
            };

            this.isVertical = function () {
                return $scope.isVertical;
            }

            this.setRoute = function (route) {
                $rootScope.$broadcast('jk-menu-item-selected-event',
                    { route: route });
            };

            this.setOpenMenuScope = function (scope) {
                $scope.openMenuScope = scope;
            };

            $scope.toggleMenuOrientation = function () {

                // close any open menu
                if ($scope.openMenuScope)
                    $scope.openMenuScope.closeMenu();

                $scope.isVertical = !$scope.isVertical;

                $rootScope.$broadcast('jk-menu-orientation-changed-event',
                    { isMenuVertical: $scope.isVertical });
            };

            angular.element(document).bind('click', function (e) {
                if ($scope.openMenuScope && !$scope.isVertical) {
                    if ($(e.target).parent().hasClass('jk-selectable-item'))
                        return;
                    $scope.$apply(function () {
                        $scope.openMenuScope.closeMenu();
                    });
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            $scope.$on('jk-menu-show', function (evt, data) {
                $scope.showMenu = data.show;
                $scope.isVertical = data.isVertical;
                $scope.allowHorizontalToggle = data.allowHorizontalToggle;
            });
        }
    ]);
angular.module("jkFramework").run(["$templateCache", function($templateCache) {$templateCache.put("ext-modules/jkFramework/jkFrameworkTemplate.html","\r\n<div class=\"jk-title-bar\">\r\n    <div class=\"row\">\r\n        <div class=\"jk-logo-area col-sm-6\">\r\n            <img class=\"jk-icon\" ng-src=\"{{ iconFile }}\" />\r\n            <div class=\"jk-title-area\">\r\n                <p class=\"jk-logo-title\">{{ title }}</p>\r\n                <p class=\"jk-logo-subtitle\">{{ subtitle }}</p>\r\n            </div>\r\n\r\n            <div ng-if=\"isMenuButtonVisible\" ng-click=\"menuButtonClicked()\"\r\n                 class=\"jk-collapsed-menu pull-right\">\r\n                <button type=\"button\" class=\"btn jk-nav-button\">\r\n                    <i class=\"fa fa-bars\"></i>\r\n                </button>\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <div class=\"jk-right-side-controls col-sm-6\">\r\n            <div>\r\n                <jk-user-profile-small></jk-user-profile-small>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<!--<div class=\"jk-menu-area\"\r\n     ng-show=\"isMenuVisible\"\r\n     ng-class=\"{\'jk-menu-area-vertical\': isMenuVertical, \'jk-menu-area-horizontal\': !isMenuVertical}\">\r\n    <jk-user-profile></jk-user-profile>\r\n</div>-->\r\n\r\n<ng-transclude></ng-transclude>\r\n\r\n<div ng-view class=\"jk-view\"\r\n     ng-class=\"{\'jk-view-full-width\': !isMenuVertical || !isMenuVisible}\">\r\n</div>\r\n\r\n\r\n");
$templateCache.put("ext-modules/jkFramework/jkUserProfile/jkUserProfileSmallTemplate.html","\r\n<div class=\"jk-user-profile-small pull-right\">\r\n    <span>Don Morgan</span>\r\n    <button class=\"btn btn-default btn-sm\">\r\n        <i class=\"fa fa-chevron-down\"></i>\r\n    </button>\r\n</div>\r\n");
$templateCache.put("ext-modules/jkFramework/jkUserProfile/jkUserProfileTemplate.html","\r\n<div class=\"jk-user-profile\" ng-if=\"isMenuVertical && !isMenuButtonVisible\">\r\n    <div>\r\n        <p>Don</p>\r\n        <p>Morgan</p>\r\n        <button class=\"btn btn-default btn-sm\">\r\n            <i class=\"fa fa-chevron-down\"></i>\r\n        </button>\r\n    </div>\r\n</div>\r\n");}]);


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


angular.module("jkFramework").controller("jkFrameworkController",
    ['$scope', '$window', '$timeout', '$rootScope', '$location',
        function ($scope, $window, $timeout, $rootScope, $location) {

            $scope.isMenuVisible = true;
            $scope.isMenuButtonVisible = true;
            $scope.isMenuVertical = true;

            $scope.$on('jk-menu-item-selected-event', function (evt, data) {
                $scope.routeString = data.route;
                $location.path(data.route);
                checkWidth();
                broadcastMenuState();
            });

            $scope.$on('jk-menu-orientation-changed-event', function (evt, data) {
                $scope.isMenuVertical = data.isMenuVertical;
                $timeout(function () {
                    $($window).trigger('resize');
                }, 0);
            });

            $($window).on('resize.jkFramework', function () {
                $scope.$apply(function () {
                    checkWidth();
                    broadcastMenuState();
                });
            });
            $scope.$on("$destroy", function () {
                $($window).off("resize.jkFramework"); // remove the handler added earlier
            });

            var checkWidth = function () {
                var width = Math.max($($window).width(), $window.innerWidth);
                $scope.isMenuVisible = (width >= 768);
                $scope.isMenuButtonVisible = !$scope.isMenuVisible;
            };

            $scope.menuButtonClicked = function () {
                $scope.isMenuVisible = !$scope.isMenuVisible;
                broadcastMenuState();
                //$scope.$apply();
            };

            var broadcastMenuState = function () {
                $rootScope.$broadcast('jk-menu-show',
                    {
                        show: $scope.isMenuVisible,
                        isVertical: $scope.isMenuVertical,
                        allowHorizontalToggle: !$scope.isMenuButtonVisible
                    });
            };

            $timeout(function () {
                checkWidth();
            }, 0);

        }
    ]);


angular.module("jkDashboard", ["gridster", "ui.bootstrap"]);
angular.module("jkDashboard").run(["$templateCache", function($templateCache) {$templateCache.put("ext-modules/jkDashboard/jkDashboardTemplate.html","\r\n<div class=\"jk-dashboard-header\">\r\n    {{ title }}\r\n\r\n    <div class=\"jk-dashboard-controls\">\r\n        <div class=\"dropdown\">\r\n            <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-expanded=\"true\">\r\n                <i class=\"fa fa-plus\"></i>\r\n                Add Widget\r\n                <span class=\"caret\"></span>\r\n            </button>\r\n            <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">\r\n                <li ng-repeat=\"widget in widgetDefinitions\">\r\n                    <a role=\"menuitem\" ng-click=\"addNewWidget(widget)\">{{widget.title}}</a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div gridster=\"gridsterOpts\">\r\n    <ul>\r\n        <li gridster-item=\"item\" ng-repeat=\"item in widgets\">\r\n            <jk-widget-body>\r\n            </jk-widget-body>\r\n        </li>\r\n    </ul>\r\n</div>");
$templateCache.put("ext-modules/jkDashboard/jkWidgetBodyTemplate.html","<div class=\"jk-widget-body\">\r\n    <div class=\"jk-widget-menu-area btn-group\">\r\n        <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n            <i class=\"fa fa-bars\" ng-click=\"iconClicked()\" />\r\n        </a>\r\n\r\n        <ul class=\"dropdown-menu\" role=\"menu\">\r\n            <li ng-click=\"close()\"><i class=\"fa fa-2x fa-close\" ng-click=\"iconClicked()\"></i></li>\r\n            <li ng-click=\"settings()\"><i class=\"fa fa-2x fa-gear\" ng-click=\"iconClicked()\"></i></li>\r\n        </ul>\r\n    </div>\r\n</div>");}]);


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