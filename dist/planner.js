"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plan = require("./plan.json");

var _plan2 = _interopRequireDefault(_plan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var errors = {
    TOO_MANY_GUESTS: "TOO_MANY_GUESTS",
    IMPOSSIBLE_POSITIVE: "IMPOSSIBLE_POSITIVE",
    IMPOSSIBLE_NEGATIVE: "IMPOSSIBLE_NEGATIVE",

    IMPOSSIBLE: "IMPOSSIBLE",
    POSITIVE_UNSATISFIED: "POSITIVE_UNSATISFIED",
    NEGATIVE_UNSATISFIED: "NEGATIVE_UNSATISFIED"
};

var Planner = function () {
    function Planner(plan) {
        _classCallCheck(this, Planner);

        this.guests = plan.guests;
        this.tableSize = plan.tableSize;
        this.tableCount = plan.tableCount;
        this.positive = plan.positive;
        this.negative = plan.negative;
    }

    _createClass(Planner, [{
        key: "plan",
        value: function plan() {
            var generationSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 25;
            var generationCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

            this.validateGuests();
            this.groupGuests();
            this.validateGroups();
            this.groupNegative();
            var solution = this.solve(generationSize, generationCount);
            this.validate(solution);
            return solution;
        }
    }, {
        key: "negToID",
        value: function negToID(a, b) {
            return a + b * this.groups.length;
        }
    }, {
        key: "idToNeg",
        value: function idToNeg(id) {
            return [id % this.groups.length, Math.floor(id / this.groups.length)];
        }
    }, {
        key: "isNeg",
        value: function isNeg(a, b) {
            return this.gNegativeSet.has(this.negToID(a, b));
        }
    }, {
        key: "validateGuests",
        value: function validateGuests() {
            if (this.guests.length > this.tableSize * this.tableCount) throw errors.TOO_MANY_GUESTS;
        }
    }, {
        key: "groupGuests",
        value: function groupGuests() {
            var handled = new Set();
            this.groups = [];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.guests[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var guest = _step.value;

                    if (handled.has(guest)) continue;
                    var group = [];
                    this.exploreGroup(group, handled, guest);
                    this.groups.push(group);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "exploreGroup",
        value: function exploreGroup(group, handled, guest) {
            group.push(guest);
            handled.add(guest);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.positive[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var pos = _step2.value;

                    var _pos = _slicedToArray(pos, 2),
                        one = _pos[0],
                        two = _pos[1];

                    if (guest === two) {
                        ;
                        var _ref = [two, one];
                        one = _ref[0];
                        two = _ref[1];
                    }if (guest === one && !handled.has(two)) this.exploreGroup(group, handled, two);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "validateGroups",
        value: function validateGroups() {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.groups[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var group = _step3.value;

                    if (group.length > this.tableSize) throw errors.IMPOSSIBLE_POSITIVE;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }, {
        key: "groupNegative",
        value: function groupNegative() {
            var lookup = Object.create(null);
            var i = 0;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.groups[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var group = _step4.value;
                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = group[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var guest = _step7.value;

                            lookup[guest] = i;
                        }
                    } catch (err) {
                        _didIteratorError7 = true;
                        _iteratorError7 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                _iterator7.return();
                            }
                        } finally {
                            if (_didIteratorError7) {
                                throw _iteratorError7;
                            }
                        }
                    }

                    i++;
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            this.gNegativeSet = new Set();

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.negative[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var negative = _step5.value;

                    var g1 = lookup[negative[0]];
                    var g2 = lookup[negative[1]];
                    if (g1 === g2) throw errors.IMPOSSIBLE_NEGATIVE;
                    if (g1 > g2) {
                        ;
                        var _ref2 = [g2, g1];
                        g1 = _ref2[0];
                        g2 = _ref2[1];
                    }this.gNegativeSet.add(this.negToID(g1, g2));
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            this.gNegative = [];
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this.gNegativeSet[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var con = _step6.value;

                    this.gNegative.push(this.idToNeg(con));
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }
        }
    }, {
        key: "solve",
        value: function solve(generationSize, generationCount) {
            var _this = this;

            var solution = null;
            try {
                (function () {
                    var generation = new Array(generationSize).fill(null).map(function () {
                        var tables = _this.randomArrangement();
                        var score = _this.score(tables);
                        return { tables: tables, score: score };
                    });
                    var genIndex = 0;

                    while (++genIndex < generationCount) {
                        generation = generation.concat(new Array(generationSize).fill(null).map(function () {
                            var tables = _this.descendant(generation);
                            var score = _this.score(tables);
                            return { tables: tables, score: score };
                        }));
                        generation.sort(function (a, b) {
                            if (a.score > b.score) return -1;else return 1;
                        });
                        generation.splice(generationSize, generationSize);
                    }

                    solution = generation[0];
                })();
            } catch (ex) {
                if (ex instanceof Array) solution = ex;else throw ex;
            }
            return solution.map(function (table) {
                var _ref3;

                return (_ref3 = []).concat.apply(_ref3, _toConsumableArray(table.map(function (g) {
                    return _this.groups[g];
                })));
            });
        }
    }, {
        key: "capacity",
        value: function capacity(table) {
            var remaining = this.tableSize;
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = table[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var i = _step8.value;

                    remaining -= this.groups[i].length;
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            return remaining;
        }
    }, {
        key: "randomArrangement",
        value: function randomArrangement() {
            var tries = 10;
            while (tries-- > 0) {
                try {
                    var tables = new Array(this.tableCount).fill(null).map(function () {
                        return [];
                    });
                    for (var i = 0; i < this.groups.length; i++) {
                        this.randomInsert(i, tables);
                    }return tables;
                } catch (ex) {
                    if (ex !== 'impossible') throw ex;
                }
            }
            throw errors.IMPOSSIBLE;
        }
    }, {
        key: "randomInsert",
        value: function randomInsert(group, tables) {
            var _this2 = this;

            var r = Math.floor(Math.random() * this.tableCount);
            if (this.capacity(tables[r]) >= this.groups[group].length) {
                tables[r].push(group);
            } else {
                var possibles = tables.filter(function (table) {
                    return _this2.capacity(table) >= _this2.groups[group].length;
                });
                if (possibles.length === 0) throw 'impossible';
                r = Math.floor(Math.random() * possibles.length);
                possibles[r].push(group);
            }
        }
    }, {
        key: "descendant",
        value: function descendant(generation) {
            var max = generation.reduce(function (a, item) {
                return a + item.score;
            }, 0);
            var tries = 10;
            while (tries-- > 0) {
                try {
                    var r = Math.floor(Math.random() * max) + 1;
                    var tables = void 0;
                    var _iteratorNormalCompletion9 = true;
                    var _didIteratorError9 = false;
                    var _iteratorError9 = undefined;

                    try {
                        for (var _iterator9 = generation[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                            var item = _step9.value;

                            r -= item.score;
                            if (r <= 0) {
                                tables = item.tables;
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError9 = true;
                        _iteratorError9 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                _iterator9.return();
                            }
                        } finally {
                            if (_didIteratorError9) {
                                throw _iteratorError9;
                            }
                        }
                    }

                    return this.mutation(tables);
                } catch (ex) {
                    if (ex !== 'impossible') throw ex;
                }
            }
            throw errors.IMPOSSIBLE;
        }
    }, {
        key: "mutation",
        value: function mutation(tables) {
            var tries = 3;
            while (tries-- > 0) {
                try {
                    tables = tables.map(function (table) {
                        return [].concat(_toConsumableArray(table));
                    });
                    var problems = [];
                    var _iteratorNormalCompletion10 = true;
                    var _didIteratorError10 = false;
                    var _iteratorError10 = undefined;

                    try {
                        for (var _iterator10 = tables[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                            var table = _step10.value;

                            for (var _i = 0; _i < table.length; _i++) {
                                for (var j = _i + 1; j < table.length; j++) {
                                    if (this.isNeg(table[_i], table[j])) {
                                        problems.push(table[_i], table[j]);
                                        table.splice(j, 1);
                                        table.splice(_i, 1);
                                        _i--;
                                        break;
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError10 = true;
                        _iteratorError10 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                _iterator10.return();
                            }
                        } finally {
                            if (_didIteratorError10) {
                                throw _iteratorError10;
                            }
                        }
                    }

                    var r = Math.random() * (this.groups.length - problems.length);
                    var i = 0;
                    var _iteratorNormalCompletion11 = true;
                    var _didIteratorError11 = false;
                    var _iteratorError11 = undefined;

                    try {
                        for (var _iterator11 = tables[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                            var _table = _step11.value;

                            if (r < _table.length) {
                                var group = _table.splice(r, 1)[0];
                                do {
                                    r = Math.random() * tables.length;
                                } while (r === i);
                                tables[r].push(group);
                            }
                            r -= _table.length;
                            i++;
                        }
                    } catch (err) {
                        _didIteratorError11 = true;
                        _iteratorError11 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                _iterator11.return();
                            }
                        } finally {
                            if (_didIteratorError11) {
                                throw _iteratorError11;
                            }
                        }
                    }

                    var _iteratorNormalCompletion12 = true;
                    var _didIteratorError12 = false;
                    var _iteratorError12 = undefined;

                    try {
                        for (var _iterator12 = problems[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                            var problem = _step12.value;

                            this.randomInsert(problem, tables);
                        }
                    } catch (err) {
                        _didIteratorError12 = true;
                        _iteratorError12 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion12 && _iterator12.return) {
                                _iterator12.return();
                            }
                        } finally {
                            if (_didIteratorError12) {
                                throw _iteratorError12;
                            }
                        }
                    }

                    return tables;
                } catch (ex) {
                    if (ex !== 'impossible') throw ex;
                }
            }
            throw 'impossible';
        }
    }, {
        key: "score",
        value: function score(tables) {
            var score = this.gNegativeSet.size;
            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
                for (var _iterator13 = tables[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                    var table = _step13.value;

                    for (var i = 0; i < table.length; i++) {
                        for (var j = i + 1; j < table.length; j++) {
                            if (this.isNeg(table[i], table[j])) {
                                score--;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError13 = true;
                _iteratorError13 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion13 && _iterator13.return) {
                        _iterator13.return();
                    }
                } finally {
                    if (_didIteratorError13) {
                        throw _iteratorError13;
                    }
                }
            }

            if (score === this.gNegativeSet.size) throw tables;
            return score + 1;
        }
    }, {
        key: "validate",
        value: function validate(tables) {
            var guestToTable = Object.create(null);
            var i = 0;
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
                for (var _iterator14 = tables[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                    var table = _step14.value;
                    var _iteratorNormalCompletion17 = true;
                    var _didIteratorError17 = false;
                    var _iteratorError17 = undefined;

                    try {
                        for (var _iterator17 = table[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                            var guest = _step17.value;

                            guestToTable[guest] = i;
                        }
                    } catch (err) {
                        _didIteratorError17 = true;
                        _iteratorError17 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion17 && _iterator17.return) {
                                _iterator17.return();
                            }
                        } finally {
                            if (_didIteratorError17) {
                                throw _iteratorError17;
                            }
                        }
                    }

                    i++;
                }
            } catch (err) {
                _didIteratorError14 = true;
                _iteratorError14 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion14 && _iterator14.return) {
                        _iterator14.return();
                    }
                } finally {
                    if (_didIteratorError14) {
                        throw _iteratorError14;
                    }
                }
            }

            var _iteratorNormalCompletion15 = true;
            var _didIteratorError15 = false;
            var _iteratorError15 = undefined;

            try {
                for (var _iterator15 = this.positive[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                    var pos = _step15.value;

                    if (guestToTable[pos[0]] !== guestToTable[pos[1]]) throw errors.POSITIVE_UNSATISFIED;
                }
            } catch (err) {
                _didIteratorError15 = true;
                _iteratorError15 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion15 && _iterator15.return) {
                        _iterator15.return();
                    }
                } finally {
                    if (_didIteratorError15) {
                        throw _iteratorError15;
                    }
                }
            }

            var _iteratorNormalCompletion16 = true;
            var _didIteratorError16 = false;
            var _iteratorError16 = undefined;

            try {
                for (var _iterator16 = this.negative[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                    var neg = _step16.value;

                    if (guestToTable[neg[0]] === guestToTable[neg[1]]) throw errors.NEGATIVE_UNSATISFIED;
                }
            } catch (err) {
                _didIteratorError16 = true;
                _iteratorError16 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion16 && _iterator16.return) {
                        _iterator16.return();
                    }
                } finally {
                    if (_didIteratorError16) {
                        throw _iteratorError16;
                    }
                }
            }
        }
    }]);

    return Planner;
}();

var planner = new Planner(_plan2.default);
console.log(planner.plan());
//# sourceMappingURL=planner.js.map