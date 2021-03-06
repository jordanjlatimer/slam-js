"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepStyleMerge = exports.clearCache = exports.determineSimilarElementsByCss = exports.collectElementsWithCss = exports.areEqualObjects = exports.isChildless = exports.isPresentAtt = exports.toKebabCase = void 0;
function toKebabCase(value) {
    return value.split("").reduce(function (a, b) { return a + (/[A-Z]/.test(b) ? "-" + b.toLowerCase() : b); }, "");
}
exports.toKebabCase = toKebabCase;
function isPresentAtt(attName) {
    return [
        "allowfullscreen",
        "allowpaymentrequest",
        "async",
        "autofocus",
        "autoplay",
        "checked",
        "controls",
        "default",
        "defer",
        "disabled",
        "formnovalidate",
        "hidden",
        "ismap",
        "loop",
        "multiple",
        "muted",
        "novalidate",
        "open",
        "readonly",
        "required",
        "reversed",
        "selected",
        "typemustmatch",
    ].includes(attName);
}
exports.isPresentAtt = isPresentAtt;
function isChildless(tag) {
    return [
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
        "circle",
        "ellipse",
        "line",
        "path",
        "polygon",
        "polyline",
        "rect",
        "stop",
        "use",
    ].includes(tag);
}
exports.isChildless = isChildless;
function areEqualObjects(object1, object2) {
    var e_1, _a;
    if (object1 === object2) {
        return true;
    }
    var object1Keys = Object.keys(object1);
    var object2Keys = Object.keys(object2);
    if (object1Keys.length !== object2Keys.length) {
        return false;
    }
    try {
        for (var object1Keys_1 = __values(object1Keys), object1Keys_1_1 = object1Keys_1.next(); !object1Keys_1_1.done; object1Keys_1_1 = object1Keys_1.next()) {
            var key = object1Keys_1_1.value;
            if (typeof object1[key] === "object") {
                if (typeof object2[key] === "object") {
                    if (!areEqualObjects(object1[key], object2[key])) {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else if (object1[key] !== object2[key]) {
                return false;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (object1Keys_1_1 && !object1Keys_1_1.done && (_a = object1Keys_1.return)) _a.call(object1Keys_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return true;
}
exports.areEqualObjects = areEqualObjects;
function collectElementsWithCss(tree) {
    var _a, _b;
    var finalArray = [];
    if (typeof tree === "object") {
        ((_a = tree.atts) === null || _a === void 0 ? void 0 : _a.css) && finalArray.push(tree);
        (_b = tree["children"]) === null || _b === void 0 ? void 0 : _b.forEach(function (child) { return finalArray.push.apply(finalArray, __spreadArray([], __read(collectElementsWithCss(child)))); });
    }
    return finalArray;
}
exports.collectElementsWithCss = collectElementsWithCss;
function determineSimilarElementsByCss(array) {
    var identities = {};
    var identitiesIndex = 0;
    array.forEach(function (element) {
        if (identitiesIndex === 0) {
            identities[identitiesIndex] = [element];
            identitiesIndex++;
        }
        else {
            var matchFound_1 = false;
            Object.keys(identities).forEach(function (key) {
                if (!matchFound_1) {
                    identities[parseInt(key)].forEach(function (item) {
                        var _a, _b;
                        if (!matchFound_1) {
                            if (areEqualObjects(((_a = element.atts) === null || _a === void 0 ? void 0 : _a.css) || {}, ((_b = item.atts) === null || _b === void 0 ? void 0 : _b.css) || {})) {
                                identities[parseInt(key)].push(element);
                                matchFound_1 = true;
                            }
                        }
                    });
                }
            });
            if (!matchFound_1) {
                identities[identitiesIndex] = [element];
                identitiesIndex++;
            }
        }
    });
    return identities;
}
exports.determineSimilarElementsByCss = determineSimilarElementsByCss;
function clearCache(module) {
    module.children.forEach(function (child) {
        if (/node_modules/.test(child.id) || /dist/.test(child.id)) {
            return;
        }
        else {
            clearCache(child);
        }
    });
    delete require.cache[require.resolve(module.id)];
}
exports.clearCache = clearCache;
function deepStyleMerge() {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i] = arguments[_i];
    }
    var mergedObj = {};
    objs.forEach(function (obj, i) { return (Array.isArray(obj) ? (objs[i] = deepStyleMerge.apply(void 0, __spreadArray([], __read(obj)))) : (objs[i] = obj)); }); //Flatten arrays of styles
    if (objs[objs.length - 1]) {
        var deepMergeKeys_1 = new Set();
        objs.forEach(function (obj) {
            if (obj) {
                Object.keys(obj).forEach(function (key) {
                    if (obj[key] || obj[key] === 0) {
                        if (typeof obj[key] === "object") {
                            deepMergeKeys_1.add(key);
                        }
                        else {
                            mergedObj[key] = obj[key];
                        }
                    }
                });
            }
        });
        deepMergeKeys_1.forEach(function (key) {
            var objectsToMerge = [];
            objs.forEach(function (obj) { return (obj ? (obj[key] ? objectsToMerge.push(obj[key]) : undefined) : undefined); });
            //@ts-ignore
            mergedObj[key] = deepStyleMerge.apply(void 0, __spreadArray([], __read(objectsToMerge)));
        });
    }
    return mergedObj;
}
exports.deepStyleMerge = deepStyleMerge;
