angular.module('starter.controllers')

        .controller('JobsCtrl', function ($scope, $state, $http, $filter, $localstorage, api, $ionicPopup, $ionicModal) {
            $scope.username = $localstorage.get('username');
            $scope.userID = $localstorage.get('userID');

            $http({
                url: api.endpoint + 'GetJobListRequest',
                method: 'GET'
            }).then(function (response) {
                $scope.jobList = response.data;
//                console.log("JOBLIST");
//                console.log(response.data);
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
//                    console.log("CURRENT JOB");
                    console.log(response.data);
//                    console.log("**************");

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

                    //Filter data to display on viewJobDetails.html
                    $scope.availableSlots = [];

                    for (var i = 0; i < $scope.dates.length; i++) {
                        console.log($scope.dates[i]);

                        if ($scope.scheduleAMList[i].value || $scope.schedulePMList[i].value) {
                            $scope.availableSlots.push({
                                'amSlot': {isAvailable: $scope.scheduleAMList[i].value, date: $scope.dates[i].value, period: "9am to 12pm"},
                                'pmSlot': {isAvailable: $scope.schedulePMList[i].value, date: $scope.dates[i].value, period: "2pm to 5pm"}
                            });

                        }
                    }

                    //Accept Job
                    $scope.selectedSlot = {};

                    $scope.selectSlot = function (selectedSlot) {
                        $scope.deliveryDate = $filter('date')(selectedSlot.date, 'dd/MM/yyyy');
                        $scope.hasSelection = true;
                    };

                    $scope.timePickerPickupCallback= function(val) {
                        if (typeof (val) === 'undefined') {
                            console.log('Time not selected');
                        } else {
                            var selectedTime = new Date(val * 1000 - 8 * 60 * 60 * 1000);
                            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
                            $scope.collectionTime = $filter('date')(selectedTime, 'HH:mm a');
                            $scope.collectionTimeTwelveHours = $filter('date')(selectedTime, 'hh:mm a');
                        }
                    }
                    
                    $scope.timePickerDeliverCallback= function(val) {
                        if (typeof (val) === 'undefined') {
                            console.log('Time not selected');
                        } else {
                            var selectedTime = new Date(val * 1000 - 8 * 60 * 60 * 1000);
                            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
                            $scope.deliveryTime = $filter('date')(selectedTime, 'HH:mm a');
                            $scope.deliveryTimeTwelveHours = $filter('date')(selectedTime, 'hh:mm a');
                        }
                    }

                    $http({
                        url: api.endpoint + 'AcceptJobRequest',
                        method: 'PUT',
                        data: {
                            'jobID': job.id,
                            'userID': $scope.userID,
                            'deliveryDate': $scope.deliveryDate,
                            'collectionTime': $scope.collectionTime,
                            'deliveryTime': $scope.deliveryTime
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(function (response) {
                        if (response.data.isAccepted) {
                            ngDialog.openConfirm({
                                template: '/Wheels4Food/resources/ngTemplates/acceptJobSuccess.html',
                                className: 'ngdialog-theme-default dialog-generic',
                                scope: $scope
                            }).then(function () {
                                $state.go('MyJobs');
                            });
                        }
                    });

                });
                $scope.modal.show();
            };
            
            $scope.timePickerObjectPickup = {
                inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
                step: 10, //Optional
                format: 12, //Optional
                titleLabel: 'Please indicate approximate pickup time', //Optional
                setLabel: 'Set', //Optional
                closeLabel: 'Close', //Optional
                setButtonType: 'button-positive', //Optional
                closeButtonType: 'button-stable', //Optional
                callback: function (val) {    //Mandatory
                    $scope.timePickerPickupCallback(val);
                }
            };
            
            $scope.timePickerObjectDeliver = {
                inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
                step: 10, //Optional
                format: 12, //Optional
                titleLabel: 'Please indicate approximate delivery time', //Optional
                setLabel: 'Set', //Optional
                closeLabel: 'Close', //Optional
                setButtonType: 'button-positive', //Optional
                closeButtonType: 'button-stable', //Optional
                callback: function (val) {    //Mandatory
                    $scope.timePickerDeliverCallback(val);
                }
            };
            console.log("hello");
            
            //View Job Details Modal
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