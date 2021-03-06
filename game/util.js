var util = module.exports = {};

////////////////////////////////////////////////////////////////////////////////
/// Simple helper function to create a random number between _low and _high boundaries
////////////////////////////////////////////////////////////////////////////////
util.createRandomNumber = function(_low, _high) {
    _high++;
    return Math.floor((Math.random() * (_high - _low) + _low));
};


////////////////////////////////////////////////////////////////////////////////
/// Simple helper function to shuffle an array
////////////////////////////////////////////////////////////////////////////////
util.shuffleArray = function(_array) {

    for (var index = _array.length - 1; index >= 1; index--)
    {
        var randomIndex = util.createRandomNumber(0, index);

        // Swap
        var tmp             = _array[index];
        _array[index]       = _array[randomIndex];
        _array[randomIndex] = tmp;
    }
};



