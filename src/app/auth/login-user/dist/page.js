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
var framer_motion_1 = require("framer-motion");
var fa_1 = require("react-icons/fa");
var image_1 = require("next/image");
var LoginPage = function () {
    var _a = react_1.useState(""), email = _a[0], setEmail = _a[1];
    var _b = react_1.useState(""), password = _b[0], setPassword = _b[1];
    var _c = react_1.useState(false), showPassword = _c[0], setShowPassword = _c[1]; // State for toggling password visibility
    var _d = react_1.useState(false), loading = _d[0], setLoading = _d[1];
    var _e = react_1.useState({ email: "", password: "" }), errors = _e[0], setErrors = _e[1];
    var router = navigation_1.useRouter();
    var validateForm = function () {
        var isValid = true;
        var newErrors = { email: "", password: "" };
        if (!email) {
            newErrors.email = "Email is required";
            isValid = false;
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
            isValid = false;
        }
        if (!password) {
            newErrors.password = "Password is required";
            isValid = false;
        }
        else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };
    var handleLogin = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, token, profileResponse, profileData, role, errorData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validateForm())
                        return [2 /*return*/];
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 11, 12, 13]);
                    return [4 /*yield*/, fetch("https://localhost:7053/api/auth/login", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ email: email, password: password })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 8];
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    token = data.token;
                    localStorage.setItem("jwtToken", token);
                    return [4 /*yield*/, fetch("https://localhost:7053/api/auth/authorized-user-info", {
                            method: "GET",
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })];
                case 4:
                    profileResponse = _a.sent();
                    if (!profileResponse.ok) return [3 /*break*/, 6];
                    return [4 /*yield*/, profileResponse.json()];
                case 5:
                    profileData = _a.sent();
                    role = profileData.role;
                    switch (role) {
                        case "Student":
                            router.push("/student");
                            break;
                        case "Faculty":
                            router.push("/faculty");
                            break;
                        case "IndustryExpert":
                            router.push("/industryexpert");
                            break;
                        case "UniversityAdmin":
                            router.push("/unidmin");
                            break;
                        default:
                            react_toastify_1.toast.error("Invalid role. Please contact support.");
                            break;
                    }
                    return [3 /*break*/, 7];
                case 6:
                    react_toastify_1.toast.error("Failed to fetch user profile.");
                    _a.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, response.json()];
                case 9:
                    errorData = _a.sent();
                    react_toastify_1.toast.error(errorData.message || "Login failed. Please check your credentials.");
                    _a.label = 10;
                case 10: return [3 /*break*/, 13];
                case 11:
                    error_1 = _a.sent();
                    react_toastify_1.toast.error("An error occurred. Please try again later.");
                    return [3 /*break*/, 13];
                case 12:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: "min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white p-8" },
        react_1["default"].createElement("div", { className: "w-full md:w-1/2 p-8 flex flex-col justify-center items-center" },
            react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: -50 }, transition: { duration: 0.8 }, className: "text-center mb-8" },
                react_1["default"].createElement(image_1["default"], { src: "/heroimage.png", alt: "Hero Image", width: 500, height: 500, className: "rounded-lg mb-6" }))),
        react_1["default"].createElement("div", { className: "w-full md:w-1/2 p-8 flex flex-col justify-center" },
            react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "text-center mb-8 flex items-center justify-center" },
                react_1["default"].createElement(image_1["default"], { src: "/logo.jpg", alt: "BridgeIT Logo", width: 60, height: 60, className: "mr-4 " }),
                react_1["default"].createElement("h1", { className: "text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600" }, "Welcome Back")),
            react_1["default"].createElement(framer_motion_1.motion.form, { onSubmit: handleLogin, className: "space-y-6 w-full max-w-md mx-auto", initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.8, delay: 0.2 } },
                react_1["default"].createElement("div", { className: "relative" },
                    react_1["default"].createElement(fa_1.FaEnvelope, { className: "absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" }),
                    react_1["default"].createElement("input", { type: "email", value: email, onChange: function (e) { return setEmail(e.target.value); }, className: "w-full p-4 pl-12 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300", placeholder: "Email", required: true })),
                react_1["default"].createElement("div", { className: "relative" },
                    react_1["default"].createElement(fa_1.FaLock, { className: "absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" }),
                    react_1["default"].createElement("input", { type: "password", value: password, onChange: function (e) { return setPassword(e.target.value); }, className: "w-full p-4 pl-12 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300", placeholder: "Password", required: true })),
                react_1["default"].createElement(framer_motion_1.motion.button, { type: "submit", className: "w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300", disabled: loading, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }, loading ? 'Logging in...' : 'Login'),
                react_1["default"].createElement(framer_motion_1.motion.p, { className: "mt-6 text-sm text-gray-400 text-center", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 1, duration: 0.8 } },
                    "Don't have an account?",
                    react_1["default"].createElement("a", { onClick: function () { return router.push('/auth/register-user'); }, className: "text-blue-400 hover:text-blue-300 cursor-pointer ml-1 transition duration-300" }, "Sign up here")),
                react_1["default"].createElement(framer_motion_1.motion.div, { className: "flex justify-center space-x-8 mt-8", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.2 } },
                    react_1["default"].createElement("div", { className: "flex flex-col items-center" },
                        react_1["default"].createElement(fa_1.FaUserGraduate, { className: "text-3xl text-blue-400 mb-2" })),
                    react_1["default"].createElement("div", { className: "flex flex-col items-center" },
                        react_1["default"].createElement(fa_1.FaChalkboardTeacher, { className: "text-3xl text-purple-400 mb-2" })),
                    react_1["default"].createElement("div", { className: "flex flex-col items-center" },
                        react_1["default"].createElement(fa_1.FaBriefcase, { className: "text-3xl text-green-400 mb-2" })),
                    react_1["default"].createElement("div", { className: "flex flex-col items-center" },
                        react_1["default"].createElement(fa_1.FaUniversity, { className: "text-3xl text-yellow-400 mb-2" })))))));
};
exports["default"] = LoginPage;
