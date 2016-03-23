'use strict';

angular.module('webglDiceRoller')
    .directive('loadingSpinner', function($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'components/loadingSpinner/loadingSpinner.html',
            link: function($scope) {

                $scope.changeSystem = function($item) {
                    $rootScope.$broadcast('selectedSystem:update', $item);
                };
            }
        };
    });
