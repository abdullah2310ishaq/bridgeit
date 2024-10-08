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
var FacultyResearchWorkPage = function () {
    var _a = react_1.useState([]), researchPapers = _a[0], setResearchPapers = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        function fetchFacultyAndResearchPapers() {
            return __awaiter(this, void 0, void 0, function () {
                var token, userResponse, userData, userId, facultyResponse, facultyData, facultyId, researchResponse, researchData, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            token = localStorage.getItem('jwtToken');
                            if (!token) {
                                router.push('/auth/login-user');
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 14, 15, 16]);
                            return [4 /*yield*/, fetch('https://localhost:7053/api/auth/authorized-user-info', {
                                    method: 'GET',
                                    headers: {
                                        Authorization: "Bearer " + token
                                    }
                                })];
                        case 2:
                            userResponse = _a.sent();
                            if (!userResponse.ok) return [3 /*break*/, 12];
                            return [4 /*yield*/, userResponse.json()];
                        case 3:
                            userData = _a.sent();
                            userId = userData.userId;
                            return [4 /*yield*/, fetch("https://localhost:7053/api/get-faculty/faculty-by-id/" + userId, {
                                    method: 'GET',
                                    headers: {
                                        Authorization: "Bearer " + token
                                    }
                                })];
                        case 4:
                            facultyResponse = _a.sent();
                            if (!facultyResponse.ok) return [3 /*break*/, 10];
                            return [4 /*yield*/, facultyResponse.json()];
                        case 5:
                            facultyData = _a.sent();
                            facultyId = facultyData.id;
                            return [4 /*yield*/, fetch("https://localhost:7053/api/ResearchWork/get-researchwork-by-id/" + facultyId, {
                                    method: 'GET',
                                    headers: {
                                        Authorization: "Bearer " + token
                                    }
                                })];
                        case 6:
                            researchResponse = _a.sent();
                            if (!researchResponse.ok) return [3 /*break*/, 8];
                            return [4 /*yield*/, researchResponse.json()];
                        case 7:
                            researchData = _a.sent();
                            setResearchPapers(researchData);
                            return [3 /*break*/, 9];
                        case 8:
                            console.error('Failed to fetch research papers');
                            _a.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            console.error('Failed to fetch faculty information');
                            router.push('/unauthorized');
                            _a.label = 11;
                        case 11: return [3 /*break*/, 13];
                        case 12:
                            console.error('Failed to fetch user information');
                            router.push('/unauthorized');
                            _a.label = 13;
                        case 13: return [3 /*break*/, 16];
                        case 14:
                            error_1 = _a.sent();
                            console.error('Error fetching data:', error_1);
                            router.push('/unauthorized');
                            return [3 /*break*/, 16];
                        case 15:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 16: return [2 /*return*/];
                    }
                });
            });
        }
        fetchFacultyAndResearchPapers();
    }, [router]);
    if (loading) {
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "Loading...");
    }
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 flex flex-col items-center" },
        react_1["default"].createElement("h2", { className: "text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-12 text-center" }, "Research Work"),
        react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 w-full" }, researchPapers.length > 0 ? (researchPapers.map(function (paper) { return (react_1["default"].createElement("div", { key: paper.id, className: "bg-gradient-to-br from-gray-800 to-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 transform border border-gray-600 group" },
            react_1["default"].createElement("div", { className: "relative" },
                react_1["default"].createElement(lucide_react_1.Award, { className: "absolute top-0 right-0 w-8 h-8 text-yellow-400 opacity-50 group-hover:opacity-100 transition-opacity duration-300" }),
                react_1["default"].createElement("h3", { className: "text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 pr-10" }, paper.paperName)),
            react_1["default"].createElement("div", { className: "space-y-4" },
                react_1["default"].createElement("p", { className: "text-gray-300 flex items-center bg-gray-800 rounded-lg p-2 group-hover:bg-gray-700 transition-colors duration-300" },
                    react_1["default"].createElement(lucide_react_1.Book, { className: "w-5 h-5 mr-3 text-purple-400" }),
                    react_1["default"].createElement("span", { className: "text-purple-300 font-semibold mr-2" }, "Category:"),
                    " ",
                    paper.category),
                react_1["default"].createElement("p", { className: "text-gray-300 flex items-center bg-gray-800 rounded-lg p-2 group-hover:bg-gray-700 transition-colors duration-300" },
                    react_1["default"].createElement(lucide_react_1.ExternalLink, { className: "w-5 h-5 mr-3 text-green-400" }),
                    react_1["default"].createElement("span", { className: "text-green-300 font-semibold mr-2" }, "Publish Channel:"),
                    " ",
                    paper.publishChannel),
                react_1["default"].createElement("p", { className: "text-gray-300 flex items-center bg-gray-800 rounded-lg p-2 group-hover:bg-gray-700 transition-colors duration-300" },
                    react_1["default"].createElement(lucide_react_1.Calendar, { className: "w-5 h-5 mr-3 text-yellow-400" }),
                    react_1["default"].createElement("span", { className: "text-yellow-300 font-semibold mr-2" }, "Year of Publish:"),
                    " ",
                    paper.yearOfPublish),
                react_1["default"].createElement("p", { className: "text-blue-400 flex items-center bg-gray-800 rounded-lg p-2 group-hover:bg-gray-700 transition-colors duration-300" },
                    react_1["default"].createElement(lucide_react_1.ExternalLink, { className: "w-5 h-5 mr-3" }),
                    react_1["default"].createElement("span", { className: "font-semibold mr-2" }, "Publication:"),
                    react_1["default"].createElement("a", { href: paper.link, target: "_blank", rel: "noopener noreferrer", className: "ml-2 underline hover:text-blue-300 transition-colors duration-300" }, "View Paper")),
                react_1["default"].createElement("p", { className: "text-gray-300 flex items-start bg-gray-800 rounded-lg p-2 group-hover:bg-gray-700 transition-colors duration-300" },
                    react_1["default"].createElement(lucide_react_1.Users, { className: "w-5 h-5 mr-3 mt-1 text-pink-400" }),
                    react_1["default"].createElement("span", null,
                        react_1["default"].createElement("span", { className: "text-pink-300 font-semibold" }, "Other Researchers:"),
                        " ",
                        paper.otherResearchers))))); })) : (react_1["default"].createElement("p", { className: "text-gray-400 text-center col-span-full text-xl" }, "No research papers available.")))));
};
exports["default"] = FacultyResearchWorkPage;
