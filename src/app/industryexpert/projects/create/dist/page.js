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
var image_1 = require("next/image");
var fa_1 = require("react-icons/fa");
var PostProjectForm = function () {
    var _a = react_1.useState(""), title = _a[0], setTitle = _a[1];
    var _b = react_1.useState(""), description = _b[0], setDescription = _b[1];
    var _c = react_1.useState(""), endDate = _c[0], setEndDate = _c[1]; // For date in "yyyy-MM-dd" format
    var _d = react_1.useState(null), budget = _d[0], setBudget = _d[1]; // Added budget state
    var _e = react_1.useState(null), indExpertId = _e[0], setIndExpertId = _e[1]; // Store fetched IndExptId
    var _f = react_1.useState(false), isSubmitting = _f[0], setIsSubmitting = _f[1]; // For submit button disabling
    var router = navigation_1.useRouter();
    // Fetch the IndExptId when the user logs in
    react_1.useEffect(function () {
        var fetchIndExpertId = function () { return __awaiter(void 0, void 0, void 0, function () {
            var token, profileResponse, profileData, userId, expertResponse, expertData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = localStorage.getItem("jwtToken");
                        if (!token) {
                            react_toastify_1.toast.error("You must be logged in to post a project.");
                            return [2 /*return*/];
                        }
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
                        userId = profileData.userId;
                        return [4 /*yield*/, fetch("https://localhost:7053/api/get-industry-expert/industry-expert-by-id/" + userId, {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 4:
                        expertResponse = _a.sent();
                        if (!expertResponse.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, expertResponse.json()];
                    case 5:
                        expertData = _a.sent();
                        console.log("Fetched Expert Data:", expertData);
                        // Ensure the response contains the IndExptId
                        if (expertData.indExptId) {
                            setIndExpertId(expertData.indExptId); // Store the fetched IndExptId
                        }
                        else {
                            react_toastify_1.toast.error("Unable to fetch your expert ID.");
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        react_toastify_1.toast.error("Failed to fetch expert data.");
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        react_toastify_1.toast.error("Failed to fetch user profile.");
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_1 = _a.sent();
                        console.error("Error fetching expert data:", error_1);
                        react_toastify_1.toast.error("An error occurred while fetching expert data.");
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        }); };
        fetchIndExpertId();
    }, []);
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, errorText, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    // Validate input fields
                    if (!title || !description || !endDate || budget === null) {
                        react_toastify_1.toast.error("Please fill in all the required fields");
                        return [2 /*return*/];
                    }
                    if (!indExpertId) {
                        react_toastify_1.toast.error("Unable to fetch your expert ID.");
                        return [2 /*return*/];
                    }
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    token = localStorage.getItem("jwtToken");
                    if (!token) {
                        react_toastify_1.toast.error("You must be logged in to post a project.");
                        setIsSubmitting(false);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("https://localhost:7053/api/projects/expert-post-project", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + token
                            },
                            body: JSON.stringify({
                                Title: title,
                                Description: description,
                                EndDate: endDate,
                                IndExpertId: indExpertId,
                                Budget: budget
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    react_toastify_1.toast.success("Project posted successfully!");
                    setTimeout(function () {
                        router.push("/industryexpert/projects"); // Redirect after successful project posting
                    }, 2000);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.text()];
                case 4:
                    errorText = _a.sent();
                    react_toastify_1.toast.error("Failed to post the project: " + errorText);
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_2 = _a.sent();
                    console.error("Error posting the project:", error_2);
                    react_toastify_1.toast.error("Error occurred while posting the project");
                    return [3 /*break*/, 8];
                case 7:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 relative overflow-hidden" },
        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "w-full max-w-4xl p-8 bg-gray-800 rounded-3xl shadow-2xl relative z-10" },
            react_1["default"].createElement("div", { className: "absolute top-4 left-4 z-10" },
                react_1["default"].createElement(image_1["default"], { src: "/logo.jpg", alt: "BridgeIT Logo", width: 100, height: 100 })),
            react_1["default"].createElement("h1", { className: "text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600" }, "Post a New Project"),
            react_1["default"].createElement("form", { onSubmit: handleSubmit, className: "space-y-6" },
                react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Project Title"),
                        react_1["default"].createElement("input", { type: "text", value: title, onChange: function (e) { return setTitle(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", placeholder: "Enter project title", required: true })),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Budget"),
                        react_1["default"].createElement("input", { type: "number", value: budget !== null && budget !== void 0 ? budget : "", onChange: function (e) { return setBudget(parseFloat(e.target.value)); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", placeholder: "Enter project budget", required: true }))),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Project Description"),
                    react_1["default"].createElement("textarea", { value: description, onChange: function (e) { return setDescription(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", placeholder: "Describe the project", rows: 4, required: true })),
                react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "End Date"),
                        react_1["default"].createElement("input", { type: "date", value: endDate, onChange: function (e) { return setEndDate(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", placeholder: "End Date", required: true }))),
                react_1["default"].createElement("div", { className: "flex justify-center" },
                    react_1["default"].createElement("button", { type: "submit", className: "w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", disabled: isSubmitting }, isSubmitting ? "Submitting..." : "Post Project")))),
        react_1["default"].createElement("div", { className: "absolute top-20 right-10 text-blue-400 opacity-20" },
            react_1["default"].createElement(fa_1.FaRocket, { size: 100 })),
        react_1["default"].createElement("div", { className: "absolute bottom-20 left-10 text-purple-400 opacity-20" },
            react_1["default"].createElement(fa_1.FaCode, { size: 100 })),
        react_1["default"].createElement("div", { className: "absolute top-1/2 left-5 text-green-400 opacity-20" },
            react_1["default"].createElement(fa_1.FaUsers, { size: 80 })),
        react_1["default"].createElement("div", { className: "absolute bottom-10 right-20 text-yellow-400 opacity-20" },
            react_1["default"].createElement(fa_1.FaCalendarAlt, { size: 80 })),
        react_1["default"].createElement(react_toastify_1.ToastContainer, { position: "top-right", autoClose: 3000, hideProgressBar: true })));
};
exports["default"] = PostProjectForm;
