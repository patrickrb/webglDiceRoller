'use strict';

angular.module('webglDiceRoller')
    .directive('navbar', function() {
        return {
            restrict: 'E',
            templateUrl: 'components/navbar/navbar.html',
            link: function() {
            }
        };
    });
