"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var image_1 = require("next/image");
require("react-toastify/dist/ReactToastify.css");
var framer_motion_1 = require("framer-motion");
var EditUniAdminProfile = function () {
    var _a = react_1.useState(null), profile = _a[0], setProfile = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState({
        firstName: '',
        lastName: '',
        officeAddress: '',
        contact: '',
        description: '',
        profileImage: ''
    }), form = _d[0], setForm = _d[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        var token = localStorage.getItem('jwtToken');
        if (!token) {
            router.push('/auth/login-user'); // Redirect to login if no token
            return;
        }
        var fetchProfile = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, fetch('https://localhost:7053/api/auth/authorized-user-info', {
                                method: 'GET',
                                headers: { Authorization: "Bearer " + token }
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to fetch profile');
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        setProfile(data);
                        setForm({
                            firstName: data.firstName,
                            lastName: data.lastName,
                            officeAddress: data.officeAddress || '',
                            contact: data.contact || '',
                            description: data.description || '',
                            profileImage: data.profileImage || ''
                        });
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        setError('Failed to load profile.');
                        react_toastify_1.toast.error('An error occurred while loading your profile.');
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchProfile();
    }, [router]);
    var handleInputChange = function (e) {
        var _a;
        var _b = e.target, name = _b.name, value = _b.value;
        setForm(__assign(__assign({}, form), (_a = {}, _a[name] = value, _a)));
    };
    var handleImageChange = function (e) {
        if (e.target.files && e.target.files[0]) {
            var file = e.target.files[0];
            var reader_1 = new FileReader();
            reader_1.onload = function () {
                setForm(__assign(__assign({}, form), { profileImage: reader_1.result }));
            };
            reader_1.readAsDataURL(file);
        }
    };
    var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, base64Image, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem('jwtToken');
                    if (!token)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    // Update description and other details
                    return [4 /*yield*/, fetch("https://localhost:7053/api/edit-user-profile/update-user-description/" + profile.userId, {
                            method: 'PUT',
                            headers: {
                                Authorization: "Bearer " + token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(form.description)
                        })];
                case 2:
                    // Update description and other details
                    _a.sent();
                    if (!form.profileImage) return [3 /*break*/, 4];
                    base64Image = form.profileImage.split(',')[1];
                    return [4 /*yield*/, fetch("https://localhost:7053/api/edit-user-profile/set-profile-image/" + profile.userId, {
                            method: 'PUT',
                            headers: {
                                Authorization: "Bearer " + token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(base64Image)
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    react_toastify_1.toast.success('Profile updated successfully!');
                    router.push('/uniadmin/profile'); // Redirect to dashboard
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    console.error('Error updating profile:', err_2);
                    react_toastify_1.toast.error('Failed to update profile.');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    if (loading)
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "Loading...");
    if (error)
        return react_1["default"].createElement("div", { className: "text-center text-red-500" }, error);
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-8 relative overflow-hidden" },
        react_1["default"].createElement("div", { className: "absolute inset-0 z-0" },
            react_1["default"].createElement("div", { className: "absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-30 blur-3xl" }),
            react_1["default"].createElement("div", { className: "absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-30 blur-3xl" }),
            react_1["default"].createElement("div", { className: "absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-full opacity-10 blur-2xl" })),
        react_1["default"].createElement("div", { className: "max-w-4xl w-full bg-gray-800 p-8 rounded-lg shadow-2xl relative z-10" },
            react_1["default"].createElement("div", { className: "flex items-center justify-center mb-8" },
                react_1["default"].createElement(image_1["default"], { src: "/logo.jpg", alt: "Logo", width: 80, height: 80, className: "mr-4" }),
                react_1["default"].createElement("h1", { className: "text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" }, "Edit Profile")),
            react_1["default"].createElement("div", { className: "space-y-10" },
                react_1["default"].createElement("div", { className: "text-center" },
                    react_1["default"].createElement("div", { className: "relative inline-block" },
                        form.profileImage ? (react_1["default"].createElement("img", { src: form.profileImage, alt: "Profile", className: "w-32 h-32 rounded-full border-4 border-blue-500 shadow-md hover:scale-105 transition-transform duration-300" })) : (react_1["default"].createElement("div", { className: "w-32 h-32 rounded-full bg-gray-700 border-4 border-blue-500 flex items-center justify-center text-gray-400" }, "No Image")),
                        react_1["default"].createElement("input", { type: "file", onChange: handleImageChange, className: "absolute inset-0 opacity-0 w-32 h-32 cursor-pointer", title: "Upload Image" })),
                    react_1["default"].createElement("p", { className: "text-sm text-gray-400 mt-3" }, "Click to upload a new profile image")),
                react_1["default"].createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-8" },
                    react_1["default"].createElement("div", { className: "relative" },
                        react_1["default"].createElement("input", { type: "text", name: "firstName", value: form.firstName, onChange: handleInputChange, className: "peer w-full bg-gray-700 p-4 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: " " }),
                        react_1["default"].createElement("label", { className: "absolute left-4 top-2 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-blue-400 transition-all" }, "First Name")),
                    react_1["default"].createElement("div", { className: "relative" },
                        react_1["default"].createElement("input", { type: "text", name: "lastName", value: form.lastName, onChange: handleInputChange, className: "peer w-full bg-gray-700 p-4 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: " " }),
                        react_1["default"].createElement("label", { className: "absolute left-4 top-2 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-blue-400 transition-all" }, "Last Name")),
                    react_1["default"].createElement("div", { className: "relative col-span-1 sm:col-span-2" },
                        react_1["default"].createElement("input", { type: "text", name: "officeAddress", value: form.officeAddress, onChange: handleInputChange, className: "peer w-full bg-gray-700 p-4 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: " " }),
                        react_1["default"].createElement("label", { className: "absolute left-4 top-2 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-blue-400 transition-all" }, "Office Address")),
                    react_1["default"].createElement("div", { className: "relative" },
                        react_1["default"].createElement("input", { type: "text", name: "contact", value: form.contact, onChange: handleInputChange, className: "peer w-full bg-gray-700 p-4 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: " " }),
                        react_1["default"].createElement("label", { className: "absolute left-4 top-2 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-blue-400 transition-all" }, "Contact")),
                    react_1["default"].createElement("div", { className: "relative col-span-1 sm:col-span-2" },
                        react_1["default"].createElement("textarea", { name: "description", value: form.description, onChange: handleInputChange, rows: 4, className: "peer w-full bg-gray-700 p-4 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: " " }),
                        react_1["default"].createElement("label", { className: "absolute left-4 top-2 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-blue-400 transition-all" }, "Description"))),
                react_1["default"].createElement("div", { className: "text-center" },
                    react_1["default"].createElement(framer_motion_1.motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: handleSubmit, className: "w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" }, "Save Changes"))),
            react_1["default"].createElement(react_toastify_1.ToastContainer, null))));
};
exports["default"] = EditUniAdminProfile;
