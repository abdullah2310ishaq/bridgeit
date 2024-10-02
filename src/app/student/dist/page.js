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
var ProfileDropdown_1 = require("../components/ProfileDropdown");
var framer_motion_1 = require("framer-motion");
var StudentPage = function () {
    var _a = react_1.useState(null), userProfile = _a[0], setUserProfile = _a[1];
    var _b = react_1.useState([]), projects = _b[0], setProjects = _b[1];
    var _c = react_1.useState(null), ongoingProject = _c[0], setOngoingProject = _c[1];
    var _d = react_1.useState([]), events = _d[0], setEvents = _d[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        function fetchProfileAndProjects() {
            return __awaiter(this, void 0, void 0, function () {
                var token, profileResponse, profileData, userId, studentResponse, studentData, projectsResponse, projectsData, eventsResponse, eventsData, error_1;
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
                            _a.trys.push([1, 18, , 19]);
                            return [4 /*yield*/, fetch("https://localhost:7053/api/auth/authorized-user-info", {
                                    method: "GET",
                                    headers: {
                                        Authorization: "Bearer " + token
                                    }
                                })];
                        case 2:
                            profileResponse = _a.sent();
                            if (!profileResponse.ok) return [3 /*break*/, 16];
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
                            if (!studentResponse.ok) return [3 /*break*/, 14];
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
                            setProjects(projectsData.slice(0, 3));
                            return [3 /*break*/, 9];
                        case 8:
                            setProjects([]); // Handle case where no projects are returned
                            _a.label = 9;
                        case 9: return [4 /*yield*/, fetch("https://localhost:7053/api/Events/get-events", {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                        case 10:
                            eventsResponse = _a.sent();
                            if (!eventsResponse.ok) return [3 /*break*/, 12];
                            return [4 /*yield*/, eventsResponse.json()];
                        case 11:
                            eventsData = _a.sent();
                            setEvents(eventsData);
                            return [3 /*break*/, 13];
                        case 12:
                            setEvents([]); // Handle case where no events are returned
                            _a.label = 13;
                        case 13: return [3 /*break*/, 15];
                        case 14:
                            console.error("Failed to fetch student profile.");
                            router.push("/unauthorized");
                            _a.label = 15;
                        case 15: return [3 /*break*/, 17];
                        case 16:
                            console.error("Failed to fetch user profile.");
                            router.push("/unauthorized");
                            _a.label = 17;
                        case 17: return [3 /*break*/, 19];
                        case 18:
                            error_1 = _a.sent();
                            console.error("An error occurred:", error_1);
                            router.push("/unauthorized");
                            return [3 /*break*/, 19];
                        case 19: return [2 /*return*/];
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
    var goToEventsPage = function () {
        router.push("/student/events");
    };
    var gotoProfile = function () {
        router.push("/student/profile");
    };
    var goToProjectsPage = function () {
        router.push("/student/projects");
    };
    var createEvents = function () {
        router.push("/student/projects/create");
    };
    var gradientStyles = [
        'bg-gradient-to-r from-green-400 to-blue-500',
        'bg-gradient-to-r from-purple-400 to-pink-500',
        'bg-gradient-to-r from-yellow-400 to-red-500',
        'bg-gradient-to-r from-indigo-400 to-purple-600',
        'bg-gradient-to-r from-orange-400 to-pink-500',
    ];
    if (!userProfile) {
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "Loading...");
    }
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gray-900 text-gray-300 p-6" },
        " ",
        react_1["default"].createElement("nav", { className: "bg-gray-800 shadow-lg rounded-lg mb-6 p-4 flex justify-between items-center" },
            react_1["default"].createElement("h1", { className: "text-3xl font-bold text-green-500" }, "Student Profile"),
            react_1["default"].createElement("div", { className: "hidden md:flex space-x-8" },
                react_1["default"].createElement("button", { onClick: handleLogout, className: "hover:text-green-400 transition-colors duration-300" }, "Logout"),
                react_1["default"].createElement("button", { onClick: function () { return router.push("/student/projects/explore-projects"); }, className: "hover:text-green-400 transition-colors duration-300" }, "Explore Projects"),
                react_1["default"].createElement(ProfileDropdown_1["default"], { userProfile: userProfile, onLogout: handleLogout }))),
        react_1["default"].createElement("div", { className: "relative flex flex-col md:flex-row items-center p-12 mb-8 bg-gray-900 rounded-xl " },
            react_1["default"].createElement(framer_motion_1.motion.div, { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 1 }, className: "relative z-10 md:w-1/3 flex justify-center md:justify-start mb-8 md:mb-0" },
                react_1["default"].createElement("img", { src: "data:image/jpeg;base64," + userProfile.imageData, alt: userProfile.firstName + " " + userProfile.lastName, className: "w-64 h-64 rounded-lg object-cover shadow-2xl border-4 border-green-400" })),
            react_1["default"].createElement(framer_motion_1.motion.div, { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 1 }, className: "text-white flex-grow text-center md:text-left md:pl-10" },
                react_1["default"].createElement("h2", { className: "text-4xl font-bold text-green-400 leading-tight drop-shadow-lg" },
                    "Welcome, ",
                    userProfile.firstName,
                    " ",
                    userProfile.lastName),
                react_1["default"].createElement("p", { className: "text-lg text-gray-300 mt-2 tracking-wide italic" },
                    "Computer Science - ",
                    userProfile.universityName),
                react_1["default"].createElement("p", { className: "text-lg mt-2" },
                    "Roll Number: ",
                    react_1["default"].createElement("span", { className: "font-bold" }, userProfile.rollNumber)),
                react_1["default"].createElement("p", { className: "text-lg" },
                    "User ID: ",
                    react_1["default"].createElement("span", { className: "font-bold" }, userProfile.userId)),
                react_1["default"].createElement("div", { className: "w-full h-1 bg-gray-400 my-6" }),
                react_1["default"].createElement("div", { className: "flex justify-center md:justify-start space-x-4" },
                    react_1["default"].createElement("button", { onClick: goToEditProfile, className: "px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-500 hover:shadow-blue-500/50 transition duration-300 transform hover:scale-105" }, "Edit Profile"),
                    react_1["default"].createElement("button", { onClick: gotoProfile, className: "px-8 py-3 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-500 hover:shadow-purple-500/50 transition duration-300 transform hover:scale-105" }, "View Profile")))),
        react_1["default"].createElement("section", { className: "relative py-16 bg-gray-900" },
            react_1["default"].createElement("div", { className: "absolute inset-y-0 right-0 w-1/3 bg-cover bg-center opacity-20", style: { backgroundImage: "url('/projectBG.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat" } }),
            react_1["default"].createElement("div", { className: "relative max-w-7xl mx-auto mb-16 px-4 md:px-0" },
                react_1["default"].createElement("div", { className: "text-left" },
                    react_1["default"].createElement("h2", { className: "text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500" }, "Completed Projects"))),
            react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12" }, projects.length > 0 ? (projects.map(function (project) { return (react_1["default"].createElement(framer_motion_1.motion.div, { key: project.id, whileHover: { scale: 1.05 }, className: "bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105" },
                react_1["default"].createElement("h3", { className: "text-2xl font-bold text-green-300 mb-4" }, project.title),
                react_1["default"].createElement("p", { className: "text-gray-400 mb-4" }, project.description),
                react_1["default"].createElement("div", { className: "text-left mt-4" },
                    react_1["default"].createElement("p", { className: "text-sm text-gray-400" },
                        react_1["default"].createElement("span", { className: "font-bold text-gray-300" }, "Status:"),
                        " Completed"),
                    react_1["default"].createElement("p", { className: "text-sm text-gray-400" },
                        react_1["default"].createElement("span", { className: "font-bold text-gray-300" }, "Duration:"),
                        " 6 months")),
                react_1["default"].createElement("div", { className: "mt-6 text-right" },
                    react_1["default"].createElement("button", { onClick: goToProjectsPage, className: "text-blue-400 hover:text-blue-600 underline text-sm font-semibold transition-colors" }, "Click for More")))); })) : (react_1["default"].createElement("p", { className: "text-gray-400 text-center col-span-3" }, "No completed projects available."))),
            react_1["default"].createElement("div", { className: "mt-12 text-center space-x-6" },
                react_1["default"].createElement("button", { onClick: goToProjectsPage, className: "px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-teal-600 transition transform hover:scale-105" }, "See More Projects"),
                react_1["default"].createElement("button", { onClick: createEvents, className: "px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-md hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105" }, "Create Projects"))),
        react_1["default"].createElement("section", { className: "py-16 bg-gray-900" },
            react_1["default"].createElement("div", { className: "relative max-w-7xl mx-auto mb-16 px-4 md:px-0" },
                react_1["default"].createElement("h1", { className: "text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500" }, "Upcoming University Events")),
            react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12" }, events.map(function (event, index) { return (react_1["default"].createElement("div", { key: event.id, className: "relative p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all overflow-hidden " + gradientStyles[index % gradientStyles.length] },
                react_1["default"].createElement("div", { className: "absolute inset-0 opacity-20 bg-cover bg-center" }),
                react_1["default"].createElement("div", { className: "relative z-10" },
                    react_1["default"].createElement("h2", { className: "text-xl font-semibold text-white mb-4" }, event.title),
                    react_1["default"].createElement("p", { className: "text-gray-200 mb-2" },
                        "Speaker: ",
                        event.speakerName),
                    react_1["default"].createElement("p", { className: "text-gray-300 mb-4" },
                        "Date: ",
                        new Date(event.eventDate).toLocaleDateString(),
                        " | Venue: ",
                        event.venue)))); })),
            react_1["default"].createElement("div", { className: "flex justify-center space-x-6 mt-12" },
                react_1["default"].createElement("button", { onClick: goToEventsPage, className: "px-10 py-4 bg-green-400 text-white font-bold rounded-full shadow-lg hover:shadow-green-400/50 transition duration-300 ease-in-out transform hover:scale-105" }, "See More Events"))),
        react_1["default"].createElement("footer", { className: "bg-gray-800 text-gray-400 py-4 text-center rounded-lg shadow-lg mt-12" },
            react_1["default"].createElement("p", null, "\u00A9 2024 BridgeIT. All rights reserved."),
            react_1["default"].createElement("p", null, "\u00A9 Aesyem Institute Of Science & Technology"))));
};
exports["default"] = StudentPage;
