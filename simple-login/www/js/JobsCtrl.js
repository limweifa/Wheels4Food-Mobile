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

        })
        ;