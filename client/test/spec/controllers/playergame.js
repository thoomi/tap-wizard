'use strict';

describe('Controller: PlayergamectrlCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var PlayergamectrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlayergamectrlCtrl = $controller('PlayergamectrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
