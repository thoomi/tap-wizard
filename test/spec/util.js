var expect = require("expect.js");
var util   = require('../../game/util.js');

describe('util', function() {
    describe('#createRandomNumber', function() {
        it('should generate a random number between boundaries', function() {
            var randomNumber = util.createRandomNumber(5, 20);
            expect(randomNumber).to.be.above(4);
            expect(randomNumber).to.be.below(21);
        });
    });
});
