"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownDiff = void 0;
var generator_1 = require("./generator");
function markdownDiff(oldStr, newStr, coloring) {
    if (coloring === void 0) { coloring = false; }
    return new generator_1.Generator().exec(oldStr, newStr, coloring);
}
exports.markdownDiff = markdownDiff;
//# sourceMappingURL=index.js.map