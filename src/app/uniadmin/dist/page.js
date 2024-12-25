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
var UniAdminDashboard = function () {
    var _a = react_1.useState(null), adminProfile = _a[0], setAdminProfile = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        var token = localStorage.getItem('jwtToken');
        if (!token) {
            router.push('/auth/login-user'); // Redirect to login if no token
            return;
        }
        var fetchAdminProfile = function () { return __awaiter(void 0, void 0, void 0, function () {
            var profileResponse, profileData, role, userId, adminResponse, adminData, error_1;
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
                        profileResponse = _a.sent();
                        if (!profileResponse.ok) {
                            throw new Error('Failed to fetch authorized user info');
                        }
                        return [4 /*yield*/, profileResponse.json()];
                    case 2:
                        profileData = _a.sent();
                        role = profileData.role;
                        if (role !== 'UniversityAdmin') {
                            react_toastify_1.toast.error("You are not authorized to access this page.");
                            router.push('/unauthorized');
                            return [2 /*return*/];
                        }
                        userId = profileData.userId;
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
                        setAdminProfile({
                            firstName: adminData.firstName,
                            lastName: adminData.lastName,
                            email: adminData.email,
                            officeAddress: adminData.officeAddress,
                            contact: adminData.contact,
                            university: adminData.university,
                            profileImage: adminData.profileImage
                        });
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        setError('Failed to load profile');
                        react_toastify_1.toast.error("An error occurred while fetching the admin profile.");
                        console.error('Error fetching data:', error_1);
                        router.push('/unauthorized'); // Redirect if any error occurs
                        return [3 /*break*/, 7];
                    case 6:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        fetchAdminProfile();
    }, [router]);
    var handleLogout = function () {
        localStorage.removeItem('jwtToken');
        router.push('/auth/login-uniadmin'); // Redirect to login
    };
    if (loading)
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "Loading...");
    if (error)
        return react_1["default"].createElement("div", { className: "text-center text-red-500" }, error);
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white" },
        react_1["default"].createElement("div", { className: "max-w-6xl mx-auto p-8" },
            react_1["default"].createElement("div", { className: "flex justify-between items-center py-4 border-b border-gray-600 mb-6" },
                react_1["default"].createElement("h1", { className: "text-4xl font-bold" }, "University Admin Dashboard"),
                react_1["default"].createElement("button", { onClick: handleLogout, className: "bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600" }, "Logout")),
            adminProfile ? (react_1["default"].createElement("div", { className: "bg-gray-700 p-8 rounded-lg shadow-lg" },
                react_1["default"].createElement("div", { className: "flex items-center mb-6" },
                    react_1["default"].createElement("img", { src: "data:image/png;base64," + adminProfile.profileImage, alt: "Admin Profile", className: "w-28 h-28 rounded-full border-4 border-gray-600 shadow-md" }),
                    react_1["default"].createElement("div", { className: "ml-6" },
                        react_1["default"].createElement("h2", { className: "text-3xl font-bold" },
                            adminProfile.firstName,
                            " ",
                            adminProfile.lastName),
                        react_1["default"].createElement("p", { className: "text-lg text-gray-300" }, adminProfile.university),
                        react_1["default"].createElement("p", { className: "text-lg text-gray-300" }, adminProfile.email))),
                react_1["default"].createElement("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-6" },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("h3", { className: "text-xl font-semibold" }, "Office Information"),
                        react_1["default"].createElement("p", { className: "text-gray-300" },
                            react_1["default"].createElement(fa_1.FaAddressCard, { className: "inline mr-2" }),
                            " ",
                            adminProfile.officeAddress),
                        react_1["default"].createElement("p", { className: "text-gray-300" },
                            react_1["default"].createElement(fa_1.FaPhone, { className: "inline mr-2" }),
                            " ",
                            adminProfile.contact)),
                    react_1["default"].createElement("div", { className: "flex flex-col items-start space-y-4" },
                        react_1["default"].createElement("button", { onClick: function () { return router.push('uniadmin/profile/edituniadmin'); }, className: "w-full md:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 flex items-center space-x-2" },
                            react_1["default"].createElement(fa_1.FaEdit, null),
                            react_1["default"].createElement("span", null, "Edit Profile")),
                        react_1["default"].createElement("button", { onClick: function () { return router.push('uniadmin/profile'); }, className: "w-full md:w-auto bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 flex items-center space-x-2" },
                            react_1["default"].createElement(fa_1.FaEye, null),
                            react_1["default"].createElement("span", null, "View Profile")))))) : (react_1["default"].createElement("p", { className: "text-center text-red-500 mt-4" }, "No profile found")),
            react_1["default"].createElement(react_toastify_1.ToastContainer, null))));
};
exports["default"] = UniAdminDashboard;
