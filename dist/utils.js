"use strict";
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
    if (object1 === object2) {
        return true;
    }
    var object1Keys = Object.keys(object1);
    var object2Keys = Object.keys(object2);
    if (object1Keys.length !== object2Keys.length) {
        return false;
    }
    for (var _i = 0, object1Keys_1 = object1Keys; _i < object1Keys_1.length; _i++) {
        var key = object1Keys_1[_i];
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
    return true;
}
exports.areEqualObjects = areEqualObjects;
function collectElementsWithCss(tree) {
    var _a, _b;
    var finalArray = [];
    if (typeof tree === "object") {
        ((_a = tree.atts) === null || _a === void 0 ? void 0 : _a.css) && finalArray.push(tree);
        (_b = tree["children"]) === null || _b === void 0 ? void 0 : _b.forEach(function (child) { return finalArray.push.apply(finalArray, collectElementsWithCss(child)); });
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
    if (objs[objs.length - 1]) {
        //If the last element of the array is not undefined.
        var allKeys = new Set(//Get a set of all unique keys within the objects.
        objs.reduce(function (a, b) {
            if (b) {
                //Make sure b is not undefined
                a = a.concat(Object.keys(b));
            }
            return a;
        }, []));
        allKeys.forEach(function (key) {
            var mergedValue;
            var needsDeepMerge = false;
            objs.forEach(function (obj) {
                if (obj) {
                    //Make sure the object is not undefined.
                    if (obj[key]) {
                        //Check if the property exists on the object.
                        if (typeof obj[key] === "object") {
                            needsDeepMerge = true; //If the property is itself an object, we need to perform a deep merge before assigning it to mergedValue.
                        }
                        else {
                            mergedValue = obj[key]; //Otherwise, we can assign it to the merged value
                        }
                    }
                }
                else {
                    mergedValue = undefined; //If the object is undefined, then the merged value should be "zeroed out", so to speak.
                }
            });
            if (needsDeepMerge) {
                var allDeepObjects = objs.map(function (obj) {
                    //Get a list of objects to perform a deep merge on.
                    if (obj) {
                        if (typeof obj === "object") {
                            if (obj.hasOwnProperty(key)) {
                                //Check if the property actually exists, and is not actually assigned "undefined"
                                return obj[key];
                            }
                            else {
                                return {};
                            }
                        }
                    }
                    else {
                        return undefined;
                    }
                });
                mergedValue = deepStyleMerge.apply(void 0, allDeepObjects);
            }
            if (mergedValue) {
                //Has the merged value been assigned a value other than undefined?
                if (typeof mergedValue === "object") {
                    if (Object.keys(mergedValue).length > 0) {
                        //Is the merged value an object and has keys?
                        mergedObj[key] = mergedValue; //Then assign it to the final mergedObj
                    }
                }
                else {
                    mergedObj[key] = mergedValue; //If the value is not an object or undefined, assign it to the final mergedObj.
                }
            }
        });
    }
    return mergedObj;
}
exports.deepStyleMerge = deepStyleMerge;
