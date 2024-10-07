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
var framer_motion_1 = require("framer-motion");
var fa_1 = require("react-icons/fa");
var image_1 = require("next/image"); // Next.js Image component
var ProfilePage = function () {
    var _a = react_1.useState(null), studentProfile = _a[0], setStudentProfile = _a[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        function fetchStudentProfile() {
            return __awaiter(this, void 0, void 0, function () {
                var token, profileResponse, profileData, userId, studentResponse, studentData, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            token = localStorage.getItem('jwtToken');
                            if (!token) {
                                router.push('/unauthorized');
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 10, , 11]);
                            return [4 /*yield*/, fetch('https://localhost:7053/api/auth/authorized-user-info', {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': "Bearer " + token
                                    }
                                })];
                        case 2:
                            profileResponse = _a.sent();
                            if (!profileResponse.ok) return [3 /*break*/, 8];
                            return [4 /*yield*/, profileResponse.json()];
                        case 3:
                            profileData = _a.sent();
                            userId = profileData.userId;
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
                            setStudentProfile({
                                userId: studentData.userId,
                                firstName: studentData.firstName || 'N/A',
                                lastName: studentData.lastName || 'N/A',
                                email: studentData.email || 'N/A',
                                imageData: studentData.imageData || '',
                                universityName: studentData.universityName || 'N/A',
                                address: studentData.address || 'N/A',
                                rollNumber: studentData.rollNumber || 'N/A',
                                skills: studentData.skills || [],
                                description: studentData.description || 'No description provided.'
                            });
                            return [3 /*break*/, 7];
                        case 6:
                            console.error('Failed to fetch student profile:', studentResponse.statusText);
                            router.push('/unauthorized');
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            console.error('Failed to fetch user info:', profileResponse.statusText);
                            router.push('/unauthorized');
                            _a.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            error_1 = _a.sent();
                            console.error('An error occurred while fetching the student profile:', error_1);
                            router.push('/unauthorized');
                            return [3 /*break*/, 11];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        }
        fetchStudentProfile();
    }, [router]);
    var goBack = function () {
        router.push('/student');
    };
    var editProfile = function () {
        router.push('/student/profile/edit');
    };
    if (!studentProfile) {
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "Loading...");
    }
    return (react_1["default"].createElement("div", { className: "relative min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6 overflow-hidden" },
        react_1["default"].createElement("div", { className: "absolute bottom-0 right-0 z-0" },
            react_1["default"].createElement(image_1["default"], { src: "/Saly-22.png", alt: "Decorative Image", width: 600, height: 600, className: "opacity-90" // Make the image slightly transparent to blend better
             })),
        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, x: -80 }, animate: { opacity: 1, x: -80 }, transition: { duration: 0.5 }, className: "relative z-10 bg-gray-800/60 backdrop-blur-sm p-8 rounded-xl shadow-lg w-full max-w-md h-auto lg:max-w-lg" },
            react_1["default"].createElement("div", { className: "flex justify-between items-center mb-6" },
                react_1["default"].createElement("button", { onClick: goBack, className: "text-gray-400 hover:text-white transition-colors duration-300" },
                    react_1["default"].createElement(fa_1.FaArrowLeft, { size: 20 })),
                react_1["default"].createElement("h1", { className: "text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" }, "Student Profile"),
                react_1["default"].createElement("button", { onClick: editProfile, className: "text-blue-500 hover:text-blue-400 transition-colors duration-300" },
                    react_1["default"].createElement(fa_1.FaEdit, { size: 20 }))),
            react_1["default"].createElement("div", { className: "flex flex-col items-center lg:items-start" },
                react_1["default"].createElement(framer_motion_1.motion.img, { src: "data:image/jpeg;base64," + studentProfile.imageData, alt: studentProfile.firstName + "'s profile picture", className: "w-36 h-36 rounded-full mb-6 lg:mb-0 lg:mr-8 border-4 border-blue-500 object-cover shadow-2xl", initial: { scale: 0.8 }, animate: { scale: 1 }, transition: { duration: 0.5 } }),
                react_1["default"].createElement("div", { className: "flex-grow text-center lg:text-left" },
                    react_1["default"].createElement("p", { className: "text-3xl font-semibold text-white mb-2" },
                        studentProfile.firstName,
                        " ",
                        studentProfile.lastName),
                    react_1["default"].createElement("p", { className: "text-gray-400 mb-4 text-lg" }, studentProfile.email),
                    react_1["default"].createElement("div", { className: "mb-6" },
                        react_1["default"].createElement("p", { className: "font-medium text-white" }, "About Me:"),
                        react_1["default"].createElement("p", { className: "text-gray-300 mt-2" }, studentProfile.description)),
                    react_1["default"].createElement("div", { className: "grid grid-cols-1 gap-4 text-gray-300" },
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("p", { className: "font-medium text-white" }, "University:"),
                            react_1["default"].createElement("p", { className: "text-gray-400" }, studentProfile.universityName)),
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("p", { className: "font-medium text-white" }, "Address:"),
                            react_1["default"].createElement("p", { className: "text-gray-400" }, studentProfile.address)),
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("p", { className: "font-medium text-white" }, "Roll Number:"),
                            react_1["default"].createElement("p", { className: "text-gray-400" }, studentProfile.rollNumber)),
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("p", { className: "font-medium text-white" }, "Skills:"),
                            react_1["default"].createElement("div", { className: "flex flex-wrap gap-2 mt-2" }, studentProfile.skills.length > 0 ? (studentProfile.skills.map(function (skill, index) { return (react_1["default"].createElement("span", { key: index, className: "bg-blue-500 text-white py-1 px-3 rounded-full text-sm" }, skill)); })) : (react_1["default"].createElement("p", { className: "text-gray-400" }, "No skills available"))))))),
            react_1["default"].createElement("div", { className: "mt-8 flex justify-end space-x-4" },
                react_1["default"].createElement("button", { onClick: goBack, className: "py-2 px-6 bg-gradient-to-r from-indigo-400 to-purple-600 text-white rounded-lg hover:from-blue-400 hover:to-purple-500 transition duration-300" }, "Back"),
                react_1["default"].createElement("button", { onClick: editProfile, className: "py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-400 hover:to-purple-500 transition duration-300" }, "Edit Profile"))),
        react_1["default"].createElement("footer", { className: "mt-12 text-gray-500 text-sm relative z-10" },
            react_1["default"].createElement("p", null, "\u00A9 2024 BridgeIT. All rights reserved."))));
};
exports["default"] = ProfilePage;
