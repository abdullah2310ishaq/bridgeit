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
var CreateProjectPage = function () {
    var _a = react_1.useState(''), projectTitle = _a[0], setProjectTitle = _a[1];
    var _b = react_1.useState(''), projectDescription = _b[0], setProjectDescription = _b[1];
    var _c = react_1.useState(0), projectTeam = _c[0], setProjectTeam = _c[1];
    var _d = react_1.useState(''), projectStack = _d[0], setProjectStack = _d[1];
    var _e = react_1.useState(''), projectStatus = _e[0], setProjectStatus = _e[1];
    var _f = react_1.useState(''), projectStartDate = _f[0], setProjectStartDate = _f[1];
    var _g = react_1.useState(''), projectEndDate = _g[0], setProjectEndDate = _g[1];
    var _h = react_1.useState(''), studentId = _h[0], setStudentId = _h[1];
    var _j = react_1.useState(true), loading = _j[0], setLoading = _j[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        function authorizeUserAndFetchStudentId() {
            return __awaiter(this, void 0, void 0, function () {
                var token, userResponse, userData, userId, studentResponse, studentData, error_1;
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
                            _a.trys.push([1, 10, 11, 12]);
                            return [4 /*yield*/, fetch('https://localhost:7053/api/auth/authorized-user-info', {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': "Bearer " + token
                                    }
                                })];
                        case 2:
                            userResponse = _a.sent();
                            if (!userResponse.ok) return [3 /*break*/, 8];
                            return [4 /*yield*/, userResponse.json()];
                        case 3:
                            userData = _a.sent();
                            userId = userData.userId;
                            return [4 /*yield*/, fetch("https://localhost:7053/api/get-student/student-by-id/" + userId, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': "Bearer " + token
                                    }
                                })];
                        case 4:
                            studentResponse = _a.sent();
                            if (!studentResponse.ok) return [3 /*break*/, 6];
                            return [4 /*yield*/, studentResponse.json()];
                        case 5:
                            studentData = _a.sent();
                            setStudentId(studentData.id);
                            return [3 /*break*/, 7];
                        case 6:
                            console.error('Failed to fetch student details.');
                            router.push('/unauthorized');
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            console.error('Failed to authorize user.');
                            router.push('/unauthorized');
                            _a.label = 9;
                        case 9: return [3 /*break*/, 12];
                        case 10:
                            error_1 = _a.sent();
                            console.error('An error occurred:', error_1);
                            router.push('/unauthorized');
                            return [3 /*break*/, 12];
                        case 11:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        }
        authorizeUserAndFetchStudentId();
    }, [router]);
    var handleCreateProject = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!studentId) {
                        react_toastify_1.toast.error('Failed to create project. Student ID is missing.', {
                            position: 'top-center',
                            autoClose: 3000
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    token = localStorage.getItem('jwtToken');
                    return [4 /*yield*/, fetch('https://localhost:7053/api/projects/student-add-projects', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer " + token
                            },
                            body: JSON.stringify({
                                title: projectTitle,
                                description: projectDescription,
                                team: projectTeam,
                                stack: projectStack,
                                currentStatus: projectStatus,
                                startDate: projectStartDate,
                                endDate: projectEndDate,
                                studentId: studentId
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        react_toastify_1.toast.success('Project created successfully!', {
                            position: 'top-center',
                            autoClose: 3000
                        });
                        router.push('/student');
                    }
                    else {
                        react_toastify_1.toast.error('Failed to create project.', {
                            position: 'top-center',
                            autoClose: 3000
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('An error occurred:', error_2);
                    react_toastify_1.toast.error('An error occurred while creating the project.', {
                        position: 'top-center',
                        autoClose: 3000
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (react_1["default"].createElement("div", { className: "min-h-screen flex items-center justify-center bg-gray-900" },
            react_1["default"].createElement("div", { className: "text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600" }, "Loading...")));
    }
    return (react_1["default"].createElement("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 relative overflow-hidden" },
        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "w-full max-w-4xl p-8 bg-gray-800 rounded-3xl shadow-2xl relative z-10" },
            react_1["default"].createElement("div", { className: "absolute top-4 left-4 z-10" },
                react_1["default"].createElement(image_1["default"], { src: "/logo.jpg", alt: "BridgeIT Logo", width: 100, height: 100 })),
            react_1["default"].createElement("h1", { className: "text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600" }, "Create Your Project"),
            react_1["default"].createElement("form", { onSubmit: handleCreateProject, className: "space-y-6" },
                react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Project Title"),
                        react_1["default"].createElement("input", { type: "text", value: projectTitle, onChange: function (e) { return setProjectTitle(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", required: true })),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Technology Stack"),
                        react_1["default"].createElement("input", { type: "text", value: projectStack, onChange: function (e) { return setProjectStack(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", required: true }))),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Description"),
                    react_1["default"].createElement("textarea", { value: projectDescription, onChange: function (e) { return setProjectDescription(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", rows: 4, required: true })),
                react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Team Size"),
                        react_1["default"].createElement("input", { type: "number", value: projectTeam, onChange: function (e) { return setProjectTeam(Number(e.target.value)); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", required: true })),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Start Date"),
                        react_1["default"].createElement("input", { type: "date", value: projectStartDate, onChange: function (e) { return setProjectStartDate(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", required: true })),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "End Date"),
                        react_1["default"].createElement("input", { type: "date", value: projectEndDate, onChange: function (e) { return setProjectEndDate(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", required: true }))),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { className: "block text-sm font-semibold text-gray-300 mb-2" }, "Current Status"),
                    react_1["default"].createElement("input", { type: "text", value: projectStatus, onChange: function (e) { return setProjectStatus(e.target.value); }, className: "w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200", required: true })),
                react_1["default"].createElement("div", { className: "flex justify-center" },
                    react_1["default"].createElement("button", { type: "submit", className: "w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" }, "Launch Project")))),
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
exports["default"] = CreateProjectPage;
