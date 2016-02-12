'use strict';
angular.module('starter.controllers')

        .controller('RegisterCtrl', function ($scope, $state, $http, api, $ionicPopup) {
            $scope.registration = {
                'username': '',
                'password': '',
                'confirmPassword': '',
                'organizationName': '',
                'email': '',
                'pocName': '',
                'pocNumber': '',
                'licenseNumber': '',
                'role': 'Volunteer'
            };
            
            $scope.loginFailed = false;

            $http({
                url: api.endpoint + 'GetUserListByRoleRequest/VWO',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(function (response) {
                $scope.VWOList = response.data;
                $scope.registration.organizationName = response.data[0].organizationName;
            });



            $scope.submit = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirm Registration Submission',
                    template: '<div class="text-center">Are you sure you want to proceed?</div>'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        console.log('You are sure');
                        $http({
                            url: api.endpoint + 'CreateVolunteerPendingRegistrationRequest',
                            method: 'POST',
                            data: $scope.registration,
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }).then(function (response) {
                            console.log(response.data);
                            if (response.data.isCreated) {
                                var registerSuccessPopup = $ionicPopup.alert({
                                    title: 'Registration Successful',
                                    template: '<div class="text-center">Your registration has been submitted successfully</div>',
                                    scope: $scope
                                });

                                registerSuccessPopup.then(function(){
                                        $state.go('login');
                                });

                            } else {
                                $scope.errorList = response.data.errorList;
                                var registerFailPopup = $ionicPopup.alert({
                                    title: 'Registration Failed',
                                    template: '<div ng-repeat="error in errorList"><font style="color: red">{{$index + 1}}. {{error}}</font></div>',
                                    scope: $scope
                                });
                            }
                        });
                    } else {
                        console.log('You are not sure');
                    }
                });

            }
        })
        ;