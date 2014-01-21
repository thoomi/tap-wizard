'use strict';

describe('Controller: HostgameCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var HostgameCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HostgameCtrl = $controller('HostgameCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
