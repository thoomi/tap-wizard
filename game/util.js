exports.Util = function() {
    ////////////////////////////////////////////////////////////////////////////////
    /// Simple helper function to shuffle an array
    ////////////////////////////////////////////////////////////////////////////////
    function shuffleArray(_array) {
        for (var index = _array.length - 1; index >= 1; index--)
        {
            var randomIndex = createRandomNumber(0, index);

            // Swap
            var tmp             = _array[index];
            _array[index]       = _array[randomIndex];
            _array[randomIndex] = tmp;
        }
    }
    ////////////////////////////////////////////////////////////////////////////////
    /// Simple helper function to create a random number between _low and _high boundaries
    ////////////////////////////////////////////////////////////////////////////////
     function createRandomNumber(_low, _high) {
        _high++;
        return Math.floor((Math.random() * (_high - _low) + _low));
    }

    return {
        shuffleArray : shuffleArray,
        createRandomNumber : createRandomNumber
    }
};
