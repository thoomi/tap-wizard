'use strict';

angular.module('clientApp')
  .directive('modalDialog', function() {
    return {
      templateUrl: '../../views/modaldialog.html',
      restrict: 'E',
      scope: {
        winnerName: '=info'
      }
    };
});
