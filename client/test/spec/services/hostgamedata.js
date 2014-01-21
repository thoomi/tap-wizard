'use strict';

describe('Service: hostGameData', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var hostGameData;
  beforeEach(inject(function (_hostGameData_) {
    hostGameData = _hostGameData_;
  }));

  it('should do something', function () {
    expect(!!hostGameData).toBe(true);
  });

});
