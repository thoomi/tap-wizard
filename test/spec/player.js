var expect = require("expect.js");
var Player = require('../../game/player.js').Player;

describe('Player', function() {
    it('should export a function', function() {
        expect(Player).to.be.a('function');
    });

    describe('PlayerInstance', function() {
        var newPlayer = new Player('1abcXYZ9', 'Thomi', 89);

        it('should have the same functions as a client', function() {
            expect(newPlayer).to.have.property('getId');
            expect(newPlayer).to.have.property('setSocket');
            expect(newPlayer).to.have.property('getSocket');
            expect(newPlayer).to.have.property('emit');
        });
    });
});
