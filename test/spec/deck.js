var expect = require("expect.js");
var Deck = require('../../game/deck.js').Deck;

describe('Deck', function() {
    it('should export a function', function() {
        expect(Deck).to.be.a('function');
    });

    describe('DeckInstance', function() {
        var newDeck = new Deck();
        it('should expose an object', function() {
            expect(newDeck).to.be.an('object');
        });

        describe('#cards', function() {
            it('should return an array of cards', function() {
                expect(newDeck.cards).to.be.an('array');
                // To check if it is a card we need to check if it has the right properties
                expect(newDeck.cards[0]).to.have.property('suit');
                expect(newDeck.cards[0]).to.have.property('value');
            });
        });

        describe('#numberOfCards', function() {
            it('should be the length of the cards array', function() {
                expect(newDeck.numberOfCards).to.be(newDeck.cards.length);
            });
            it('should be 60 for the game wizard', function() {
                expect(newDeck.numberOfCards).to.be(60);
            });
        });

        describe('#shuffle', function() {
            it('should be a function', function() {
                expect(newDeck.shuffle).to.be.a('function');
            })
        })
    });
});
