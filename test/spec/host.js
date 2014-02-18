var expect = require("expect.js");
var Host   = require('../../game/host.js').Host;

describe('Host', function() {
    it('should export a function', function() {
        expect(Host).to.be.a('function');
    });

    describe('HostInstance', function() {
        var newHost = new Host('1abcXYZ9');

        it('should have the same functions as a client', function() {
            expect(newHost).to.have.property('getId');
            expect(newHost).to.have.property('setSocket');
            expect(newHost).to.have.property('getSocket');
            expect(newHost).to.have.property('emit');
        });
    });
});
