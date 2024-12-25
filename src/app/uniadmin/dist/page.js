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
var fa_1 = require("react-icons/fa");
var react_toastify_1 = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
var framer_motion_1 = require("framer-motion");
var UniAdminDashboard = function () {
    var _a = react_1.useState(null), adminProfile = _a[0], setAdminProfile = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState(0), studentsCount = _d[0], setStudentsCount = _d[1];
    var _e = react_1.useState(0), facultiesCount = _e[0], setFacultiesCount = _e[1];
    var _f = react_1.useState(''), query = _f[0], setQuery = _f[1];
    var _g = react_1.useState('student'), searchType = _g[0], setSearchType = _g[1];
    var _h = react_1.useState([]), results = _h[0], setResults = _h[1];
    var _j = react_1.useState(false), searchLoading = _j[0], setSearchLoading = _j[1];
    var _k = react_1.useState(''), searchError = _k[0], setSearchError = _k[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        var token = localStorage.getItem('jwtToken');
        if (!token) {
            router.push('/auth/login-user');
            return;
        }
        var fetchAdminProfile = function () { return __awaiter(void 0, void 0, void 0, function () {
            var profileResponse, profileData, role, userId, adminResponse, adminData, studentsResponse, facultiesResponse, studentsData, facultiesData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, 10, 11]);
                        return [4 /*yield*/, fetch('https://localhost:7053/api/auth/authorized-user-info', {
                                method: 'GET',
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 1:
                        profileResponse = _a.sent();
                        if (!profileResponse.ok) {
                            throw new Error('Failed to fetch authorized user info');
                        }
                        return [4 /*yield*/, profileResponse.json()];
                    case 2:
                        profileData = _a.sent();
                        role = profileData.role;
                        if (role !== 'UniversityAdmin') {
                            react_toastify_1.toast.error("You are not authorized to access this page.");
                            router.push('/unauthorized');
                            return [2 /*return*/];
                        }
                        userId = profileData.userId;
                        return [4 /*yield*/, fetch("https://localhost:7053/api/get-uni-admins/admins-by-id/" + userId, {
                                method: 'GET',
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 3:
                        adminResponse = _a.sent();
                        if (!adminResponse.ok)
                            throw new Error('Failed to fetch University Admin profile');
                        return [4 /*yield*/, adminResponse.json()];
                    case 4:
                        adminData = _a.sent();
                        setAdminProfile({
                            firstName: adminData.firstName,
                            lastName: adminData.lastName,
                            email: adminData.email,
                            officeAddress: adminData.officeAddress,
                            contact: adminData.contact,
                            university: adminData.university,
                            profileImage: adminData.profileImage
                        });
                        return [4 /*yield*/, fetch("https://localhost:7053/api/get-student/student-by-university/" + adminData.university, {
                                headers: { Authorization: "Bearer " + token }
                            })];
                    case 5:
                        studentsResponse = _a.sent();
                        return [4 /*yield*/, fetch("https://localhost:7053/api/get-faculty/faculty-by-university/" + adminData.university, {
                                headers: { Authorization: "Bearer " + token }
                            })];
                    case 6:
                        facultiesResponse = _a.sent();
                        if (!studentsResponse.ok || !facultiesResponse.ok) {
                            throw new Error('Failed to fetch university data');
                        }
                        return [4 /*yield*/, studentsResponse.json()];
                    case 7:
                        studentsData = _a.sent();
                        return [4 /*yield*/, facultiesResponse.json()];
                    case 8:
                        facultiesData = _a.sent();
                        setStudentsCount(studentsData.length);
                        setFacultiesCount(facultiesData.length);
                        return [3 /*break*/, 11];
                    case 9:
                        error_1 = _a.sent();
                        setError('Failed to load profile or university data');
                        react_toastify_1.toast.error("An error occurred while fetching data.");
                        console.error('Error fetching data:', error_1);
                        return [3 /*break*/, 11];
                    case 10:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        }); };
        fetchAdminProfile();
    }, [router]);
    var handleLogout = function () {
        localStorage.removeItem('jwtToken');
        router.push('/auth/login-user');
    };
    var handleSearch = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, _a, data, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!adminProfile)
                        return [2 /*return*/];
                    setSearchLoading(true);
                    setSearchError('');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, 10, 11]);
                    response = void 0;
                    _a = searchType;
                    switch (_a) {
                        case 'student': return [3 /*break*/, 2];
                        case 'faculty': return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 6];
                case 2: return [4 /*yield*/, fetch("https://localhost:7053/api/get-student/student-by-name/" + query + "?university=" + adminProfile.university)];
                case 3:
                    response = _b.sent();
                    return [3 /*break*/, 7];
                case 4: return [4 /*yield*/, fetch("https://localhost:7053/api/get-faculty/faculty-by-name/" + query + "?university=" + adminProfile.university)];
                case 5:
                    response = _b.sent();
                    return [3 /*break*/, 7];
                case 6: throw new Error('Invalid search type');
                case 7:
                    if (!response.ok) {
                        throw new Error('Not Found! Try Creating One');
                    }
                    return [4 /*yield*/, response.json()];
                case 8:
                    data = _b.sent();
                    if (data.length === 0) {
                        setResults([]);
                        setSearchError('No results found');
                    }
                    else {
                        setResults(data);
                    }
                    return [3 /*break*/, 11];
                case 9:
                    err_1 = _b.sent();
                    setSearchError(err_1.message || 'An error occurred');
                    setResults([]);
                    return [3 /*break*/, 11];
                case 10:
                    setSearchLoading(false);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    if (loading)
        return react_1["default"].createElement("div", { className: "flex items-center justify-center h-screen bg-gray-900" },
            react_1["default"].createElement("div", { className: "animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" }));
    if (error)
        return react_1["default"].createElement("div", { className: "flex items-center justify-center h-screen bg-gray-900" },
            react_1["default"].createElement("div", { className: "text-red-500 text-2xl" }, error));
    return (react_1["default"].createElement("div", { className: "flex h-screen bg-gray-900 text-gray-200" },
        react_1["default"].createElement("div", { className: "w-64 bg-gray-800 shadow-lg" },
            react_1["default"].createElement("div", { className: "p-6 border-b border-gray-700" },
                react_1["default"].createElement("h2", { className: "text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400" }, "Admin Dashboard")),
            react_1["default"].createElement("nav", { className: "mt-6" },
                react_1["default"].createElement("a", { onClick: function () { return router.push("uniadmin/profile"); }, className: "flex items-center py-3 px-6 text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-gray-600 hover:text-white cursor-pointer" },
                    react_1["default"].createElement(fa_1.FaUser, { className: "mr-3" }),
                    "Profile"),
                react_1["default"].createElement("a", { onClick: function () { return router.push("uniadmin/fyprequests"); }, className: "flex items-center py-3 px-6 text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-gray-600 hover:text-white cursor-pointer" },
                    react_1["default"].createElement(fa_1.FaProjectDiagram, { className: "mr-3" }),
                    "FYP Requests"),
                react_1["default"].createElement("button", { onClick: handleLogout, className: "flex items-center w-full py-3 px-6 text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-gray-600 hover:text-white" },
                    react_1["default"].createElement(fa_1.FaSignOutAlt, { className: "mr-3" }),
                    "Logout"))),
        react_1["default"].createElement("div", { className: "flex-1 overflow-y-auto p-8" },
            react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
                react_1["default"].createElement(framer_motion_1.motion.div, { className: "bg-gray-800 rounded-lg shadow-lg p-6 col-span-1 md:col-span-2 lg:col-span-3 border border-gradient-to-r from-blue-500 to-green-500", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } },
                    react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                        react_1["default"].createElement("div", { className: "flex flex-col items-center text-center md:items-start md:text-left" },
                            react_1["default"].createElement("img", { src: "data:image/png;base64," + (adminProfile === null || adminProfile === void 0 ? void 0 : adminProfile.profileImage), alt: "Admin Profile", className: "w-24 h-24 rounded-full border-4 border-blue-500 shadow-md mb-4" }),
                            react_1["default"].createElement("h2", { className: "text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" }, adminProfile === null || adminProfile === void 0 ? void 0 :
                                adminProfile.firstName,
                                " ", adminProfile === null || adminProfile === void 0 ? void 0 :
                                adminProfile.lastName),
                            react_1["default"].createElement("p", { className: "text-gray-300" }, adminProfile === null || adminProfile === void 0 ? void 0 : adminProfile.university),
                            react_1["default"].createElement("p", { className: "text-gray-300" }, adminProfile === null || adminProfile === void 0 ? void 0 : adminProfile.email)),
                        react_1["default"].createElement("div", { className: "flex flex-col justify-between" },
                            react_1["default"].createElement("div", { className: "mb-4" },
                                react_1["default"].createElement("h3", { className: "text-2xl font-semibold text-gray-300 mb-2" }, "Office Information"),
                                react_1["default"].createElement("p", { className: "text-gray-400 flex items-center" },
                                    react_1["default"].createElement(fa_1.FaAddressCard, { className: "mr-2 text-blue-400" }),
                                    " ", adminProfile === null || adminProfile === void 0 ? void 0 :
                                    adminProfile.officeAddress),
                                react_1["default"].createElement("p", { className: "text-gray-400 flex items-center mt-2" },
                                    react_1["default"].createElement(fa_1.FaPhone, { className: "mr-2 text-green-400" }),
                                    " ", adminProfile === null || adminProfile === void 0 ? void 0 :
                                    adminProfile.contact)),
                            react_1["default"].createElement("button", { onClick: function () { return router.push("uniadmin/profile/edituniadmin"); }, className: "w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:opacity-90 flex items-center justify-center space-x-2" },
                                react_1["default"].createElement(fa_1.FaEdit, null),
                                react_1["default"].createElement("span", null, "Edit Profile")))),
                    react_1["default"].createElement("div", { className: "mt-6 border-t border-gray-700" })),
                react_1["default"].createElement(framer_motion_1.motion.div, { className: "bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 } },
                    react_1["default"].createElement("h3", { className: "text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-4" }, "Students"),
                    react_1["default"].createElement("div", { className: "flex items-center" },
                        react_1["default"].createElement(fa_1.FaGraduationCap, { className: "text-4xl text-blue-400 mr-4" }),
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("p", { className: "text-3xl font-bold text-white" }, studentsCount),
                            react_1["default"].createElement("p", { className: "text-gray-400" }, "Total Enrolled")))),
                react_1["default"].createElement(framer_motion_1.motion.div, { className: "bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.3 } },
                    react_1["default"].createElement("h3", { className: "text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4" }, "Faculties"),
                    react_1["default"].createElement("div", { className: "flex items-center" },
                        react_1["default"].createElement(fa_1.FaChalkboardTeacher, { className: "text-4xl text-green-400 mr-4" }),
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("p", { className: "text-3xl font-bold text-white" }, facultiesCount),
                            react_1["default"].createElement("p", { className: "text-gray-400" }, "Total Faculty Members")))),
                react_1["default"].createElement(framer_motion_1.motion.div, { className: "bg-gray-800 rounded-lg shadow-lg p-6 col-span-1 md:col-span-2 lg:col-span-3 border border-gray-700", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.4 } },
                    react_1["default"].createElement("h2", { className: "text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-6" },
                        "Search ", adminProfile === null || adminProfile === void 0 ? void 0 :
                        adminProfile.university),
                    react_1["default"].createElement("div", { className: "flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4" },
                        react_1["default"].createElement("input", { type: "text", value: query, onChange: function (e) { return setQuery(e.target.value); }, placeholder: "Enter name", className: "p-3 w-full md:w-1/2 border border-gray-600 bg-gray-900 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }),
                        react_1["default"].createElement("select", { value: searchType, onChange: function (e) { return setSearchType(e.target.value); }, className: "p-3 w-full md:w-auto border border-gray-600 bg-gray-900 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" },
                            react_1["default"].createElement("option", { value: "student" }, "Student"),
                            react_1["default"].createElement("option", { value: "faculty" }, "Faculty")),
                        react_1["default"].createElement("button", { onClick: handleSearch, className: "p-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md hover:opacity-90 transition duration-300 flex items-center justify-center w-full md:w-auto" },
                            react_1["default"].createElement(fa_1.FaSearch, { className: "mr-2" }),
                            "Search")),
                    react_1["default"].createElement("div", { className: "mt-8" },
                        searchLoading && react_1["default"].createElement("p", { className: "text-gray-600 text-center" }, "Loading..."),
                        searchError && react_1["default"].createElement("p", { className: "text-red-500 text-center" }, searchError),
                        !searchLoading && !searchError && results.length === 0 && (react_1["default"].createElement("p", { className: "text-gray-600 text-center" })),
                        react_1["default"].createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6" }, results.map(function (result) { return (react_1["default"].createElement("div", { key: result.userId, className: "bg-gray-900 p-6 rounded-lg shadow-sm" },
                            react_1["default"].createElement("img", { src: result.imageData ? "data:image/png;base64," + result.imageData : '/placeholder.png', alt: result.firstName + " " + result.lastName, className: "w-20 h-20 rounded-full mx-auto mb-4" }),
                            react_1["default"].createElement("h3", { className: "text-lg font-semibold text-gray-500 text-center mb-2" },
                                result.firstName,
                                " ",
                                result.lastName),
                            react_1["default"].createElement("p", { className: "text-gray-400 text-center mb-2" }, result.email),
                            react_1["default"].createElement("p", { className: "text-gray-400 text-center text-sm" }, searchType.charAt(0).toUpperCase() + searchType.slice(1)))); })))))),
        react_1["default"].createElement(react_toastify_1.ToastContainer, null)));
};
exports["default"] = UniAdminDashboard;
