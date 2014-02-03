'use strict';

angular.module('clientApp')
  .directive('tbPlayingCard', function () {
    return {
      templateUrl: '../../views/tb-playingcard.html',
      restrict: 'E',
      scope: {
        card: '=info'
      }
    };
  });
