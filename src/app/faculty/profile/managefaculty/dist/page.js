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
var react_toastify_1 = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
var image_1 = require("next/image");
var FacultyProfileManagement = function () {
    var _a = react_1.useState(''), currentPassword = _a[0], setCurrentPassword = _a[1];
    var _b = react_1.useState(''), newPassword = _b[0], setNewPassword = _b[1];
    var _c = react_1.useState(''), imageData = _c[0], setImageData = _c[1];
    var _d = react_1.useState(null), userId = _d[0], setUserId = _d[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        var token = localStorage.getItem('jwtToken');
        if (!token) {
            router.push('/auth/login-user');
            return;
        }
        function fetchUserProfile() {
            return __awaiter(this, void 0, void 0, function () {
                var profileResponse, profileData, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, fetch('https://localhost:7053/api/auth/authorized-user-info', {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': "Bearer " + token
                                    }
                                })];
                        case 1:
                            profileResponse = _a.sent();
                            if (!profileResponse.ok) return [3 /*break*/, 3];
                            return [4 /*yield*/, profileResponse.json()];
                        case 2:
                            profileData = _a.sent();
                            setUserId(profileData.userId);
                            return [3 /*break*/, 4];
                        case 3:
                            react_toastify_1.toast.error('Failed to fetch user profile.', {
                                position: 'top-center',
                                autoClose: 3000
                            });
                            router.push('/auth/login-user');
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_1 = _a.sent();
                            react_toastify_1.toast.error('An error occurred while fetching the user profile.', {
                                position: 'top-center',
                                autoClose: 3000
                            });
                            router.push('/auth/login-user');
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
        fetchUserProfile();
    }, [router]);
    var handlePasswordChange = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var token, confirmResponse, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!userId)
                        return [2 /*return*/];
                    token = localStorage.getItem('jwtToken');
                    if (!token)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("https://localhost:7053/api/edit-user-profile/confirm-current-password/" + userId, {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer " + token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(currentPassword)
                        })];
                case 2:
                    confirmResponse = _a.sent();
                    if (!confirmResponse.ok) {
                        react_toastify_1.toast.error("Current password is incorrect.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("https://localhost:7053/api/edit-user-profile/change-password/" + userId, {
                            method: 'PUT',
                            headers: {
                                'Authorization': "Bearer " + token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(newPassword)
                        })];
                case 3:
                    response = _a.sent();
                    if (response.ok) {
                        react_toastify_1.toast.success("Password changed successfully!");
                    }
                    else {
                        react_toastify_1.toast.error("Failed to change password.");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    react_toastify_1.toast.error("An error occurred. Please try again later.");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleImageChange = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            var reader_1 = new FileReader();
            reader_1.onloadend = function () {
                setImageData(reader_1.result);
            };
            reader_1.readAsDataURL(file);
        }
    };
    var handleImageUpload = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var token, base64Image, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!userId || !imageData)
                        return [2 /*return*/];
                    token = localStorage.getItem('jwtToken');
                    if (!token)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    base64Image = imageData.split(",")[1];
                    return [4 /*yield*/, fetch("https://localhost:7053/api/edit-user-profile/set-profile-image/" + userId, {
                            method: 'PUT',
                            headers: {
                                'Authorization': "Bearer " + token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(base64Image)
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        react_toastify_1.toast.success("Profile image updated successfully!");
                    }
                    else {
                        react_toastify_1.toast.error("Failed to update profile image.");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    react_toastify_1.toast.error("An error occurred. Please try again later.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: "min-h-screen flex flex-col lg:flex-row items-center justify-between bg-gray-900 text-gray-200 p-8 space-x-8" },
        react_1["default"].createElement("div", { className: "flex flex-col items-center lg:items-start lg:ml-16" },
            react_1["default"].createElement("h1", { className: "text-6xl font-extrabold text-white mb-4 flex items-center" },
                react_1["default"].createElement(image_1["default"], { src: "/logo.jpg", alt: "Logo", width: 100, height: 100, className: "mx-4" }),
                react_1["default"].createElement("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" }, "Manage"),
                react_1["default"].createElement("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 ml-2" }, "Profile")),
            react_1["default"].createElement("div", { className: "mt-6" },
                react_1["default"].createElement(image_1["default"], { src: "/editpr.png", alt: "Edit Profile", width: 400, height: 300, className: "rounded-lg" }))),
        react_1["default"].createElement("div", { className: "w-full lg:max-w-xl p-6 rounded-lg shadow-lg bg-gray-800" },
            react_1["default"].createElement("h1", { className: "text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8" }, "Profile Management"),
            react_1["default"].createElement("form", { onSubmit: handlePasswordChange, className: "space-y-6" },
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300" }, "Current Password"),
                    react_1["default"].createElement("input", { type: "password", value: currentPassword, onChange: function (e) { return setCurrentPassword(e.target.value); }, className: "mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300" }, "New Password"),
                    react_1["default"].createElement("input", { type: "password", value: newPassword, onChange: function (e) { return setNewPassword(e.target.value); }, className: "mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })),
                react_1["default"].createElement("div", { className: "flex justify-center" },
                    react_1["default"].createElement("button", { type: "submit", className: "w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" }, "Change Password"))),
            react_1["default"].createElement("form", { onSubmit: handleImageUpload, className: "mt-8 space-y-6" },
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300" }, "Upload Profile Image"),
                    react_1["default"].createElement("input", { type: "file", accept: "image/*", onChange: handleImageChange, className: "mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" }),
                    imageData && (react_1["default"].createElement("img", { src: imageData, alt: "Profile Preview", className: "mt-4 w-32 h-32 rounded-full mx-auto border-4 border-gray-600 shadow-lg" }))),
                react_1["default"].createElement("div", { className: "flex justify-center" },
                    react_1["default"].createElement("button", { type: "submit", className: "w-full py-4 px-6 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" }, "Upload Image")))),
        react_1["default"].createElement(react_toastify_1.ToastContainer, null)));
};
exports["default"] = FacultyProfileManagement;
