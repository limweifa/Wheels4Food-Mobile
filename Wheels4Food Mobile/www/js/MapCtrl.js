angular.module('starter.controllers')

        .controller('MapCtrl', function ($scope, $state, $stateParams, $ionicPlatform, $ionicLoading, $ionicHistory, $cordovaGeolocation, $ionicLoading, $http, $filter, $localstorage, api, $ionicPopup, $ionicModal) {
            $scope.username = $localstorage.get('username');
            $scope.userID = $localstorage.get('userID');
            $ionicPlatform.ready(function () {

                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
                });

                var posOptions = {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0
                };

                $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;

                    var myLatlng = new google.maps.LatLng(lat, long);

                    console.log("lat: " + lat);
                    console.log("long: " + long);
                    console.log("myLatlng: " + myLatlng);

                    var mapOptions = {
                        center: myLatlng,
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

                    google.maps.event.addListenerOnce(map, 'idle', function () {

                        var marker = new google.maps.Marker({
                            map: map,
                            animation: google.maps.Animation.DROP,
                            position: myLatlng
                        });

                        var infoWindow = new google.maps.InfoWindow({
                            content: "Here I am!"
                        });

                        google.maps.event.addListener(marker, 'click', function () {
                            infoWindow.open($scope.map, marker);
                        });

                    });
//                    var marker = new google.maps.Marker({
//                        position: myLatlng,
//                        map: map,
//                        draggable: true
//                    });

                    $scope.map = map;
                    $ionicLoading.hide();

                }, function (err) {
                    $ionicLoading.hide();
                    console.log(err);
                });

            });
            $scope.myGoBack = function () {
                $ionicHistory.goBack();
            };

        })
        ;
