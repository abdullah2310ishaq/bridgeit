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
var UserProfilePage = function () {
    var _a = react_1.useState(null), profile = _a[0], setProfile = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        var token = localStorage.getItem('jwtToken');
        if (!token) {
            router.push('/auth/login-user'); // Redirect to login if no token
            return;
        }
        var fetchUserProfile = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, userData, userId, adminResponse, adminData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, 6, 7]);
                        return [4 /*yield*/, fetch('https://localhost:7053/api/auth/authorized-user-info', {
                                method: 'GET',
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to fetch profile');
                        return [4 /*yield*/, response.json()];
                    case 2:
                        userData = _a.sent();
                        userId = userData.userId;
                        return [4 /*yield*/, fetch("https://localhost:7053/api/get-uni-admins/admins-by-id/" + userId, {
                                method: 'GET',
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 3:
                        adminResponse = _a.sent();
                        if (!adminResponse.ok)
                            throw new Error('Failed to fetch University Admin profile');
                        return [4 /*yield*/, adminResponse.json()];
                    case 4:
                        adminData = _a.sent();
                        setProfile({
                            id: adminData.userId,
                            firstName: adminData.firstName,
                            lastName: adminData.lastName,
                            email: adminData.email,
                            description: adminData.description || 'No description provided.',
                            profileImage: adminData.profileImage || '',
                            university: adminData.university || 'No university specified.',
                            officeAddress: adminData.officeAddress || 'No office address provided.',
                            contact: adminData.contact || 'No contact provided.'
                        });
                        return [3 /*break*/, 7];
                    case 5:
                        err_1 = _a.sent();
                        setError('Failed to load profile.');
                        react_toastify_1.toast.error('An error occurred while fetching your profile.');
                        return [3 /*break*/, 7];
                    case 6:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        fetchUserProfile();
    }, [router]);
    if (loading)
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "Loading...");
    if (error)
        return react_1["default"].createElement("div", { className: "text-center text-red-500" }, error);
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden" },
        react_1["default"].createElement("div", { className: "absolute inset-0 z-0" },
            react_1["default"].createElement("div", { className: "absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-30 blur-3xl" }),
            react_1["default"].createElement("div", { className: "absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-30 blur-3xl" }),
            react_1["default"].createElement("div", { className: "absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-full opacity-20 blur-2xl" })),
        react_1["default"].createElement("div", { className: "max-w-5xl w-full bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-8 md:p-10 relative z-10 transform hover:scale-105 transition-transform duration-500" },
            react_1["default"].createElement("div", { className: "flex flex-col sm:flex-row items-center justify-between mb-10" },
                react_1["default"].createElement("div", { className: "flex flex-col sm:flex-row items-center space-x-0 sm:space-x-6" },
                    react_1["default"].createElement("img", { src: "data:image/png;base64," + (profile === null || profile === void 0 ? void 0 : profile.profileImage), alt: "Profile", className: "w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-blue-500 shadow-lg transform hover:scale-110 transition-transform duration-300" }),
                    react_1["default"].createElement("div", { className: "mt-4 sm:mt-0 text-center sm:text-left" },
                        react_1["default"].createElement("h1", { className: "text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" }, profile === null || profile === void 0 ? void 0 :
                            profile.firstName,
                            " ", profile === null || profile === void 0 ? void 0 :
                            profile.lastName),
                        react_1["default"].createElement("p", { className: "text-sm sm:text-lg text-gray-300 mt-2 flex items-center justify-center sm:justify-start" },
                            react_1["default"].createElement(fa_1.FaEnvelope, { className: "mr-2 text-blue-400" }),
                            (profile === null || profile === void 0 ? void 0 : profile.email) || "---"))),
                react_1["default"].createElement("button", { onClick: function () { return router.push("/profile/edit"); }, className: "mt-6 sm:mt-0 bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-3 rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-700 transition-transform duration-300 flex items-center text-white font-semibold" },
                    react_1["default"].createElement(fa_1.FaEdit, { className: "mr-2" }),
                    " Edit Profile")),
            react_1["default"].createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8" },
                react_1["default"].createElement(InfoCard, { icon: react_1["default"].createElement(fa_1.FaBuilding, { className: "text-blue-400 text-3xl" }), title: "University", content: (profile === null || profile === void 0 ? void 0 : profile.university) || "---" }),
                react_1["default"].createElement(InfoCard, { icon: react_1["default"].createElement(fa_1.FaMapMarkerAlt, { className: "text-green-400 text-3xl" }), title: "Office Address", content: (profile === null || profile === void 0 ? void 0 : profile.officeAddress) || "---" }),
                react_1["default"].createElement(InfoCard, { icon: react_1["default"].createElement(fa_1.FaPhone, { className: "text-purple-400 text-3xl" }), title: "Contact", content: (profile === null || profile === void 0 ? void 0 : profile.contact) || "---" }),
                react_1["default"].createElement(InfoCard, { icon: react_1["default"].createElement(fa_1.FaUser, { className: "text-pink-400 text-3xl" }), title: "About Me", content: (profile === null || profile === void 0 ? void 0 : profile.description) || "---" })),
            react_1["default"].createElement(react_toastify_1.ToastContainer, null))));
};
var InfoCard = function (_a) {
    var icon = _a.icon, title = _a.title, content = _a.content;
    return (react_1["default"].createElement("div", { className: "flex items-start space-x-4 bg-gray-700 p-4 sm:p-6 rounded-lg shadow hover:shadow-lg hover:bg-gray-600 transition-transform duration-300" },
        icon,
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("h3", { className: "text-lg sm:text-xl font-semibold text-white" }, title),
            react_1["default"].createElement("p", { className: "text-sm sm:text-base text-gray-300" }, content))));
};
exports["default"] = UserProfilePage;
