"use strict";
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
exports.startServer = exports.buildWebserver = exports.startListening = exports.addPageRoute = exports.addLastUpdateRoute = exports.addSitemapRoute = exports.addCssResetRoute = exports.cacheRouteBuild = exports.cacheRouteContent = exports.clearNodeCache = void 0;
var chokidar_1 = require("chokidar");
var express = require("express");
var fs = require("fs");
var cssReset_1 = require("./cssReset");
var otherBuilders_1 = require("./otherBuilders");
function clearNodeCache(module) {
    delete require.cache[require.resolve(module.id)];
}
exports.clearNodeCache = clearNodeCache;
//Add ability to cache built pages.
function cacheRouteContent(route, cache) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(!cache[route.key].content && route.page.content.getter)) return [3 /*break*/, 2];
                    _a = cache[route.key];
                    return [4 /*yield*/, route.page.content.getter()];
                case 1:
                    _a.content = _b.sent();
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.cacheRouteContent = cacheRouteContent;
function cacheRouteBuild(route, build, cache) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            cache[route.key].build = build;
            return [2 /*return*/];
        });
    });
}
exports.cacheRouteBuild = cacheRouteBuild;
function addCssResetRoute(server) {
    server.get("/reset.css", function (req, res) {
        res.setHeader("content-type", "text/css");
        res.send(cssReset_1.cssReset);
        res.end();
    });
}
exports.addCssResetRoute = addCssResetRoute;
function addSitemapRoute(server, routes) {
    server.get("/slamserver/sitemap", function (req, res) { return res.send("<pre>" + JSON.stringify(routes, null, 2) + "</pre>"); });
}
exports.addSitemapRoute = addSitemapRoute;
function addLastUpdateRoute(server, lastUpdate) {
    server.get("/slamserver/last-update", function (req, res) { return res.send(lastUpdate.toString()); });
}
exports.addLastUpdateRoute = addLastUpdateRoute;
function addPageRoute(route, cache, server, port) {
    var build = otherBuilders_1.buildPage(route, cache[route.key].content);
    cacheRouteBuild(route, build, cache);
    build.html = build.html.replace("</body>", otherBuilders_1.buildReloadScript(port));
    ["html", "css", "js"].forEach(function (item) {
        server.get(route.serverPaths[item], function (req, res) {
            res.setHeader("content-type", "text/" + item);
            res.send(build[item]);
            res.end();
        });
    });
}
exports.addPageRoute = addPageRoute;
function preparePage(route, cache, server, port) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cacheRouteContent(route, cache)];
                case 1:
                    _a.sent();
                    addPageRoute(route, cache, server, port);
                    return [2 /*return*/];
            }
        });
    });
}
function startListening(routes, server, port, sockets, lastUpdate, cache, clearConsole, contentOut) {
    addCssResetRoute(server);
    addLastUpdateRoute(server, lastUpdate);
    addSitemapRoute(server, routes);
    var runningServer = server.listen(port, function () {
        clearConsole && console.clear();
        console.log("Server listening at http://localhost:" + port);
        console.log("Pages:");
        routes.forEach(function (route) { return console.log("\t" + route.key + ": http://localhost:" + port + route.serverPaths.html[0]); });
        console.log("\nLast Updated:", "\x1b[36m", new Date().toLocaleString(), "\x1b[0m");
    });
    runningServer.on("connection", function (socket) { return sockets.push(socket); });
    contentOut && fs.writeFileSync(contentOut, JSON.stringify(cache, null, 2));
    return runningServer;
}
exports.startListening = startListening;
function buildWebserver(indexFile, port, cache, sockets, contentOut, clearConsole) {
    return __awaiter(this, void 0, void 0, function () {
        var lastUpdate, newServer, siteMap, routes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastUpdate = Date.now();
                    newServer = express();
                    return [4 /*yield*/, require(indexFile)["default"]()];
                case 1:
                    siteMap = _a.sent();
                    routes = otherBuilders_1.buildPageRoutes(siteMap, "/", "");
                    return [4 /*yield*/, Promise.all(routes.map(function (route) { return preparePage(route, cache, newServer, port); }))];
                case 2:
                    _a.sent();
                    addCssResetRoute(newServer);
                    addLastUpdateRoute(newServer, lastUpdate);
                    addSitemapRoute(newServer, routes);
                    return [2 /*return*/, startListening(routes, newServer, port, sockets, lastUpdate, cache, clearConsole, contentOut)];
            }
        });
    });
}
exports.buildWebserver = buildWebserver;
function startServer(indexFile, port, watchList, contentOut, clearConsole) {
    if (clearConsole === void 0) { clearConsole = true; }
    return __awaiter(this, void 0, void 0, function () {
        var cache, sockets, server, itemChanged, watcher;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cache = {};
                    sockets = [];
                    console.log("Starting server...\n");
                    return [4 /*yield*/, buildWebserver(indexFile, port, cache, sockets, contentOut, clearConsole)];
                case 1:
                    server = _a.sent();
                    itemChanged = false;
                    watcher = chokidar_1.default.watch(watchList);
                    watcher.on("change", function (path) {
                        if (itemChanged) {
                            return;
                        }
                        else {
                            var nodeCache = require.cache[require.resolve(path)];
                            nodeCache && clearNodeCache(nodeCache);
                            console.log("Change detected. Restarting server...\n");
                            server.close(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, buildWebserver(indexFile, port, cache, sockets)];
                                        case 1:
                                            server = _a.sent();
                                            itemChanged = false;
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            sockets.forEach(function (socket) { return socket.destroy(); });
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.startServer = startServer;
