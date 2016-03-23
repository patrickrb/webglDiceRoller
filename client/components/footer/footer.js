'use strict';

angular.module('webglDiceRoller')
    .directive('footer', function() {
        return {
            restrict: 'E',
            templateUrl: 'components/footer/footer.html',
            link: function($scope) {
            }
        };
    });
