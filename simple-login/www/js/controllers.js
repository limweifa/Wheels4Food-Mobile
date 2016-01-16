(function () {
    'use strict';
    angular.module('starter.controllers', [])

            .controller('LoginCtrl', ['$scope', '$ionicPopup', '$state', '$http', '$localstorage', 'api', function ($scope, $ionicPopup, $state, $http, $localstorage, api) {
                    $scope.data = {
                        'username': '',
                        'password': ''
                    };
                    
                    $scope.login = function () {
                        console.log("HELLO I MANAGE TO COME HERE.")
                        console.log($scope.data.username)
                        console.log($scope.data.password)
                        $http({
                            url: api.endpoint + 'UserLoginRequest',
                            method: 'POST',
                            data: {
                                'username': $scope.data.username,
                                'password': $scope.data.password
                            },
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }).then(function (response) {
                            $scope.isLogging = false;

                            if (response.data.isAuthenicated) {
                                $state.go('tab.dash');
                                $scope.$parent.isLoggedIn = true;
                            } else {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Login failed!',
                                    template: 'Please check your credentials!'
                                });
                            }
                        });
                    };
                    
                    $scope.logout = function() {
                        var confirmPopup = $ionicPopup.confirm({
                          title: 'Consume Ice Cream',
                          template: 'Are you sure you want to eat this ice cream?'
                        });

                        confirmPopup.then(function(res) {
                          if(res) {
                            console.log('You are sure');
                          } else {
                            console.log('You are not sure');
                          }
                        });
                    };
                }
            ]);
})();
