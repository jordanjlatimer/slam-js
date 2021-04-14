"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slam = void 0;
var utils_1 = require("./utils");
var otherBuilders_1 = require("./otherBuilders");
var fs = require("fs");
var path = require("path");
var cssReset_1 = require("./cssReset");
function SlamStyleApplier(styles) {
    return function (element) {
        if (utils_1.isChildless(element.tag)) {
            return SlamStyledElement(element, styles);
        }
        else {
            return SlamStyledElement(element, styles);
        }
    };
}
function SlamPage(arg) {
    return arg;
}
function SlamPageBuilder(builderFunction) {
    return builderFunction;
}
function SlamComponent(arg) {
    return arg;
}
function SlamStyledElement(element, styles) {
    if (utils_1.isChildless(element.tag)) {
        return function (arg1) {
            var obj = otherBuilders_1.buildSlamElementObject(element.tag, arg1);
            var css = __assign(__assign(__assign({}, element.atts.css), styles), obj.atts.css);
            obj.atts.css = css;
            return obj;
        };
    }
    else {
        return function (arg1) {
            var arg2 = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                arg2[_i - 1] = arguments[_i];
            }
            var obj = otherBuilders_1.buildSlamElementObject(element.tag, arg1, arg2);
            var css = __assign(__assign(__assign({}, element.atts.css), styles), obj.atts.css);
            obj.atts.css = css;
            return obj;
        };
    }
}
function StartSlamServer(indexFile, port, watchList) {
    return __awaiter(this, void 0, void 0, function () {
        var sockets, cache, webServer;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sockets = [];
                    cache = {};
                    console.log("Starting server...\n");
                    return [4 /*yield*/, otherBuilders_1.buildWebserver(indexFile, cache, port)];
                case 1:
                    webServer = _a.sent();
                    webServer.on("connection", function (socket) { return sockets.push(socket); });
                    watchList.forEach(function (item) {
                        var itemChanged = false;
                        fs.watch(item, { recursive: true }).on("change", function () {
                            if (itemChanged) {
                                return;
                            }
                            itemChanged = true;
                            console.log("Change detected. Restarting server...\n");
                            webServer.close(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, otherBuilders_1.buildWebserver(indexFile, cache, port)];
                                        case 1:
                                            webServer = _a.sent();
                                            webServer.on("connection", function (socket) { return sockets.push(socket); });
                                            itemChanged = false;
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            sockets.forEach(function (socket) { return socket.destroy(); });
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function writeFiles(indexFile, outDir) {
    return __awaiter(this, void 0, void 0, function () {
        var pages, includeReset, builds;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, require(indexFile)["default"]()];
                case 1:
                    pages = _a.sent();
                    includeReset = pages.some(function (page) { return page.cssReset; });
                    return [4 /*yield*/, Promise.all(pages.map(function (page) { return __awaiter(_this, void 0, void 0, function () {
                            var content, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!page.content) return [3 /*break*/, 2];
                                        return [4 /*yield*/, page.content()];
                                    case 1:
                                        _a = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = undefined;
                                        _b.label = 3;
                                    case 3:
                                        content = _a;
                                        return [2 /*return*/, __assign({ name: page.name }, otherBuilders_1.buildPage(page, content))];
                                }
                            });
                        }); }))];
                case 2:
                    builds = _a.sent();
                    builds.forEach(function (build) {
                        fs.writeFileSync(path.resolve(outDir, build.name + ".html"), build.html);
                        fs.writeFileSync(path.resolve(outDir, build.name + ".css"), build.css);
                        fs.writeFileSync(path.resolve(outDir, build.name + ".js"), build.js);
                        includeReset && fs.writeFileSync(path.resolve(outDir, "reset.css"), cssReset_1.cssReset);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.Slam = {
    styleApplier: SlamStyleApplier,
    page: SlamPage,
    pageBuilder: SlamPageBuilder,
    component: SlamComponent,
    styledElement: SlamStyledElement,
    startServer: StartSlamServer,
    writeFiles: writeFiles,
};