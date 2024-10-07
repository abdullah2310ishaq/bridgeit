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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var ProfileCard_1 = require("./ProfileCard");
var NavBar_1 = require("@/app/components/NavBar");
var fi_1 = require("react-icons/fi");
var ExploreProjectCard_1 = require("./ExploreProjectCard");
var page_1 = require("../[id]/page");
var ExploreProjects = function () {
    var _a = react_1.useState(null), userProfile = _a[0], setUserProfile = _a[1];
    var _b = react_1.useState([]), expertProjects = _b[0], setExpertProjects = _b[1];
    var _c = react_1.useState([]), filteredProjects = _c[0], setFilteredProjects = _c[1];
    var _d = react_1.useState("Most Recent"), selectedFilter = _d[0], setSelectedFilter = _d[1];
    var _e = react_1.useState(""), searchQuery = _e[0], setSearchQuery = _e[1];
    var _f = react_1.useState(true), loading = _f[0], setLoading = _f[1];
    var _g = react_1.useState(""), error = _g[0], setError = _g[1];
    var _h = react_1.useState(null), selectedProjectId = _h[0], setSelectedProjectId = _h[1];
    var _j = react_1.useState(null), selectedProjectDetails = _j[0], setSelectedProjectDetails = _j[1];
    var router = navigation_1.useRouter();
    var searchParams = navigation_1.useSearchParams();
    react_1.useEffect(function () {
        function fetchProfileAndProjects() {
            return __awaiter(this, void 0, void 0, function () {
                var token, profileResponse, profileData, userId, studentResponse, studentData, expertProjectsResponse, expertProjectsData, formattedProjects, error_1;
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
                            profileResponse = _a.sent();
                            if (!profileResponse.ok) return [3 /*break*/, 12];
                            return [4 /*yield*/, profileResponse.json()];
                        case 3:
                            profileData = _a.sent();
                            userId = profileData.userId;
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
                            setUserProfile({
                                userId: studentData.userId,
                                firstName: studentData.firstName,
                                lastName: studentData.lastName,
                                role: profileData.role,
                                email: studentData.email,
                                universityName: studentData.universityName,
                                address: studentData.address,
                                rollNumber: studentData.rollNumber,
                                imageData: studentData.imageData
                            });
                            return [4 /*yield*/, fetch("https://localhost:7053/api/projects/get-expert-projects", {
                                    method: "GET",
                                    headers: {
                                        Authorization: "Bearer " + token
                                    }
                                })];
                        case 6:
                            expertProjectsResponse = _a.sent();
                            if (!expertProjectsResponse.ok) return [3 /*break*/, 8];
                            return [4 /*yield*/, expertProjectsResponse.json()];
                        case 7:
                            expertProjectsData = _a.sent();
                            formattedProjects = expertProjectsData.map(function (project) { return ({
                                id: project.id,
                                title: project.title,
                                description: project.description,
                                stack: project.stack,
                                status: project.currentStatus,
                                expertName: project.name,
                                companyName: project.companyName,
                                isFeatured: project.isFeatured,
                                matchScore: project.matchScore,
                                createdAt: project.createdAt,
                                isRequested: project.isRequested
                            }); });
                            setExpertProjects(formattedProjects);
                            setFilteredProjects(formattedProjects);
                            return [3 /*break*/, 9];
                        case 8:
                            setExpertProjects([]);
                            setFilteredProjects([]);
                            _a.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            router.push("/unauthorized");
                            _a.label = 11;
                        case 11: return [3 /*break*/, 13];
                        case 12:
                            router.push("/unauthorized");
                            _a.label = 13;
                        case 13: return [3 /*break*/, 16];
                        case 14:
                            error_1 = _a.sent();
                            console.error("An error occurred:", error_1);
                            setError("Failed to load projects.");
                            return [3 /*break*/, 16];
                        case 15:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 16: return [2 /*return*/];
                    }
                });
            });
        }
        fetchProfileAndProjects();
    }, [router]);
    react_1.useEffect(function () {
        filterProjects();
    }, [selectedFilter, searchQuery, expertProjects]);
    var filterProjects = function () {
        var sortedProjects = __spreadArrays(expertProjects);
        if (searchQuery) {
            sortedProjects = sortedProjects.filter(function (project) {
                return project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (project.companyName &&
                        project.companyName.toLowerCase().includes(searchQuery.toLowerCase()));
            });
        }
        switch (selectedFilter) {
            case "Most Recent":
                sortedProjects.sort(function (a, b) {
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                });
                break;
            case "Best Matches":
                sortedProjects.sort(function (a, b) { return (b.matchScore || 0) - (a.matchScore || 0); });
                break;
            case "Featured":
                sortedProjects = sortedProjects.filter(function (project) { return project.isFeatured; });
                break;
            default:
                break;
        }
        // those requested not shown again to user 
        var filteredByRequestStatus = sortedProjects.filter(function (project) { return !project.isRequested; });
        setFilteredProjects(filteredByRequestStatus);
    };
    react_1.useEffect(function () {
        var projectIdFromUrl = searchParams.get("projectId");
        if (projectIdFromUrl) {
            setSelectedProjectId(projectIdFromUrl);
        }
    }, [searchParams]);
    react_1.useEffect(function () {
        if (selectedProjectId) {
            var project = expertProjects.find(function (p) { return p.id === selectedProjectId; });
            if (project) {
                setSelectedProjectDetails(project);
            }
            else {
                setSelectedProjectDetails(null);
            }
        }
        else {
            setSelectedProjectDetails(null);
        }
    }, [selectedProjectId, expertProjects]);
    var handleProjectClick = function (id) {
        setSelectedProjectId(id);
        router.push("?projectId=" + id, undefined);
    };
    if (loading) {
        return (react_1["default"].createElement("div", { className: "flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 to-gray-800" },
            react_1["default"].createElement("p", { className: "text-gray-400 text-xl" }, "Loading projects...")));
    }
    if (error) {
        return (react_1["default"].createElement("div", { className: "flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 to-gray-800" },
            react_1["default"].createElement("p", { className: "text-red-500 text-xl" }, error)));
    }
    return (react_1["default"].createElement("div", { className: "flex flex-col min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300" },
        react_1["default"].createElement(NavBar_1["default"], null),
        react_1["default"].createElement("div", { className: "flex flex-1" },
            react_1["default"].createElement("aside", { className: "hidden lg:block lg:w-1/5 xl:w-1/6 bg-gray-800 p-6" }, userProfile && (react_1["default"].createElement(ProfileCard_1["default"], { imageData: "data:image/jpeg;base64," + userProfile.imageData, firstName: userProfile.firstName, lastName: userProfile.lastName, role: userProfile.role }))),
            react_1["default"].createElement("main", { className: "flex-1 flex" },
                react_1["default"].createElement("div", { className: "p-6 " + (selectedProjectDetails ? "w-full lg:w-1/2" : "w-full") },
                    react_1["default"].createElement("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6" },
                        react_1["default"].createElement("div", { className: "relative w-full lg:w-2/3 mb-4 lg:mb-0" },
                            react_1["default"].createElement(fi_1.FiSearch, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" }),
                            react_1["default"].createElement("input", { type: "text", placeholder: "Search projects...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, className: "w-full pl-10 pr-4 py-2 rounded-full bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" })),
                        react_1["default"].createElement("div", { className: "flex space-x-3 items-center" },
                            react_1["default"].createElement(fi_1.FiFilter, { className: "text-gray-400" }),
                            react_1["default"].createElement("select", { value: selectedFilter, onChange: function (e) { return setSelectedFilter(e.target.value); }, className: "bg-gray-700 text-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" },
                                react_1["default"].createElement("option", { value: "Most Recent" }, "Most Recent"),
                                react_1["default"].createElement("option", { value: "Best Matches" }, "Best Matches"),
                                react_1["default"].createElement("option", { value: "Featured" }, "Featured")))),
                    react_1["default"].createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6" }, filteredProjects.length > 0 ? (filteredProjects.map(function (project) { return (react_1["default"].createElement(ExploreProjectCard_1["default"], { key: project.id, id: project.id, title: project.title, description: project.description, stack: project.stack, expertName: project.expertName, onClick: function () { return handleProjectClick(project.id); } })); })) : (react_1["default"].createElement("div", { className: "col-span-full text-center text-gray-400" }, "No projects available.")))),
                selectedProjectDetails && (react_1["default"].createElement("div", { className: "w-full lg:w-1/2 p-6 bg-gray-800 overflow-auto" },
                    react_1["default"].createElement(page_1["default"], { project: selectedProjectDetails, onClose: function () {
                            setSelectedProjectId(null);
                            router.push("", undefined);
                        } })))))));
};
exports["default"] = ExploreProjects;

