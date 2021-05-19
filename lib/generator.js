"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
var JsDiff = require("diff");
var helper_1 = require("./helper");
var Generator = /** @class */ (function () {
    function Generator() {
    }
    /**
     * exec
     */
    Generator.prototype.exec = function (oldString, newString, coloring) {
        var e_1, _a;
        if (coloring === void 0) { coloring = false; }
        var output = [];
        var parts = JsDiff.diffWordsWithSpace(oldString, newString);
        for (var i = 0; i < parts.length; i++) {
            var value = parts[i].value;
            var prefix = parts[i].added ? "<ins>" : parts[i].removed ? "<del>" : '';
            var posfix = parts[i].added ? '</ins>' : parts[i].removed ? '</del>' : '';
            //If normal text, check if we can combine it
            var added = "";
            var removed = "";
            var testsplit = value.split("\n");
            if (testsplit.length > 1) {
                for (var j = 0; j < testsplit.length; j++) {
                    var line = testsplit[j];
                    if (helper_1.Helper.titleRegex.test(line)) {
                        //If title, diff it with titleDiff and push to output
                        line = this.titleDiff(line, prefix, posfix);
                    }
                    else if (line.indexOf('|') !== -1) {
                        //If table, diff it with tableDiff and push to output
                        line = this.tableDiff(line, prefix, posfix);
                    }
                    else if (helper_1.Helper.listRegex.test(line)) {
                        line = this.listDiff(line, prefix, posfix);
                    }
                    var last = j == testsplit.length - 1;
                    if (line == testsplit[j] && line.length) {
                        if (parts[i].removed) {
                            output.push("<del>" + line + "</del>" + (!last ? "\n" : ''));
                        }
                        else if (parts[i].added) {
                            output.push("<ins>" + line + "</ins>" + (!last ? "\n" : ''));
                        }
                        else {
                            output.push(line + (!last ? "\n" : ''));
                        }
                    }
                    else {
                        output.push(line + (!last ? "\n" : ''));
                    }
                }
            }
            else {
                if (helper_1.Helper.isTitle(parts[i])) {
                    //If title, diff it with titleDiff and push to output
                    output.push(this.titleDiff(value, prefix, posfix));
                }
                else if (helper_1.Helper.isTable(parts[i])) {
                    //If table, diff it with tableDiff and push to output
                    output.push(this.tableDiff(value, prefix, posfix));
                }
                else if (helper_1.Helper.isList(parts[i])) {
                    //If list, diff it with listDiff and push to output
                    output.push(this.listDiff(value, prefix, posfix));
                }
                else if (parts[i].removed || parts[i].added) {
                    //Iterate over parts
                    for (; i < parts.length; i++) {
                        //We found special item! Backtrack and break the cycle
                        if (helper_1.Helper.isTitle(parts[i]) ||
                            helper_1.Helper.isTable(parts[i]) ||
                            helper_1.Helper.isList(parts[i])) {
                            i--;
                            break;
                        }
                        if (parts[i].value.indexOf("\n") !== -1) {
                            var tmpsplit = parts[i].value.split("\n");
                            if (tmpsplit.length > 1) {
                                i--;
                                break;
                            }
                        }
                        if (parts[i].value.trim().length == 0) {
                            //If whitespace, just add it to both, we don't care. Works well enough
                            added += parts[i].value;
                            removed += parts[i].value;
                        }
                        else if (parts[i].added) {
                            //If added, just add it to added
                            added += parts[i].value;
                        }
                        else if (parts[i].removed) {
                            //Ditto but for removed :)
                            removed += parts[i].value;
                        }
                        else {
                            // We found something that is not added, removed or whitespace. Let's break this cycle
                            i--;
                            break;
                        }
                    }
                    if (removed.length) {
                        removed = "<del>" + removed + "</del>";
                        removed = removed.replace(/<del><\/del>/g, '');
                        output.push(removed);
                    }
                    if (added.length) {
                        added = "<ins>" + added + "</ins>";
                        added = added.replace(/<ins><\/ins>/g, '');
                        output.push(added);
                    }
                }
                else {
                    output.push(parts[i].value);
                }
            }
        }
        var regexImgFix = /(<(img|br).*[\/]?>)/gm;
        var linksFix = /(!?\[.*?\]\(.*?\))/gm;
        var out = output.join('');
        var links = __spread(out.matchAll(linksFix));
        var imgbr = __spread(out.matchAll(regexImgFix));
        var found = imgbr.concat(links);
        try {
            for (var _b = __values(found.map(function (m) { return m[1]; })), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (elem.includes('<del') || elem.includes('<ins')) {
                    var original = elem.replace(/<del.*?>(.*?)<\/del>/g, '$1').replace(/<ins.*?\/ins>/g, '');
                    var modified = elem.replace(/<ins.*?>(.*?)<\/ins>/g, '$1').replace(/<del.*?\/del>/g, '');
                    original = original.replace(/<[\/]?del.*?>/g, '').replace(/<[\/]?ins.*?>/g, '');
                    modified = modified.replace(/<[\/]?ins.*?>/g, '').replace(/<[\/]?del.*?>/g, '');
                    out = out.replace(elem, "<del>" + original + "</del><ins>" + modified + "</ins>");
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return out;
    };
    Generator.prototype.titleDiff = function (value, prefix, posfix) {
        var out = [];
        var match = Generator.titleRegexWithContent.exec(value);
        while (match !== null) {
            var spaces = match[1];
            var listOp = match[2];
            var afterOpSpaces = match[3];
            var content = match[4];
            out.push("" + spaces + listOp + afterOpSpaces + prefix + content + posfix);
            match = Generator.titleRegexWithContent.exec(value);
        }
        if (value.endsWith("\n")) {
            return out.join('\n') + '\n'; // preserve ending newline
        }
        else {
            return out.join('\n');
        }
    };
    Generator.prototype.listDiff = function (value, prefix, posfix) {
        var out = [];
        var match = Generator.listRegexWithContent.exec(value);
        while (match !== null) {
            var spaces = match[1];
            var listOp = match[2];
            var afterOpSpaces = match[3];
            var content = match[4];
            out.push("" + spaces + listOp + afterOpSpaces + prefix + content + posfix);
            match = Generator.listRegexWithContent.exec(value);
        }
        return out.join('\n');
    };
    Generator.prototype.tableDiff = function (value, prefix, posfix) {
        var e_2, _a;
        var out = [];
        var split = value.split('|');
        var startWithPipe = split[0].length === 0 ? '|' : '';
        var endsWithPipe = split[split.length - 1].length === 0 ? '|' : '';
        var filtered = split.filter(function (el) { return el.length !== 0; });
        if (filtered.length) {
            try {
                for (var filtered_1 = __values(filtered), filtered_1_1 = filtered_1.next(); !filtered_1_1.done; filtered_1_1 = filtered_1.next()) {
                    var val = filtered_1_1.value;
                    out.push("" + prefix + val + posfix);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (filtered_1_1 && !filtered_1_1.done && (_a = filtered_1.return)) _a.call(filtered_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return startWithPipe + out.join('|') + endsWithPipe;
        }
        return value;
    };
    Generator.listRegexWithContent = /^([\r\n\t ]*)(\*|-|\+|\d+\.)([ ]*)(.*)$/gm;
    Generator.titleRegexWithContent = /^([\r\n\t ]*)(#+)([ ]*)(.*)$/gm;
    return Generator;
}());
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map