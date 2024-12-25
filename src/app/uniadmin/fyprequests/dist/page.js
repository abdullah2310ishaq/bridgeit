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
var fa_1 = require("react-icons/fa");
var react_toastify_1 = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
var FypRequestsPage = function () {
    var _a = react_1.useState([]), fypRequests = _a[0], setFypRequests = _a[1];
    var _b = react_1.useState(null), adminProfile = _b[0], setAdminProfile = _b[1];
    var _c = react_1.useState(true), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState(null), error = _d[0], setError = _d[1];
    var _e = react_1.useState("All"), filter = _e[0], setFilter = _e[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        var token = localStorage.getItem("jwtToken");
        if (!token) {
            router.push("/auth/login-user");
            return;
        }
        var fetchAdminAndFyps = function () { return __awaiter(void 0, void 0, void 0, function () {
            var profileResponse, profileData, userId, adminResponse, adminData, fypResponse, fypData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, 8, 9]);
                        return [4 /*yield*/, fetch("https://localhost:7053/api/auth/authorized-user-info", {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 1:
                        profileResponse = _a.sent();
                        if (!profileResponse.ok) {
                            throw new Error("Unauthorized. Please log in again.");
                        }
                        return [4 /*yield*/, profileResponse.json()];
                    case 2:
                        profileData = _a.sent();
                        userId = profileData.userId;
                        return [4 /*yield*/, fetch("https://localhost:7053/api/get-uni-admins/admins-by-id/" + userId, {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 3:
                        adminResponse = _a.sent();
                        if (!adminResponse.ok)
                            throw new Error("Failed to fetch admin details.");
                        return [4 /*yield*/, adminResponse.json()];
                    case 4:
                        adminData = _a.sent();
                        if (!adminData.uniId)
                            throw new Error("University ID missing. Please log in again.");
                        setAdminProfile({ universityId: adminData.uniId });
                        return [4 /*yield*/, fetch("https://localhost:7053/api/uni-admin-for-fyp/get-fyps-for-uniAdmin-for-approval?uniId=" + adminData.uniId, {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 5:
                        fypResponse = _a.sent();
                        if (!fypResponse.ok)
                            throw new Error("Failed to fetch FYP requests.");
                        return [4 /*yield*/, fypResponse.json()];
                    case 6:
                        fypData = _a.sent();
                        setFypRequests(fypData);
                        return [3 /*break*/, 9];
                    case 7:
                        err_1 = _a.sent();
                        setError(err_1 instanceof Error ? err_1.message : "An unknown error occurred.");
                        return [3 /*break*/, 9];
                    case 8:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        fetchAdminAndFyps();
    }, [router]);
    var filteredRequests = fypRequests.filter(function (fyp) {
        return filter === "All" ? true : fyp.status === filter;
    });
    if (loading)
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "Loading...");
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 relative overflow-hidden" },
        react_1["default"].createElement("div", { className: "absolute inset-0 z-0" },
            react_1["default"].createElement("div", { className: "absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-30 blur-3xl" }),
            react_1["default"].createElement("div", { className: "absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-30 blur-3xl" })),
        react_1["default"].createElement("div", { className: "relative z-10 max-w-7xl mx-auto px-6" },
            react_1["default"].createElement("h1", { className: "text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-400 mb-6" }, "FYP Requests"),
            react_1["default"].createElement("div", { className: "flex justify-center space-x-4 mb-8" }, ["All", "Pending", "Approved", "Rejected"].map(function (status) { return (react_1["default"].createElement("button", { key: status, onClick: function () { return setFilter(status); }, className: "px-6 py-2 rounded-full text-lg font-semibold transition-all " + (filter === status
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white") }, status)); })),
            filteredRequests.length > 0 ? (react_1["default"].createElement("div", { className: "space-y-6" }, filteredRequests.map(function (fyp) { return (react_1["default"].createElement("div", { key: fyp.fId, onClick: function () { return router.push("/uniadmin/fyprequests/" + fyp.fId); }, className: "relative flex flex-col md:flex-row items-center bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 p-6 border border-gray-700 overflow-hidden" },
                react_1["default"].createElement("div", { className: "flex-shrink-0 w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-md" },
                    react_1["default"].createElement(fa_1.FaProjectDiagram, { className: "text-4xl text-white" })),
                react_1["default"].createElement("div", { className: "flex-grow ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left" },
                    react_1["default"].createElement("h2", { className: "text-2xl font-bold text-white mb-2" }, fyp.title),
                    react_1["default"].createElement("div", { className: "text-sm text-gray-300 space-y-1" },
                        react_1["default"].createElement("p", null,
                            react_1["default"].createElement("strong", null, "Batch:"),
                            " ",
                            fyp.batch),
                        react_1["default"].createElement("p", null,
                            react_1["default"].createElement("strong", null, "Technology:"),
                            " ",
                            fyp.technology),
                        react_1["default"].createElement("p", null,
                            react_1["default"].createElement("strong", null, "Student:"),
                            " ",
                            fyp.studentName))),
                react_1["default"].createElement("div", { className: "flex-shrink-0 mt-4 md:mt-0 py-2 px-4 rounded-full text-lg font-semibold " + (fyp.status === "Pending"
                        ? "bg-yellow-500 text-black"
                        : fyp.status === "Approved"
                            ? "bg-green-500 text-black"
                            : "bg-red-500 text-white") }, fyp.status),
                react_1["default"].createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-purple-600 via-transparent to-blue-500 opacity-0 hover:opacity-10 transition-opacity" }))); }))) : (react_1["default"].createElement("div", { className: "text-center text-gray-400 mt-10" },
                react_1["default"].createElement("p", { className: "text-lg" }, "There are no FYP requests matching the selected filter.")))),
        react_1["default"].createElement(react_toastify_1.ToastContainer, null)));
};
exports["default"] = FypRequestsPage;
