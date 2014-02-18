'use strict';

angular.module('clientApp')
  .directive('tbPlayingCard', function ($document) {
    return {
      templateUrl: '../../views/tb-playingcard.html',
      restrict: 'E',
      scope: {
        card: '=info'
      }
    };
  });
