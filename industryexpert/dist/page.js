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
var IndustryProfile_1 = require("./industrycomponents/IndustryProfile");
var CompanyProfile_1 = require("./industrycomponents/CompanyProfile");
var ProjectsCardd_1 = require("./industrycomponents/ProjectsCardd");
var IndustryExpertPage = function () {
    var _a = react_1.useState(null), expertProfile = _a[0], setExpertProfile = _a[1];
    var _b = react_1.useState([]), projects = _b[0], setProjects = _b[1];
    var _c = react_1.useState(true), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState(null), error = _d[0], setError = _d[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        var fetchProfileAndProjects = function () { return __awaiter(void 0, void 0, void 0, function () {
            var token, profileResponse, profileData, userId, expertResponse, expertData, projectsResponse, projectsData, error_1;
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
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 2:
                        profileResponse = _a.sent();
                        if (!profileResponse.ok)
                            throw new Error('Failed to fetch profile');
                        return [4 /*yield*/, profileResponse.json()];
                    case 3:
                        profileData = _a.sent();
                        userId = profileData.userId;
                        return [4 /*yield*/, fetch("https://localhost:7053/api/get-industry-expert/industry-expert-by-id/" + userId, {
                                method: 'GET',
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 4:
                        expertResponse = _a.sent();
                        if (!expertResponse.ok)
                            throw new Error('Failed to fetch industry expert profile');
                        return [4 /*yield*/, expertResponse.json()];
                    case 5:
                        expertData = _a.sent();
                        setExpertProfile({
                            userId: expertData.userId,
                            indExptId: expertData.indExptId,
                            companyId: expertData.companyId,
                            firstName: expertData.firstName,
                            lastName: expertData.lastName,
                            email: expertData.email,
                            companyName: expertData.companyName,
                            address: expertData.address,
                            contact: expertData.contact,
                            imageData: expertData.imageData
                        });
                        return [4 /*yield*/, fetch("https://localhost:7053/api/projects/get-expert-projects-by-id/" + expertData.indExptId, {
                                method: 'GET',
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
                        setProjects(projectsData); // Save the projects
                        return [3 /*break*/, 9];
                    case 8:
                        console.error('Failed to fetch projects:', projectsResponse.statusText);
                        _a.label = 9;
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        error_1 = _a.sent();
                        setError('Failed to fetch data');
                        console.error('Failed to fetch data:', error_1);
                        router.push('/unauthorized');
                        return [3 /*break*/, 12];
                    case 11:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        }); };
        fetchProfileAndProjects();
    }, [router]);
    var handleLogout = function () {
        localStorage.removeItem('jwtToken');
        router.push('/auth/login-user');
    };
    if (loading) {
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "Loading...");
    }
    if (error) {
        return react_1["default"].createElement("div", { className: "text-center text-red-500" }, error);
    }
    if (!expertProfile) {
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "No profile found");
    }
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gray-900 text-gray-100" },
        react_1["default"].createElement("nav", { className: "bg-white p-6 shadow-md" },
            react_1["default"].createElement("div", { className: "container mx-auto flex justify-between items-center" },
                react_1["default"].createElement("h1", { className: "text-xl font-bold text-gray-700" }, "Industry Expert Dashboard"),
                react_1["default"].createElement("ul", { className: "flex space-x-6" },
                    react_1["default"].createElement("li", null,
                        react_1["default"].createElement("button", { onClick: function () { return router.push("/industryexpert/notifications"); }, className: "text-gray-500 hover:text-blue-600 transition" }, "Notifications")),
                    react_1["default"].createElement("li", null,
                        react_1["default"].createElement("button", { onClick: handleLogout, className: "text-gray-500 hover:text-red-600 transition" }, "Logout"))))),
        react_1["default"].createElement("div", { className: "container mx-auto p-6 space-y-8" },
            react_1["default"].createElement(IndustryProfile_1["default"], { companyLogo: expertProfile.imageData, companyName: expertProfile.companyName, userId: expertProfile.userId, indExptId: expertProfile.indExptId, companyId: expertProfile.companyId, firstName: expertProfile.firstName, lastName: expertProfile.lastName, email: expertProfile.email, address: expertProfile.address, contact: expertProfile.contact, onViewProjects: function () { }, onEditProfile: function () { }, onAddProjects: function () { } }),
            react_1["default"].createElement("h2", { className: "text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-pink-500 mb-6" }, "Industry Information"),
            react_1["default"].createElement(CompanyProfile_1["default"], { companyName: expertProfile.companyName, address: expertProfile.address, contact: expertProfile.contact, onEditCompany: function () { } }),
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("h2", { className: "text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6" }, "Projects"),
                projects.length === 0 ? (react_1["default"].createElement("p", { className: "text-gray-500" }, "No projects found")) : (react_1["default"].createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" }, projects.map(function (project) { return (react_1["default"].createElement(ProjectsCardd_1["default"], { key: project.id, title: project.title, description: project.description, endDate: project.endDate, name: project.name })); })))))));
};
exports["default"] = IndustryExpertPage;
