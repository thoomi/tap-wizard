'use strict';

describe('Controller: HostgamectrlCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var HostgamectrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HostgamectrlCtrl = $controller('HostgamectrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
