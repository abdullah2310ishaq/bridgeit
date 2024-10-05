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
var ProjectsPage = function () {
    var _a = react_1.useState([]), projects = _a[0], setProjects = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        var fetchProjects = function () { return __awaiter(void 0, void 0, void 0, function () {
            var token, userResponse, userData, userId, studentResponse, studentData, studentId, projectsResponse, projectsData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = localStorage.getItem("jwtToken");
                        if (!token) {
                            router.push("/auth/login-user");
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 14, 15, 16]);
                        return [4 /*yield*/, fetch("https://localhost:7053/api/auth/authorized-user-info", {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 2:
                        userResponse = _a.sent();
                        if (!userResponse.ok) return [3 /*break*/, 12];
                        return [4 /*yield*/, userResponse.json()];
                    case 3:
                        userData = _a.sent();
                        userId = userData.userId;
                        return [4 /*yield*/, fetch("https://localhost:7053/api/get-student/student-by-id/" + userId, {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 4:
                        studentResponse = _a.sent();
                        if (!studentResponse.ok) return [3 /*break*/, 10];
                        return [4 /*yield*/, studentResponse.json()];
                    case 5:
                        studentData = _a.sent();
                        studentId = studentData.id;
                        return [4 /*yield*/, fetch("https://localhost:7053/api/projects/get-student-projects-by-id/" + studentId, {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 6:
                        projectsResponse = _a.sent();
                        if (!projectsResponse.ok) return [3 /*break*/, 8];
                        return [4 /*yield*/, projectsResponse.json()];
                    case 7:
                        projectsData = _a.sent();
                        setProjects(projectsData);
                        return [3 /*break*/, 9];
                    case 8:
                        react_toastify_1.toast.error("Failed to load projects.", {
                            position: "top-center",
                            autoClose: 3000
                        });
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        console.error("Failed to fetch student details.");
                        router.push("/unauthorized");
                        _a.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        console.error("Failed to fetch user details.");
                        router.push("/unauthorized");
                        _a.label = 13;
                    case 13: return [3 /*break*/, 16];
                    case 14:
                        error_1 = _a.sent();
                        console.error("An error occurred:", error_1);
                        react_toastify_1.toast.error("An error occurred while fetching projects.", {
                            position: "top-center",
                            autoClose: 3000
                        });
                        return [3 /*break*/, 16];
                    case 15:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        }); };
        fetchProjects();
    }, [router]);
    if (loading) {
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "Loading...");
    }
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gray-900 text-white p-8" },
        react_1["default"].createElement("div", { className: "container mx-auto" },
            react_1["default"].createElement("h1", { className: "text-3xl font-bold mb-8 text-center" }, "My Projects"),
            projects.length > 0 ? (react_1["default"].createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" }, projects.map(function (project) { return (react_1["default"].createElement("div", { key: project.id, className: "bg-gray-800 p-6 rounded-lg shadow-lg" },
                react_1["default"].createElement("h2", { className: "text-xl font-semibold mb-2" }, project.title),
                react_1["default"].createElement("p", { className: "text-gray-400 mb-4" }, project.description),
                react_1["default"].createElement("p", { className: "text-gray-500" },
                    react_1["default"].createElement("strong", null, "Stack:"),
                    " ",
                    project.stack),
                react_1["default"].createElement("p", { className: "text-gray-500" },
                    react_1["default"].createElement("strong", null, "Status:"),
                    " ",
                    project.status))); }))) : (react_1["default"].createElement("p", { className: "text-gray-300 text-center" }, "No projects found."))),
        react_1["default"].createElement(react_toastify_1.ToastContainer, null)));
};
exports["default"] = ProjectsPage;
