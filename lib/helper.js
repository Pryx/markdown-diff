"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.isTitle = function (part) {
        return !!(part.added || part.removed) && Helper.titleRegex.test(part.value);
    };
    Helper.isList = function (part) {
        return !!(part.added || part.removed) && Helper.listRegex.test(part.value);
    };
    Helper.isTable = function (part) {
        return !!(part.added || part.removed) && part.value.indexOf('|') !== -1;
    };
    Helper.titleRegex = /([\r\n\t ]*)(#+)/;
    Helper.listRegex = /^([\r\n\t ]*)(\*|-|\+|\d+\.)/;
    return Helper;
}());
exports.Helper = Helper;
//# sourceMappingURL=helper.js.map