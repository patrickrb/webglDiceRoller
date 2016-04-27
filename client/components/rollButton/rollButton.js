'use strict';

angular.module('webglDiceRoller')
    .directive('rollButton', function($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'components/rollButton/rollButton.html',
            link: function($scope) {
              $scope.rollDice = function(){
                $rootScope.$broadcast('roll-dice');
              };
            }
        };
    });
