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
var dynamic_1 = require("next/dynamic");
var ProfileSection_1 = require("./stdcomps/ProfileSection");
//lazy loading
var Loading = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require("../loading/page"); }); }, {
    loading: function () { return react_1["default"].createElement("p", null, "Loading..."); },
    ssr: false
});
var OngoingProjectsSection = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require('./stdcomps/OngoingProjects'); }); }, {
    loading: function () { return react_1["default"].createElement("p", null, "Loading ongoing projects..."); },
    ssr: false
});
var CompletedProjectsSection = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require('./stdcomps/CompletedProjects'); }); }, {
    loading: function () { return react_1["default"].createElement("p", null, "Loading completed projects..."); },
    ssr: false
});
var EventsSection = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require('./stdcomps/Events'); }); }, {
    loading: function () { return react_1["default"].createElement("p", null, "Loading events..."); },
    ssr: false
});
var StudentPage = function () {
    var _a = react_1.useState(null), userProfile = _a[0], setUserProfile = _a[1];
    var _b = react_1.useState([]), projects = _b[0], setProjects = _b[1];
    var _c = react_1.useState([]), ongoingProjects = _c[0], setOngoingProjects = _c[1];
    var _d = react_1.useState([]), events = _d[0], setEvents = _d[1];
    var _e = react_1.useState(true), loading = _e[0], setLoading = _e[1];
    var _f = react_1.useState(false), showModal = _f[0], setShowModal = _f[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        function fetchProfileAndProjects() {
            return __awaiter(this, void 0, void 0, function () {
                var token, profileResponse, profileData, userId, studentResponse, studentData, projectsResponse, projectsData, ongoingProjectsResponse, ongoingData, eventsResponse, eventsData, error_1;
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
                            _a.trys.push([1, 22, 23, 24]);
                            return [4 /*yield*/, fetch("https://localhost:7053/api/auth/authorized-user-info", {
                                    method: "GET",
                                    headers: {
                                        Authorization: "Bearer " + token
                                    }
                                })];
                        case 2:
                            profileResponse = _a.sent();
                            if (!profileResponse.ok) return [3 /*break*/, 20];
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
                            if (!studentResponse.ok) return [3 /*break*/, 18];
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
                                imageData: studentData.imageData,
                                description: studentData.description ||
                                    "Add your description by going to edit profile section.",
                                uniImage: studentData.uniImage
                            });
                            return [4 /*yield*/, fetch("https://localhost:7053/api/projects/get-student-projects-by-id/" + studentData.id, {
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
                            setProjects(projectsData.slice(0, 3)); // Limit to 3 projects
                            return [3 /*break*/, 9];
                        case 8:
                            setProjects([]);
                            _a.label = 9;
                        case 9: return [4 /*yield*/, fetch("https://localhost:7053/api/projects/get-student-with-expert-project-by-id/" + studentData.id, {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                        case 10:
                            ongoingProjectsResponse = _a.sent();
                            if (!ongoingProjectsResponse.ok) return [3 /*break*/, 12];
                            return [4 /*yield*/, ongoingProjectsResponse.json()];
                        case 11:
                            ongoingData = _a.sent();
                            setOngoingProjects(ongoingData);
                            return [3 /*break*/, 13];
                        case 12:
                            setOngoingProjects([]);
                            _a.label = 13;
                        case 13: return [4 /*yield*/, fetch("https://localhost:7053/api/Events/get-events", {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                        case 14:
                            eventsResponse = _a.sent();
                            if (!eventsResponse.ok) return [3 /*break*/, 16];
                            return [4 /*yield*/, eventsResponse.json()];
                        case 15:
                            eventsData = _a.sent();
                            setEvents(eventsData);
                            return [3 /*break*/, 17];
                        case 16:
                            setEvents([]);
                            _a.label = 17;
                        case 17: return [3 /*break*/, 19];
                        case 18:
                            console.error("Failed to fetch student profile.");
                            router.push("/unauthorized");
                            _a.label = 19;
                        case 19: return [3 /*break*/, 21];
                        case 20:
                            console.error("Failed to fetch user profile.");
                            router.push("/unauthorized");
                            _a.label = 21;
                        case 21: return [3 /*break*/, 24];
                        case 22:
                            error_1 = _a.sent();
                            console.error("An error occurred:", error_1);
                            router.push("/unauthorized");
                            return [3 /*break*/, 24];
                        case 23:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 24: return [2 /*return*/];
                    }
                });
            });
        }
        fetchProfileAndProjects();
    }, [router]);
    var handleLogout = function () {
        localStorage.removeItem("jwtToken");
        router.push("/auth/login-user");
    };
    var goToEditProfile = function () {
        router.push("/student/profile/edit");
    };
    var gotoProfile = function () {
        router.push("/student/profile");
    };
    var goToProjectsPage = function () {
        router.push("/student/projects");
    };
    var createProjects = function () {
        router.push("/student/projects/create");
    };
    var goToEventsPage = function () {
        router.push("/student/events");
    };
    var toggleModal = function () {
        setShowModal(!showModal);
    };
    var gradientStyles = [
        "bg-gradient-to-r from-green-400 to-blue-500",
        "bg-gradient-to-r from-purple-400 to-pink-500",
        "bg-gradient-to-r from-yellow-400 to-red-500",
        "bg-gradient-to-r from-indigo-400 to-purple-600",
        "bg-gradient-to-r from-orange-400 to-pink-500",
    ];
    if (loading || !userProfile) {
        return (react_1["default"].createElement("div", { className: "text-center text-gray-400" },
            react_1["default"].createElement(Loading, null)));
    }
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-300 p-6" },
        react_1["default"].createElement(ProfileSection_1["default"], { userProfile: userProfile, goToEditProfile: goToEditProfile, gotoProfile: gotoProfile }),
        react_1["default"].createElement(OngoingProjectsSection, { ongoingProjects: ongoingProjects, goToProjectsPage: goToProjectsPage, createProjects: createProjects }),
        react_1["default"].createElement(CompletedProjectsSection, { projects: projects }),
        react_1["default"].createElement(EventsSection, { events: events, gradientStyles: gradientStyles, goToEventsPage: goToEventsPage })));
};
exports["default"] = StudentPage;
