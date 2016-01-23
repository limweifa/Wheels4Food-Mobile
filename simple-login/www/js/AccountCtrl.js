angular.module('starter.controllers')

        .controller('AccountCtrl', function ($scope, $state, $http, $localstorage, api, $ionicPopup, $ionicModal) {
            $scope.username = $localstorage.get('username');

            console.log($scope.username);

//            $scope.viewAccount = function () {
            $http({
                url: api.endpoint + 'GetUserByUsernameRequest/' + $scope.username,
                method: 'GET'
            }).then(function (response) {
                console.log(response);
                $scope.user = response.data;
                $scope.originalUser = angular.copy($scope.user);
            });
//            }
            $scope.logout = function () {
                $state.go('login');
            }

            $scope.updateProfile = function () {
                var confirmUpdatePopup = $ionicPopup.confirm({
                    title: 'Confirm Profile Update',
                    template: 'Are you sure you want to update your profile?'
                });

                confirmUpdatePopup.then(function (res) {
                    if (res) {
                        console.log('Yes Update');
                        $http({
                            url: api.endpoint + 'UpdateUserRequest',
                            method: 'PUT',
                            data: $scope.user,
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }).then(function (response) {
                            if (response.data.isUpdated) {
                                $scope.originalUser = angular.copy($scope.user);
                                $state.go('tab.account');
                            } else {
                                $scope.errorList = response.data.errorList;
                                
                                var updateFailPopup = $ionicPopup.alert({
                                    title: 'Update Profile Failed',
                                    template: '<div ng-repeat="error in errorList"><font style="color: red">{{$index + 1}}. {{error}}</font></div>',
                                    scope: $scope
                                });

//                        ngDialog.openConfirm({
//                            template: '/Wheels4Food/resources/ngTemplates/updateProfileError.html',
//                            className: 'ngdialog-theme-default dialog-generic',
//                            scope: $scope
//                        });
                            }
                        });
                    } else {
                        console.log('You are not sure');
                    }
                });
            }
            
            $scope.cancel = function () {
                $scope.user = angular.copy($scope.originalUser);
                $scope.modal.hide();
            }
            $ionicModal.fromTemplateUrl('/templates/editModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                $scope.modal.show();
            };
            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hidden', function () {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
            });
        })
        ;