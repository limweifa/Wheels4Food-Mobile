angular.module('starter.controllers')

        .controller('MyJobsCtrl', function ($scope, $state, $stateParams, $http, $filter, $localstorage, api, $ionicPopup, $ionicModal) {
            $scope.username = $localstorage.get('username');
            $scope.userID = $localstorage.get('userID');

            //retriving all the jobs for the user
            $http({
                url: api.endpoint + 'GetJobListByUserIdRequest/' + $scope.userID,
                method: 'GET'
            }).then(function (response) {
                $scope.jobList = response.data;
            });

            //viewing the particular job details
            $scope.view = function (job) {
                $http({
                    url: api.endpoint + 'GetJobByIdRequest/' + job.id,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(function (response) {
                    $scope.currentJob = response.data;
                });
                $scope.modal.show();
            };

            $scope.cancelJob = function (job) {
                $scope.currentJob = job;

                job.demand.comments = '';

                var cancelJobPopup = $ionicPopup.show({
                    templateUrl: 'templates/cancelJobDetails.html',
                    title: 'Cancel Job',
                    subTitle: 'Please select a reason for cancellation',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancel'},
                        {
                            text: '<b>Confirm</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                $http({
                                    url: api.endpoint + 'CancelJobByDemandIdRequest',
                                    method: 'PUT',
                                    data: job.demand,
                                    headers: {
                                        'Content-Type': 'application/json',
                                    }
                                }).then(function (response) {

                                    if (response.data.isCancelled) {
                                        $scope.modal.hide();
          
                                        $scope.showAlert = function () {
                                            var cancelSuccessfulPopup = $ionicPopup.alert({
                                                title: 'Job Cancelled',
                                                template: 'Your job has been cancelled successfuly. We hope you can still help out in other jobs :)'
                                            });

                                            cancelSuccessfulPopup.then(function (res) {
                                                console.log("Successfully cancelled");
//                                                $state.go($state.current, $stateParams, {reload: true, inherit: false});
                                            });
                                        };
                                    }
                                });
//                                if (!$scope.data.wifi) {
//                                    //don't allow the user to close unless he enters wifi password
//                                    e.preventDefault();
//                                } else {
//                                    return $scope.data.wifi;
//                                }
                            }
                        }
                    ]
                });
            };

            //View Job Details Modal
            $ionicModal.fromTemplateUrl('templates/viewMyJobDetails.html', {
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