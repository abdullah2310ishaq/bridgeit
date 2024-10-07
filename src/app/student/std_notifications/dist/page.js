'use client';
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
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var StudentNotificationsPage = function () {
    var _a = react_1.useState([]), proposals = _a[0], setProposals = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState('unread'), activeTab = _d[0], setActiveTab = _d[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        fetchProposals();
    }, []);
    var fetchProposals = function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, profileResponse, profileData, studentResponse, studentData, proposalsResponse, proposalsData, error_1;
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
                    _a.trys.push([1, 8, 9, 10]);
                    setLoading(true);
                    return [4 /*yield*/, fetch('https://localhost:7053/api/auth/authorized-user-info', {
                            method: 'GET',
                            headers: { Authorization: "Bearer " + token }
                        })];
                case 2:
                    profileResponse = _a.sent();
                    return [4 /*yield*/, profileResponse.json()];
                case 3:
                    profileData = _a.sent();
                    return [4 /*yield*/, fetch("https://localhost:7053/api/get-student/student-by-id/" + profileData.userId, { method: 'GET', headers: { Authorization: "Bearer " + token } })];
                case 4:
                    studentResponse = _a.sent();
                    return [4 /*yield*/, studentResponse.json()];
                case 5:
                    studentData = _a.sent();
                    return [4 /*yield*/, fetch("https://localhost:7053/api/project-proposals/get-proposal-for-student/" + studentData.id, { method: 'GET', headers: { Authorization: "Bearer " + token } })];
                case 6:
                    proposalsResponse = _a.sent();
                    return [4 /*yield*/, proposalsResponse.json()];
                case 7:
                    proposalsData = _a.sent();
                    setProposals(proposalsData);
                    return [3 /*break*/, 10];
                case 8:
                    error_1 = _a.sent();
                    setError('Failed to fetch proposals');
                    return [3 /*break*/, 10];
                case 9:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var handleDismissProposal = function (id) {
        setProposals(function (prev) {
            return prev.map(function (proposal) { return (proposal.id === id ? __assign(__assign({}, proposal), { read: true }) : proposal); });
        });
    };
    if (loading) {
        return react_1["default"].createElement("div", { className: "flex justify-center items-center min-h-screen" }, "Loading...");
    }
    if (error) {
        return (react_1["default"].createElement("div", { className: "flex flex-col items-center justify-center min-h-screen" },
            react_1["default"].createElement(lucide_react_1.AlertCircle, { className: "h-16 w-16 mb-4 text-red-500" }),
            react_1["default"].createElement("p", { className: "text-2xl text-red-500" }, error)));
    }
    var unreadProposals = proposals.filter(function (proposal) { return !proposal.read; });
    var readProposals = proposals.filter(function (proposal) { return proposal.read; });
    return (react_1["default"].createElement("div", { className: "min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-900" },
        react_1["default"].createElement("div", { className: "max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 text-white" },
            react_1["default"].createElement("h1", { className: "text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500" }, "Notifications"),
            react_1["default"].createElement("div", { className: "flex space-x-6 mb-6 border-b border-gray-600" },
                react_1["default"].createElement("button", { className: "py-2 px-4 focus:outline-none text-lg transition-colors duration-300 " + (activeTab === 'unread'
                        ? 'border-b-4 border-blue-500 text-blue-400'
                        : 'text-gray-400 hover:text-white'), onClick: function () { return setActiveTab('unread'); } },
                    "Unread (",
                    unreadProposals.length,
                    ")"),
                react_1["default"].createElement("button", { className: "py-2 px-4 focus:outline-none text-lg transition-colors duration-300 " + (activeTab === 'read'
                        ? 'border-b-4 border-blue-500 text-blue-400'
                        : 'text-gray-400 hover:text-white'), onClick: function () { return setActiveTab('read'); } },
                    "Read (",
                    readProposals.length,
                    ")")),
            react_1["default"].createElement("div", { className: "h-[400px] overflow-y-auto space-y-4" },
                react_1["default"].createElement(framer_motion_1.AnimatePresence, null, (activeTab === 'unread' ? unreadProposals : readProposals).map(function (proposal) { return (react_1["default"].createElement(framer_motion_1.motion.div, { key: proposal.id, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "bg-gradient-to-b from-gray-900 to-gray-800 bg-opacity-60 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300" },
                    react_1["default"].createElement("div", { className: "flex items-center mb-4" },
                        proposal.expertImageData ? (react_1["default"].createElement("img", { src: proposal.expertImageData, alt: proposal.expertFirstName + " " + proposal.expertLastName, className: "w-12 h-12 rounded-full mr-4 border-2 border-gray-600" })) : (react_1["default"].createElement("div", { className: "bg-gray-600 w-12 h-12 rounded-full mr-4" })),
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("p", { className: "text-lg font-semibold text-green-400" }, proposal.projectTitle),
                            react_1["default"].createElement("p", { className: "text-sm text-gray-300" },
                                proposal.expertFirstName,
                                " ",
                                proposal.expertLastName))),
                    react_1["default"].createElement("p", { className: "text-gray-300 mb-4" }, proposal.proposal),
                    react_1["default"].createElement("div", { className: "flex justify-between items-center" },
                        react_1["default"].createElement("span", { className: "text-sm text-gray-500 italic" }, proposal.status),
                        activeTab === 'unread' && (react_1["default"].createElement("button", { onClick: function () { return handleDismissProposal(proposal.id); }, className: "text-sm text-blue-500 hover:underline" }, "Dismiss"))))); }))))));
};
exports["default"] = StudentNotificationsPage;
