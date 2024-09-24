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
var FacultyPage = function () {
    var _a = react_1.useState(null), facultyProfile = _a[0], setFacultyProfile = _a[1];
    var _b = react_1.useState([]), events = _b[0], setEvents = _b[1];
    var _c = react_1.useState([]), researchPapers = _c[0], setResearchPapers = _c[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        function fetchProfileAndData() {
            return __awaiter(this, void 0, void 0, function () {
                var token, profileResponse, profileData, userId, facultyResponse, facultyData, facultyId, researchResponse, researchData, eventsResponse, eventsData, error_1;
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
                            _a.trys.push([1, 16, , 17]);
                            return [4 /*yield*/, fetch('https://localhost:7053/api/auth/authorized-user-info', {
                                    method: 'GET',
                                    headers: {
                                        Authorization: "Bearer " + token
                                    }
                                })];
                        case 2:
                            profileResponse = _a.sent();
                            if (!profileResponse.ok) return [3 /*break*/, 14];
                            return [4 /*yield*/, profileResponse.json()];
                        case 3:
                            profileData = _a.sent();
                            userId = profileData.userId;
                            return [4 /*yield*/, fetch("https://localhost:7053/api/get-faculty/faculty-by-id/" + userId, {
                                    method: 'GET',
                                    headers: {
                                        Authorization: "Bearer " + token
                                    }
                                })];
                        case 4:
                            facultyResponse = _a.sent();
                            if (!facultyResponse.ok) return [3 /*break*/, 12];
                            return [4 /*yield*/, facultyResponse.json()];
                        case 5:
                            facultyData = _a.sent();
                            setFacultyProfile({
                                userId: facultyData.userId,
                                firstName: facultyData.firstName,
                                lastName: facultyData.lastName,
                                role: profileData.role,
                                imageData: facultyData.imageData
                            });
                            facultyId = facultyData.id;
                            return [4 /*yield*/, fetch("https://localhost:7053/api/ResearchWork/get-researchwork-by-id/" + facultyId, {
                                    method: 'GET',
                                    headers: {
                                        Authorization: "Bearer " + token
                                    }
                                })];
                        case 6:
                            researchResponse = _a.sent();
                            if (!researchResponse.ok) return [3 /*break*/, 8];
                            return [4 /*yield*/, researchResponse.json()];
                        case 7:
                            researchData = _a.sent();
                            setResearchPapers(researchData.slice(0, 3));
                            _a.label = 8;
                        case 8: return [4 /*yield*/, fetch('https://localhost:7053/api/Events/get-events', {
                                method: 'GET',
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                        case 9:
                            eventsResponse = _a.sent();
                            if (!eventsResponse.ok) return [3 /*break*/, 11];
                            return [4 /*yield*/, eventsResponse.json()];
                        case 10:
                            eventsData = _a.sent();
                            setEvents(eventsData);
                            _a.label = 11;
                        case 11: return [3 /*break*/, 13];
                        case 12:
                            router.push('/unauthorized');
                            _a.label = 13;
                        case 13: return [3 /*break*/, 15];
                        case 14:
                            router.push('/unauthorized');
                            _a.label = 15;
                        case 15: return [3 /*break*/, 17];
                        case 16:
                            error_1 = _a.sent();
                            console.error('Failed to fetch profile or data:', error_1);
                            router.push('/unauthorized');
                            return [3 /*break*/, 17];
                        case 17: return [2 /*return*/];
                    }
                });
            });
        }
        fetchProfileAndData();
    }, [router]);
    var handleLogout = function () {
        localStorage.removeItem("jwtToken");
        router.push("/auth/login-user");
    };
    var goToEventsPage = function () {
        router.push("/faculty/events");
    };
    var handleCreateEvent = function () {
        router.push("/faculty/events/create");
    };
    var gradientStyles = [
        'bg-gradient-to-r from-green-400 to-blue-500',
        'bg-gradient-to-r from-purple-400 to-pink-500',
        'bg-gradient-to-r from-yellow-400 to-red-500',
        'bg-gradient-to-r from-indigo-400 to-purple-600',
        'bg-gradient-to-r from-orange-400 to-pink-500',
    ];
    if (!facultyProfile) {
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "Loading...");
    }
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gray-900 text-gray-100 p-6" },
        react_1["default"].createElement("nav", { className: "bg-gray-800 shadow-md rounded-lg mb-6 p-4 flex justify-between items-center" },
            react_1["default"].createElement("div", { className: "flex items-center space-x-6" },
                react_1["default"].createElement("h1", { className: "text-2xl font-extrabold text-green-500" }, "Faculty Dashboard"),
                react_1["default"].createElement("div", { className: "hidden md:flex space-x-8" },
                    react_1["default"].createElement("button", { onClick: function () { return router.push('/faculty/profile'); }, className: "text-gray-100 hover:text-green-400 transition-colors duration-300" }, "Profile"),
                    react_1["default"].createElement("button", { onClick: function () { return router.push('/faculty/events'); }, className: "text-gray-100 hover:text-green-400 transition-colors duration-300" }, "Events"),
                    react_1["default"].createElement("button", { onClick: function () { return router.push('/faculty/researchpaper'); }, className: "text-gray-100 hover:text-green-400 transition-colors duration-300" }, "Research Work"))),
            react_1["default"].createElement("button", { onClick: handleLogout, className: "py-2 px-4 bg-green-400 text-white font-semibold rounded-lg hover:bg-red-500 transition duration-200 shadow-md" }, "Logout")),
        facultyProfile && (react_1["default"].createElement("div", { className: "relative flex flex-col md:flex-row justify-between items-center bg-gray-800 bg-opacity-80 p-12 rounded-2xl shadow-2xl mb-8 overflow-hidden", style: { backgroundImage: "url('/Air_University_BCKG.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '600px' } },
            react_1["default"].createElement("div", { className: "absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" }),
            react_1["default"].createElement("div", { className: "relative z-10 md:w-1/2 flex flex-col space-y-8 text-left text-white" },
                react_1["default"].createElement("h1", { className: "text-6xl font-bold text-green-400 leading-tight drop-shadow-2xl" },
                    "Welcome, ",
                    facultyProfile.firstName,
                    " ",
                    facultyProfile.lastName),
                react_1["default"].createElement("p", { className: "text-lg text-gray-300 tracking-wide italic" }, facultyProfile.role),
                react_1["default"].createElement("div", { className: "flex space-x-8 mt-4" },
                    react_1["default"].createElement("div", { className: "text-center" },
                        react_1["default"].createElement("h3", { className: "text-gray-300 uppercase tracking-wider text-sm" }, "Projects"),
                        react_1["default"].createElement("p", { className: "text-5xl font-extrabold text-white drop-shadow-lg" }, "12")),
                    react_1["default"].createElement("div", { className: "text-center" },
                        react_1["default"].createElement("h3", { className: "text-gray-300 uppercase tracking-wider text-sm" }, "Experience"),
                        react_1["default"].createElement("p", { className: "text-5xl font-extrabold text-white drop-shadow-lg" }, "8 yrs")),
                    react_1["default"].createElement("div", { className: "text-center" },
                        react_1["default"].createElement("h3", { className: "text-gray-300 uppercase tracking-wider text-sm" }, "Nationality"),
                        react_1["default"].createElement("p", { className: "text-5xl font-extrabold text-white drop-shadow-lg" }, "IDN \uD83C\uDDEE\uD83C\uDDE9"))),
                react_1["default"].createElement("div", { className: "flex space-x-6 mt-10" },
                    react_1["default"].createElement("button", { onClick: function () { return router.push('/faculty/profile'); }, className: "px-10 py-4 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:scale-105" }, "View Profile"),
                    react_1["default"].createElement("button", { onClick: function () { return router.push('/faculty/profile/editfaculty'); }, className: "px-10 py-4 bg-purple-500 text-white font-bold rounded-full shadow-lg hover:shadow-purple-500/50 transition duration-300 transform hover:scale-105" }, "Edit Profile"))),
            react_1["default"].createElement("div", { className: "relative z-10 mt-6 md:mt-0 md:w-1/2 flex justify-center" },
                react_1["default"].createElement("img", { src: "data:image/jpeg;base64," + facultyProfile.imageData, alt: facultyProfile.firstName + " " + facultyProfile.lastName, className: "w-80 h-80 rounded-full border-4 border-green-300 object-cover shadow-2xl transform hover:scale-110 transition duration-300" })))),
        react_1["default"].createElement("div", { className: "flex flex-col md:flex-row justify-between items-center bg-gray-900 p-12 rounded-lg shadow-2xl mb-12 overflow-hidden mt-16 relative" },
            react_1["default"].createElement("div", { className: "md:w-1/2 space-y-6 text-left text-white relative z-10" },
                react_1["default"].createElement("h1", { className: "text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500" }, "Explore Cutting-Edge Research"),
                react_1["default"].createElement("p", { className: "text-xl text-gray-300" }, "Our dedicated faculty members contribute groundbreaking research across various fields. Dive into the innovation that's shaping the future."),
                react_1["default"].createElement("div", { className: "flex space-x-6 mt-8" },
                    react_1["default"].createElement("button", { onClick: goToEventsPage, className: "px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-blue-600 transition transform hover:scale-105" }, "See More Research"),
                    react_1["default"].createElement("button", { onClick: handleCreateEvent, className: "px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105" }, "Create Research Paper"))),
            react_1["default"].createElement("div", { className: "md:w-1/2 flex justify-center mt-8 md:mt-0 relative z-10" },
                react_1["default"].createElement("img", { src: "/Research-Work.png", alt: "Research Work", className: "w-full max-w-lg object-cover rounded-lg shadow-2xl transform hover:scale-105 transition" }))),
        react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12" }, researchPapers.map(function (paper) { return (react_1["default"].createElement("div", { key: paper.id, className: "bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105" },
            react_1["default"].createElement("h3", { className: "text-2xl font-semibold text-green-400" }, paper.paperName),
            react_1["default"].createElement("p", { className: "text-gray-400 mt-4" },
                "Published in: ",
                paper.publishChannel),
            react_1["default"].createElement("p", { className: "text-gray-500 mt-2" },
                "Year: ",
                paper.yearOfPublish),
            react_1["default"].createElement("a", { href: paper.link, target: "_blank", className: "text-blue-400 mt-6 inline-block font-semibold hover:text-blue-500" }, "Read Full Paper"))); })),
        react_1["default"].createElement("div", { className: "mt-16 bg-gray-900 p-12 rounded-lg shadow-2xl" },
            react_1["default"].createElement("div", { className: "flex flex-col md:flex-row items-center justify-between mb-12" },
                react_1["default"].createElement("div", { className: "relative w-full md:w-1/2 flex justify-center mb-8 md:mb-0" },
                    react_1["default"].createElement("img", { src: "/calender.png", alt: "Calendar", className: "w-64 h-auto transform rotate-6 opacity-90" })),
                react_1["default"].createElement("div", { className: "w-full md:w-1/2 text-left" },
                    react_1["default"].createElement("h1", { className: "text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500" }, "Upcoming University Events"),
                    react_1["default"].createElement("p", { className: "text-lg text-gray-300 mb-8" }, "Stay up to date with the latest events happening at the university. Don\u2019t miss out on seminars, workshops, and more!"))),
            react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }, events.map(function (event, index) { return (react_1["default"].createElement("div", { key: event.id, className: "relative p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all overflow-hidden " + gradientStyles[index % gradientStyles.length] },
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
                        event.venue),
                    react_1["default"].createElement("a", { href: "#", className: "text-white font-semibold hover:underline" }, "Learn More")))); })),
            react_1["default"].createElement("div", { className: "flex justify-center space-x-6 mt-8" },
                react_1["default"].createElement("button", { onClick: goToEventsPage, className: "px-10 py-4 bg-green-400 text-white font-bold rounded-full shadow-lg hover:shadow-green-400/50 transition duration-300 ease-in-out transform hover:scale-105" }, "See More Events"),
                react_1["default"].createElement("button", { onClick: handleCreateEvent, className: "px-10 py-4 bg-green-400 text-white font-bold rounded-full shadow-lg hover:shadow-green-400/50 transition duration-300 ease-in-out transform hover:scale-105" }, "Create Event")))));
};
exports["default"] = FacultyPage;
