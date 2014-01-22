exports.Card = function(color, value) {
    'use strict';

    if (typeof(color) === 'undefined') { throw "Parameter color is not defined!"; }
    if (typeof(value) === 'undefined') { throw "Parameter value is not defined!"; }

    var m_color = color;
    var m_value = value;

    return {
        color : m_color,
        value : m_value,
    }
};
