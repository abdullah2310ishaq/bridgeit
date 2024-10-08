"use client";
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
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var UniversityEventsPage = function () {
    var _a = react_1.useState([]), events = _a[0], setEvents = _a[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        function fetchEvents() {
            return __awaiter(this, void 0, void 0, function () {
                var token, response, data, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            token = localStorage.getItem('jwtToken');
                            if (!token) {
                                router.push('/auth/login-user'); // Redirect to login if token is not available
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, fetch('https://localhost:7053/api/Events/get-events', {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': "Bearer " + token
                                    }
                                })];
                        case 2:
                            response = _a.sent();
                            if (!response.ok) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.json()];
                        case 3:
                            data = _a.sent();
                            setEvents(data);
                            return [3 /*break*/, 5];
                        case 4:
                            console.error('Failed to fetch events');
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_1 = _a.sent();
                            console.error('Error fetching events:', error_1);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        fetchEvents();
    }, [router]);
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6" },
        react_1["default"].createElement("h1", { className: "text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500" }, "All University Events"),
        react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }, events.map(function (event, index) { return (react_1["default"].createElement("div", { key: event.id, className: "relative p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden bg-gradient-to-br" },
            react_1["default"].createElement("div", { className: "absolute inset-0 bg-gray-900 opacity-50" }),
            react_1["default"].createElement("div", { className: "relative z-10" },
                react_1["default"].createElement("h2", { className: "text-2xl font-bold text-white mb-4" }, event.title),
                react_1["default"].createElement("div", { className: "space-y-3" },
                    react_1["default"].createElement("p", { className: "text-gray-200 flex items-center" },
                        react_1["default"].createElement(lucide_react_1.User, { className: "w-5 h-5 mr-2 text-gray-300" }),
                        react_1["default"].createElement("span", { className: "font-semibold mr-2" }, "Speaker:"),
                        " ",
                        event.speakerName),
                    react_1["default"].createElement("p", { className: "text-gray-200 flex items-center" },
                        react_1["default"].createElement(lucide_react_1.Calendar, { className: "w-5 h-5 mr-2 text-gray-300" }),
                        react_1["default"].createElement("span", { className: "font-semibold mr-2" }, "Date:"),
                        " ",
                        new Date(event.eventDate).toLocaleDateString()),
                    react_1["default"].createElement("p", { className: "text-gray-200 flex items-center" },
                        react_1["default"].createElement(lucide_react_1.MapPin, { className: "w-5 h-5 mr-2 text-gray-300" }),
                        react_1["default"].createElement("span", { className: "font-semibold mr-2" }, "Venue:"),
                        " ",
                        event.venue))),
            react_1["default"].createElement("div", { className: "absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white bg-opacity-20 rounded-full blur-xl" }),
            react_1["default"].createElement("div", { className: "absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white bg-opacity-20 rounded-full blur-xl" }))); }))));
};
exports["default"] = UniversityEventsPage;
