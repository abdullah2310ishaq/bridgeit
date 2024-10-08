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
var lucide_react_1 = require("lucide-react");
var FacultyProfilePage = function () {
    var _a = react_1.useState(null), facultyProfile = _a[0], setFacultyProfile = _a[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        function fetchFacultyProfile() {
            return __awaiter(this, void 0, void 0, function () {
                var token, profileResponse, profileData, userId, facultyResponse, facultyData, error_1;
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
                            return [4 /*yield*/, fetch("https://localhost:7053/api/get-faculty/faculty-by-id/" + userId, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': "Bearer " + token
                                    }
                                })];
                        case 4:
                            facultyResponse = _a.sent();
                            if (!facultyResponse.ok) return [3 /*break*/, 6];
                            return [4 /*yield*/, facultyResponse.json()];
                        case 5:
                            facultyData = _a.sent();
                            setFacultyProfile({
                                userId: facultyData.userId,
                                uniId: facultyData.uniId,
                                firstName: facultyData.firstName || 'N/A',
                                lastName: facultyData.lastName || 'N/A',
                                email: facultyData.email || 'N/A',
                                imageData: facultyData.imageData || '',
                                interest: facultyData.interest || [],
                                post: facultyData.post || 'N/A',
                                universityName: facultyData.universityName || 'N/A',
                                address: facultyData.address || 'N/A',
                                uniImage: facultyData.uniImage || ''
                            });
                            return [3 /*break*/, 7];
                        case 6:
                            console.error('Failed to fetch faculty profile:', facultyResponse.statusText);
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
                            console.error('An error occurred while fetching the faculty profile:', error_1);
                            router.push('/unauthorized');
                            return [3 /*break*/, 11];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        }
        fetchFacultyProfile();
    }, [router]);
    var goBack = function () {
        router.push('/faculty');
    };
    var editProfile = function () {
        router.push('/faculty/profile/edit');
    };
    if (!facultyProfile) {
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "Loading...");
    }
    return (react_1["default"].createElement("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4 sm:p-8" },
        react_1["default"].createElement("div", { className: "w-full max-w-4xl bg-gray-800 shadow-2xl rounded-2xl overflow-hidden" },
            react_1["default"].createElement("div", { className: "bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8" },
                react_1["default"].createElement("div", { className: "flex items-center justify-between mb-6" },
                    react_1["default"].createElement("h1", { className: "text-3xl sm:text-4xl font-bold" }, "Faculty Profile"),
                    react_1["default"].createElement("div", { className: "flex space-x-4" },
                        react_1["default"].createElement("button", { onClick: goBack, className: "px-4 py-2 bg-gray-800 text-gray-100 rounded-full hover:bg-gray-700 transition duration-300 flex items-center" },
                            react_1["default"].createElement(lucide_react_1.ArrowLeft, { className: "w-4 h-4 mr-2" }),
                            "Back"),
                        react_1["default"].createElement("button", { onClick: editProfile, className: "px-4 py-2 bg-blue-500 text-gray-100 rounded-full hover:bg-blue-400 transition duration-300 flex items-center" },
                            react_1["default"].createElement(lucide_react_1.Edit, { className: "w-4 h-4 mr-2" }),
                            "Edit Profile"))),
                react_1["default"].createElement("div", { className: "flex justify-center -mb-20" },
                    react_1["default"].createElement("img", { src: "data:image/jpeg;base64," + facultyProfile.imageData, alt: facultyProfile.firstName + "'s profile picture", className: "w-40 h-40 rounded-full border-4 border-gray-800 shadow-lg object-cover" }))),
            react_1["default"].createElement("div", { className: "pt-24 px-6 sm:px-8 pb-8" },
                react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8" },
                    react_1["default"].createElement("div", { className: "bg-gray-700 p-6 rounded-xl shadow-md" },
                        react_1["default"].createElement("h2", { className: "text-2xl font-semibold text-blue-400 mb-4 flex items-center" },
                            react_1["default"].createElement(lucide_react_1.Briefcase, { className: "w-6 h-6 mr-2" }),
                            "Personal Information"),
                        react_1["default"].createElement("p", { className: "text-lg mb-2" },
                            react_1["default"].createElement("strong", null, "Name:"),
                            " ",
                            facultyProfile.firstName,
                            " ",
                            facultyProfile.lastName),
                        react_1["default"].createElement("p", { className: "text-lg mb-2 flex items-center" },
                            react_1["default"].createElement(lucide_react_1.Mail, { className: "w-5 h-5 mr-2 text-gray-400" }),
                            react_1["default"].createElement("strong", null, "Email:"),
                            " ",
                            facultyProfile.email),
                        react_1["default"].createElement("p", { className: "text-lg mb-2 flex items-center" },
                            react_1["default"].createElement(lucide_react_1.Briefcase, { className: "w-5 h-5 mr-2 text-gray-400" }),
                            react_1["default"].createElement("strong", null, "Post:"),
                            " ",
                            facultyProfile.post),
                        react_1["default"].createElement("p", { className: "text-lg mb-2 flex items-start" },
                            react_1["default"].createElement(lucide_react_1.Book, { className: "w-5 h-5 mr-2 mt-1 text-gray-400" }),
                            react_1["default"].createElement("span", null,
                                react_1["default"].createElement("strong", null, "Interest:"),
                                " ",
                                facultyProfile.interest.length > 0 ? facultyProfile.interest.join(', ') : 'No interests available'))),
                    react_1["default"].createElement("div", { className: "bg-gray-700 p-6 rounded-xl shadow-md" },
                        react_1["default"].createElement("h2", { className: "text-2xl font-semibold text-blue-400 mb-4 flex items-center" },
                            react_1["default"].createElement(lucide_react_1.School, { className: "w-6 h-6 mr-2" }),
                            "University Information"),
                        react_1["default"].createElement("p", { className: "text-lg mb-2 flex items-center" },
                            react_1["default"].createElement(lucide_react_1.School, { className: "w-5 h-5 mr-2 text-gray-400" }),
                            react_1["default"].createElement("strong", null, "University:"),
                            " ",
                            facultyProfile.universityName),
                        react_1["default"].createElement("p", { className: "text-lg mb-2 flex items-start" },
                            react_1["default"].createElement(lucide_react_1.MapPin, { className: "w-5 h-5 mr-2 mt-1 text-gray-400" }),
                            react_1["default"].createElement("span", null,
                                react_1["default"].createElement("strong", null, "Address:"),
                                " ",
                                facultyProfile.address)),
                        facultyProfile.uniImage && (react_1["default"].createElement("div", { className: "mt-6" },
                            react_1["default"].createElement("img", { src: "data:image/jpeg;base64," + facultyProfile.uniImage, alt: facultyProfile.universityName + " image", className: "w-full h-40 object-cover rounded-lg shadow-md" })))))),
            react_1["default"].createElement("div", { className: "flex justify-center pb-8" },
                react_1["default"].createElement("button", { onClick: editProfile, className: "px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-gray-100 font-bold rounded-full shadow-md hover:from-blue-700 hover:to-purple-700 transition duration-300 flex items-center" },
                    react_1["default"].createElement(lucide_react_1.Edit, { className: "w-5 h-5 mr-2" }),
                    "Edit Profile")))));
};
exports["default"] = FacultyProfilePage;
