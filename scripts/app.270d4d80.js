'use strict';

/**
 * @ngdoc overview
 * @name standUpTurnTimerApp
 * @description
 * # standUpTurnTimerApp
 *
 * Main module of the application.
 */
angular
  .module('standUpTurnTimerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {

    ich.refresh();

    $routeProvider
      .when('/', {
        template: ich["main-view"],
        controller: 'MainCtrl'
      })
      .when('/about', {
        template: ich["about-view"],
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
