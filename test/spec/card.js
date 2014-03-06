var expect = require("expect.js");
var Card   = require('../../game/card.js').Card;


describe('Card', function() {
    it('should export a function', function() {
        expect(Card).to.be.a('function');
    });
    describe('CardInstance', function() {
        var newCard = new Card('blue', 1);

        it('should expose an object', function() {
            expect(newCard).to.be.an('object');
        });
        it('should have a property called suit', function() {
            expect(newCard).to.have.property('suit');
        });
        it('should have a property called value', function() {
            expect(newCard).to.have.property('value');
        });
        describe('#suit', function() {
            it('should return "blue" when constructor parameter is "blue"', function() {
                var cardBlue = new Card('blue', 2);
                expect(cardBlue.suit).to.be('blue');
            });
        });
        describe('#value', function() {
            it('should return 9 when constructor parameter is 9', function() {
                var cardNine = new Card('red', 9);
                expect(cardNine.value).to.be(9);
            });
            it('should return "W" when constructor parameter is "W"', function() {
                var cardWizard = new Card('wizard', 'W');
                expect(cardWizard.value).to.be('W');
            });
        });
    });
});
