'use strict';

angular.module('webglDiceRoller')
    .directive('navbar', function($rootScope, userService, $cookieStore, Auth) {
        return {
            restrict: 'E',
            templateUrl: 'components/navbar/navbar.html',
            link: function($scope) {
                $scope.isLoggedIn = Auth.isLoggedIn;
                $scope.isAdmin = Auth.isAdmin;
                $scope.getCurrentUser = Auth.getCurrentUser;


                $scope.$watch(function() {
                    return userService.isLoggedIn;
                }, function() {
                    if (userService.isLoggedIn) {
                        $scope.user = $cookieStore.get('user');
                        $scope.isLoggedIn = true;
                    } else {
                        $scope.isLoggedIn = false;
                    }
                });

                $scope.logout = function() {
                    userService.logout();
                };
            }
        };
    });
