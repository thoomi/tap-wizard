var expect = require("expect.js");
var Client = require('../../game/client.js').Client;

describe('Client', function() {
    it('should export a function', function() {
        expect(Client).to.be.a('function');
    });

    describe('ClientInstance', function() {
        var newClient = new Client('1abcXYZ9');

        it('should expose an object', function() {
            expect(newClient).to.be.an('object');
        });

        describe('#getId()', function() {
            it('should return the constructors parameter id', function() {
                expect(newClient.getId()).to.be('1abcXYZ9');
            });
        });
        describe('#getSocket()', function() {
            it('should return null if no socket was set', function() {
                expect(newClient.getSocket()).to.be(null);
            });
            it('should return an object if a socket was set', function() {
                newClient.setSocket({ id: 'abcxyz', emit: function() {} });

                expect(newClient.getSocket()).to.be.an('object');
                expect(newClient.getSocket().id).to.be('abcxyz');
                expect(newClient.getSocket().emit).to.be.a('function');
            });
        });
        describe('#emit', function() {
            it('should be a function', function() {
                expect(newClient.emit).to.be.a('function');
            });
        });
    });
});
