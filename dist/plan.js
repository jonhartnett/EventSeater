"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var guestCount = 10000;
var tableSize = 10;
var tableCount = 1500;
var positiveSaturation = .10;
var negativeSaturation = .25;

var plan = {};

plan.guests = new Array(guestCount).fill(null).map(function (_, i) {
    return i;
});
plan.tableSize = tableSize;
plan.tableCount = tableCount;
plan.positive = generateConstraints(guestCount * positiveSaturation);
plan.negative = generateConstraints(guestCount * negativeSaturation);

function generateConstraints(count) {
    var con = new Set();
    while (con.size < count) {
        var g1 = Math.floor(Math.random() * guestCount);
        var g2 = void 0;
        do {
            g2 = Math.floor(Math.random() * guestCount);
        } while (g2 === g1);
        if (g1 > g2) {
            ;
            var _ref = [g2, g1];
            g1 = _ref[0];
            g2 = _ref[1];
        }con.add(g1 + g2 * guestCount);
    }
    return [].concat(_toConsumableArray(con)).map(function (id) {
        return [id % guestCount, Math.floor(id / guestCount)];
    });
}

exports.default = plan;
//# sourceMappingURL=plan.js.map