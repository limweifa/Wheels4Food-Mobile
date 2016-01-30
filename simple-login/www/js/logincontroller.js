(function () {
    'use strict';
    angular
            .module('starter.controllers', [])
            .controller('LoginCtrl', ['$scope', '$ionicPopup', '$state', '$http', '$timeout', '$localstorage', 'api', function ($scope, $ionicPopup, $state, $http, $timeout, $localstorage, api) {
                    //$scope.$parent.isLoggedIn = false;
                    console.log("HELLO");
                    $scope.signInText = 'Sign In';
                    $scope.isLogging = false;

                    $scope.data = {
                        'username': '',
                        'password': ''
                    };

                    $scope.login = function () {
                        console.log("HELLO NIGA");
                        $scope.signInText = 'Authenticating';
                        $scope.isLogging = true;

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
                            console.log(response);
                            $timeout(function () {
                                $scope.isLogging = false;

                                if (response.data.isAuthenicated) {
                                    $localstorage.set('username', response.data.user.username);
                                    $localstorage.set('userID', response.data.user.id);
                                    $localstorage.set('role', response.data.user.role);
                                    
//                                    localStorageService.set('authorizationData', {
//                                        userID: response.data.user.id,
//                                        username: response.data.user.username,
//                                        role: response.data.user.role
//                                    });

                                    $state.go('tab.jobs');
                                    $scope.$parent.isLoggedIn = true;
                                } else {
                                   // $scope.signInText = 'Sign In';

                                    $scope.error = response.data.error;
                                    $scope.loginFailed = true;
                                    
//                                    var alertPopup = $ionicPopup.alert({
//                                        title: 'Login failed!',
//                                        template: 'Please check your credentials!'
//                                    });
                                }
                            }, 800);
                        }, function (error) {
                            console.log(error);
                        });
                    };
                    
                    $scope.logout = function() {
                        console.log("LOGOUT");
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
