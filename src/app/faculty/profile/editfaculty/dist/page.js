"use client";
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
var react_toastify_1 = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
var framer_motion_1 = require("framer-motion");
var image_1 = require("next/image");
var UpdateFacultyPage = function () {
    var _a = react_1.useState({
        firstName: "",
        lastName: "",
        email: "",
        post: "",
        interest: [],
        description: "",
        department: "",
        universityName: "",
        address: "",
        uniId: ""
    }), facultyData = _a[0], setFacultyData = _a[1];
    var _b = react_1.useState(false), loading = _b[0], setLoading = _b[1];
    var router = navigation_1.useRouter();
    var _c = react_1.useState(null), userId = _c[0], setUserId = _c[1];
    react_1.useEffect(function () {
        function fetchFacultyData() {
            return __awaiter(this, void 0, void 0, function () {
                var token, profileResponse, profileData, userId_1, facultyResponse, data, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            token = localStorage.getItem("jwtToken");
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 10, , 11]);
                            return [4 /*yield*/, fetch("https://localhost:7053/api/auth/authorized-user-info", {
                                    method: "GET",
                                    headers: {
                                        Authorization: "Bearer " + token
                                    }
                                })];
                        case 2:
                            profileResponse = _a.sent();
                            if (!profileResponse.ok) return [3 /*break*/, 8];
                            return [4 /*yield*/, profileResponse.json()];
                        case 3:
                            profileData = _a.sent();
                            userId_1 = profileData.userId;
                            setUserId(userId_1);
                            return [4 /*yield*/, fetch("https://localhost:7053/api/get-faculty/faculty-by-id/" + userId_1, {
                                    method: "GET",
                                    headers: {
                                        Authorization: "Bearer " + token
                                    }
                                })];
                        case 4:
                            facultyResponse = _a.sent();
                            if (!facultyResponse.ok) return [3 /*break*/, 6];
                            return [4 /*yield*/, facultyResponse.json()];
                        case 5:
                            data = _a.sent();
                            setFacultyData({
                                firstName: data.firstName || "",
                                lastName: data.lastName || "",
                                email: data.email || "",
                                post: data.post || "",
                                interest: data.interest || [],
                                description: data.description || "",
                                department: data.department || "",
                                universityName: data.universityName || "",
                                address: data.address || "",
                                uniId: data.uniId || ""
                            });
                            return [3 /*break*/, 7];
                        case 6:
                            react_toastify_1.toast.error("Failed to load faculty data.", {
                                position: "top-center",
                                autoClose: 3000
                            });
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            react_toastify_1.toast.error("Failed to fetch user profile.", {
                                position: "top-center",
                                autoClose: 3000
                            });
                            _a.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            error_1 = _a.sent();
                            react_toastify_1.toast.error("An error occurred while fetching profile data.", {
                                position: "top-center",
                                autoClose: 3000
                            });
                            return [3 /*break*/, 11];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        }
        fetchFacultyData();
    }, []);
    var handleInputChange = function (e) {
        var _a;
        var _b = e.target, name = _b.name, value = _b.value;
        setFacultyData(__assign(__assign({}, facultyData), (_a = {}, _a[name] = value, _a)));
    };
    var handleInterestChange = function (e) {
        setFacultyData(__assign(__assign({}, facultyData), { interest: e.target.value.split(",") }));
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, errorData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setLoading(true);
                    if (!userId) {
                        react_toastify_1.toast.error("User ID not found. Please try again later.", {
                            position: "top-center",
                            autoClose: 3000
                        });
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    token = localStorage.getItem("jwtToken");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, fetch("https://localhost:7053/api/faculties/update-faculty/" + userId, {
                            method: "PUT",
                            headers: {
                                Authorization: "Bearer " + token,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                firstName: facultyData.firstName,
                                lastName: facultyData.lastName,
                                email: facultyData.email,
                                post: facultyData.post,
                                interest: facultyData.interest,
                                description: facultyData.description,
                                department: facultyData.department,
                                universityName: facultyData.universityName,
                                address: facultyData.address,
                                universityId: facultyData.uniId
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    react_toastify_1.toast.success("Profile updated successfully!", {
                        position: "top-center",
                        autoClose: 3000
                    });
                    router.push("/faculty/profile");
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    errorData = _a.sent();
                    react_toastify_1.toast.error("Failed to update profile: " + errorData.message, {
                        position: "top-center",
                        autoClose: 3000
                    });
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_2 = _a.sent();
                    react_toastify_1.toast.error("An error occurred. Please try again later.", {
                        position: "top-center",
                        autoClose: 3000
                    });
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: "min-h-screen flex flex-col lg:flex-row items-center justify-between bg-gray-900 text-gray-200 p-8 space-x-8" },
        react_1["default"].createElement("div", { className: "flex flex-col items-center lg:items-start lg:ml-16" },
            react_1["default"].createElement("h1", { className: "text-6xl font-extrabold text-white mb-4 flex items-center" },
                react_1["default"].createElement(image_1["default"], { src: "/logo.jpg", alt: "Logo", width: 100, height: 100, className: "mx-4" }),
                react_1["default"].createElement("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" }, "Edit"),
                react_1["default"].createElement("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 ml-2" }, "Profile")),
            react_1["default"].createElement("div", { className: "mt-6" },
                react_1["default"].createElement(image_1["default"], { src: "/editpr.png", alt: "Edit Profile", width: 400, height: 300, className: "rounded-lg" }))),
        react_1["default"].createElement("div", { className: "w-full lg:max-w-xl p-6 rounded-lg shadow-lg bg-gray-800" },
            react_1["default"].createElement("h1", { className: "text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8" }, "Update Profile"),
            react_1["default"].createElement("form", { onSubmit: handleSubmit, className: "space-y-6" },
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300" }, "First Name"),
                    react_1["default"].createElement("input", { type: "text", name: "firstName", value: facultyData.firstName, onChange: handleInputChange, className: "mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300" }, "Last Name"),
                    react_1["default"].createElement("input", { type: "text", name: "lastName", value: facultyData.lastName, onChange: handleInputChange, className: "mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300" }, "Email"),
                    react_1["default"].createElement("input", { type: "email", name: "email", value: facultyData.email, onChange: handleInputChange, className: "mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300" }, "Post"),
                    react_1["default"].createElement("input", { type: "text", name: "post", value: facultyData.post, onChange: handleInputChange, className: "mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300" }, "Interest (separated by commas)"),
                    react_1["default"].createElement("input", { type: "text", name: "interest", value: facultyData.interest.join(", "), onChange: handleInterestChange, className: "mt-1 block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })),
                react_1["default"].createElement("div", { className: "flex justify-center" },
                    react_1["default"].createElement(framer_motion_1.motion.button, { type: "submit", className: "w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", disabled: loading, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } }, loading ? "Updating..." : "Update Profile"))),
            react_1["default"].createElement("button", { onClick: function () { return router.push("/faculty/profile"); }, className: "mt-6 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-400 hover:to-purple-500 transition duration-300 w-full" }, "Back to Profile")),
        react_1["default"].createElement(react_toastify_1.ToastContainer, null)));
};
exports["default"] = UpdateFacultyPage;
