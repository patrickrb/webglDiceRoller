'use strict';

angular.module('webglDiceRoller')
    .directive('rollResults', function($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'components/rollResults/rollResults.html',
            controller: function($scope){
              $scope.result = 4;
            },
            link: function($scope) {
            $rootScope.$on('roll-results', (event, result) => {
              $scope.result = result;
            });
            }
        };
    });
