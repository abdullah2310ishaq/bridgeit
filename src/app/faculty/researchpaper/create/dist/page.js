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
var framer_motion_1 = require("framer-motion");
var image_1 = require("next/image");
var fa_1 = require("react-icons/fa");
var react_toastify_1 = require("react-toastify");
var CreateResearchPaperPage = function () {
    var _a = react_1.useState(''), paperName = _a[0], setPaperName = _a[1];
    var _b = react_1.useState(''), category = _b[0], setCategory = _b[1];
    var _c = react_1.useState(''), publishChannel = _c[0], setPublishChannel = _c[1];
    var _d = react_1.useState(''), otherResearchers = _d[0], setOtherResearchers = _d[1];
    var _e = react_1.useState(''), link = _e[0], setLink = _e[1];
    var _f = react_1.useState(''), yearOfPublish = _f[0], setYearOfPublish = _f[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        function authorizeUserAndFetchFacultyId() {
            return __awaiter(this, void 0, void 0, function () {
                var token, userResponse, userData, userId, facultyResponse, facultyData, error_1;
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
                            _a.trys.push([1, 10, , 11]);
                            return [4 /*yield*/, fetch('https://localhost:7053/api/auth/authorized-user-info', {
                                    method: 'GET',
                                    headers: {
                                        Authorization: "Bearer " + token
                                    }
                                })];
                        case 2:
                            userResponse = _a.sent();
                            if (!userResponse.ok) return [3 /*break*/, 8];
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
                            if (!facultyResponse.ok) return [3 /*break*/, 6];
                            return [4 /*yield*/, facultyResponse.json()];
                        case 5:
                            facultyData = _a.sent();
                            localStorage.setItem('facultyId', facultyData.id); // Store facultyId in localStorage
                            return [3 /*break*/, 7];
                        case 6:
                            console.error('Failed to fetch faculty details.');
                            router.push('/unauthorized');
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            console.error('Failed to authorize user.');
                            router.push('/unauthorized');
                            _a.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            error_1 = _a.sent();
                            console.error('An error occurred:', error_1);
                            router.push('/unauthorized');
                            return [3 /*break*/, 11];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        }
        authorizeUserAndFetchFacultyId();
    }, [router]);
    var handleCreateResearchPaper = function () { return __awaiter(void 0, void 0, void 0, function () {
        var facultyId, token, response, errorText, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    facultyId = localStorage.getItem('facultyId');
                    token = localStorage.getItem('jwtToken');
                    if (!facultyId || !token) {
                        console.error('Faculty ID or token is missing');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch('https://localhost:7053/api/ResearchWork/add-researchpaper', {
                            method: 'POST',
                            headers: {
                                Authorization: "Bearer " + token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                paperName: paperName,
                                category: category,
                                publishChannel: publishChannel,
                                otherResearchers: otherResearchers,
                                link: link,
                                yearOfPublish: yearOfPublish,
                                facultyId: facultyId
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    console.log('Research paper created successfully');
                    router.push('/faculty'); // Redirect back to the faculty dashboard after research paper creation
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.text()];
                case 4:
                    errorText = _a.sent();
                    console.error('Failed to create research paper:', response.status, errorText);
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error('Error creating research paper:', error_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 relative overflow-hidden" },
        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "w-full max-w-4xl p-8 bg-gray-800 rounded-3xl shadow-2xl relative z-10" },
            react_1["default"].createElement("div", { className: "absolute top-4 left-4 z-10" },
                react_1["default"].createElement(image_1["default"], { src: "/logo.jpg", alt: "BridgeIT Logo", width: 100, height: 100 })),
            react_1["default"].createElement("h1", { className: "text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600" }, "Create New Research Paper"),
            react_1["default"].createElement("form", { onSubmit: handleCreateResearchPaper, className: "space-y-6" },
                react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Paper Name"),
                        react_1["default"].createElement("input", { type: "text", value: paperName, onChange: function (e) { return setPaperName(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", placeholder: "Research Paper Name", required: true })),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Category"),
                        react_1["default"].createElement("input", { type: "text", value: category, onChange: function (e) { return setCategory(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", placeholder: "Category", required: true }))),
                react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Publish Channel"),
                        react_1["default"].createElement("input", { type: "text", value: publishChannel, onChange: function (e) { return setPublishChannel(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", placeholder: "Publish Channel", required: true })),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Other Researchers"),
                        react_1["default"].createElement("input", { type: "text", value: otherResearchers, onChange: function (e) { return setOtherResearchers(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", placeholder: "Other Researchers" }))),
                react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Link"),
                        react_1["default"].createElement("input", { type: "text", value: link, onChange: function (e) { return setLink(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", placeholder: "Publication Link" })),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Year of Publish"),
                        react_1["default"].createElement("input", { type: "date", value: yearOfPublish, onChange: function (e) { return setYearOfPublish(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", required: true }))),
                react_1["default"].createElement("div", { className: "flex justify-center" },
                    react_1["default"].createElement("button", { type: "submit", className: "w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" }, "Create Research Paper")))),
        react_1["default"].createElement("div", { className: "absolute top-20 right-10 text-blue-400 opacity-20" },
            react_1["default"].createElement(fa_1.FaRocket, { size: 100 })),
        react_1["default"].createElement("div", { className: "absolute bottom-20 left-10 text-purple-400 opacity-20" },
            react_1["default"].createElement(fa_1.FaCode, { size: 100 })),
        react_1["default"].createElement("div", { className: "absolute top-1/2 left-5 text-green-400 opacity-20" },
            react_1["default"].createElement(fa_1.FaUsers, { size: 80 })),
        react_1["default"].createElement("div", { className: "absolute bottom-10 right-20 text-yellow-400 opacity-20" },
            react_1["default"].createElement(fa_1.FaCalendarAlt, { size: 80 })),
        react_1["default"].createElement(react_toastify_1.ToastContainer, null)));
};
exports["default"] = CreateResearchPaperPage;
