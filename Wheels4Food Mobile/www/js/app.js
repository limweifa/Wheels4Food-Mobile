// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngMessages', 'ionic-timepicker'])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
        })


        .factory('$localstorage', ['$window', function ($window) {
                return {
                    set: function (key, value) {
                        $window.localStorage[key] = value;
                    },
                    get: function (key, defaultValue) {
                        return $window.localStorage[key] || defaultValue;
                    },
                    setObject: function (key, value) {
                        $window.localStorage[key] = JSON.stringify(value);
                    },
                    getObject: function (key) {
                        return JSON.parse($window.localStorage[key] || '{}');
                    }
                }
            }])

//        .run(function($localstorage) {
//
//          $localstorage.set('name', 'Max');
//          console.log($localstorage.get('name'));
//          $localstorage.setObject('post', {
//            name: 'Thoughts',
//            text: 'Today was a good day'
//          });
//
//          var post = $localstorage.getObject('post');
//          console.log(post);
//        });

        .config(function ($stateProvider, $urlRouterProvider) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider

                    // setup an abstract state for the tabs directive
                    .state('tab', {
                        url: '/tab',
                        abstract: true,
                        templateUrl: 'templates/tabs.html'
                    })

                    // Each tab has its own nav history stack:

//                    .state('tab.dash', {
//                        url: '/dash',
//                        views: {
//                            'tab-dash': {
//                                templateUrl: 'templates/tab-dash.html',
////                                controller: 'DashCtrl'
//                            }
//                        }
//                    })

//                    .state('tab.chats', {
//                        url: '/chats',
//                        views: {
//                            'tab-chats': {
//                                templateUrl: 'templates/tab-chats.html',
//                                controller: 'ChatsCtrl'
//                            }
//                        }
//                    })
//                    .state('tab.chat-detail', {
//                        url: '/chats/:chatId',
//                        views: {
//                            'tab-chats': {
//                                templateUrl: 'templates/chat-detail.html',
//                                controller: 'ChatDetailCtrl'
//                            }
//                        }
//                    })

//                    .state('tab.account', {
//                        //url: '/account',
//                        views: {
//                            'tab-account': {
//                                templateUrl: 'templates/tab-account.html',
//                                //controller: 'AccountCtrl'
//                            }
//                        }
//                    })

                    .state('login', {
                        url: '/login',
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    })

                    .state('register', {
                        url: '/register',
                        templateUrl: 'templates/register.html',
                        controller: 'RegisterCtrl'
                    })

                    .state('tab.account', {
                        url: '/account',
//                        templateUrl: 'templates/account.html',
//                        controller: 'AccountCtrl'
                        views: {
                            'account': {
                                templateUrl: 'templates/account.html',
                                controller: 'AccountCtrl'
                            }
                        }
                    })
                    
                    .state('tab.jobs', {
                        url: '/jobs',
//                        templateUrl: 'templates/account.html',
//                        controller: 'AccountCtrl'
                        views: {
                            'jobs': {
                                templateUrl: 'templates/jobs.html',
                                controller: 'JobsCtrl'
                            }
                        }
                    })

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/login');

        })

        .provider('api', [
            function () {
                var apiEndpoint = '';
                return {
                    setAPIEndpoints: function (baseEndPoint) {
                        apiEndpoint = baseEndPoint + '/rest/';
                    },
                    getAPIEndpoint: function () {
                        return apiEndpoint;
                    },
                    $get: function () {
                        return {
                            endpoint: apiEndpoint
                        };
                    }
                };
            }
        ])

        .config(['apiProvider',
            function (apiProvider) {
                //http://localhost:8100 for ionic serve testing
                apiProvider.setAPIEndpoints('http://localhost:8100');
                //http://apps.greentransformationlab.com/Wheels4Food for emulator and native mobile testing
                //apiProvider.setAPIEndpoints('http://apps.greentransformationlab.com/Wheels4Food');
            }
        ]);
