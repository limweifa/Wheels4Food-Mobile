angular.module('starter.controllers')

        .controller('JobsCtrl', function ($scope, $state, $http, $localstorage, api, $ionicPopup, $ionicModal) {


            $http({
                url: api.endpoint + 'GetJobListRequest',
                method: 'GET'
            }).then(function (response) {
                $scope.jobList = response.data;
                console.log("JOBLIST");
                console.log(response.data);
                $scope.currentPage = 1;
                $scope.pageSize = 10;
            });

            $scope.view = function (job) {
                $http({
                    url: api.endpoint + 'GetJobByIdRequest/' + job.id,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(function (response) {
                    $scope.currentJob = response.data;
                    console.log("CURRENT JOB");
                    console.log(response.data);
                    console.log("**************");

                    $scope.scheduleAMList = [];
                    $scope.schedulePMList = [];
                    $scope.disabledAMList = [];
                    $scope.disabledPMList = [];
                    $scope.scheduleCount = 0;

                    for (var i = 0; i < $scope.currentJob.schedule.length; i++) {
                        var value = $scope.currentJob.schedule.charAt(i);

                        if (i % 2 === 0) {
                            if (value === '0') {
                                $scope.scheduleAMList.push({'value': false});
                                $scope.disabledAMList.push(i / 2);
                            } else {
                                $scope.scheduleAMList.push({'value': true});
                                $scope.scheduleCount++;
                            }
                        } else {
                            if (value === '0') {
                                $scope.schedulePMList.push({'value': false});
                                $scope.disabledPMList.push(Math.floor(i / 2));
                            } else {
                                $scope.schedulePMList.push({'value': true});
                                $scope.scheduleCount++;
                            }
                        }
                    }

                    var parts = $scope.currentJob.expiryDate.split("/");
                    var expiryDate = new Date(parseInt(parts[2], 10),
                            parseInt(parts[1], 10) - 1,
                            parseInt(parts[0], 10));

                    $scope.dates = [];

                    for (var i = 0; i < 10; i++) {
                        if (expiryDate.getDay() !== 0 && expiryDate.getDay() !== 6) {
                            $scope.dates.unshift({'value': new Date(expiryDate)});
                        } else {
                            i--;
                        }

                        expiryDate.setDate(expiryDate.getDate() - 1);
                    }

                    //to send to UI for display
                    $scope.availableSlots = [];

                    for (var i = 0; i < $scope.dates.length; i++) {
                        console.log($scope.dates[i]);
                        var amSlot = false;
                        var pmSlot = false;

                        if ($scope.scheduleAMList[i].value === true) {
                            amSlot = true;
                        }

                        if ($scope.schedulePMList[i].value === true) {
                            pmSlot = true;
                        }

                        if (amSlot === true || pmSlot === true) {
                            $scope.availableSlots.push({'date': $scope.dates[i], 'amSlot': amSlot, 'pmSlot': pmSlot});
                        }
                    }


//                        console.log("scheduleAMList");
//                        console.log($scope.scheduleAMList);
//                        console.log("disabledAMList");
//                        console.log($scope.disabledAMList);
//                        console.log("schedulePMList");
//                        console.log($scope.schedulePMList);
//                        console.log("disabledPMList");
//                        console.log($scope.disabledPMList);





//                    ngDialog.openConfirm({
//                        template: '/Wheels4Food/resources/ngTemplates/viewJobDetails.html',
//                        className: 'ngdialog-theme-default dialog-approve-request-3',
//                        scope: $scope
//                    }).then(function (schedule) {
//
//                    });
                });
                $scope.modal.show();
            };
//            $timeout(function () {
//                indexPromise.then(function (response) {
//                    $scope.jobList = response.data;
//                    $scope.currentPage = 1;
//                    $scope.pageSize = 10;
//
//                    $scope.$watch('searchFilter', function () {
//                        $scope.proccessedSearchFilter = parseSplitArray($scope.searchFilter, ['demand.supply.itemName']);
//                    });
//                });
//            }, 1000);
            $ionicModal.fromTemplateUrl('templates/viewJobDetails.html', {
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