'use strict';

describe('Controller: CreategameCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var HostgameCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HostgameCtrl = $controller('CreategameCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
