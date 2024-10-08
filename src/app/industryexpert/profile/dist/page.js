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
var IndustryExpertProfilePage = function () {
    var _a = react_1.useState(null), industryExpertProfile = _a[0], setIndustryExpertProfile = _a[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        function fetchIndustryExpertProfile() {
            return __awaiter(this, void 0, void 0, function () {
                var token, profileResponse, profileData, userId, industryExpertResponse, industryExpertData, error_1;
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
                            return [4 /*yield*/, fetch("https://localhost:7053/api/get-industry-expert/industry-expert-by-id/" + userId, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': "Bearer " + token
                                    }
                                })];
                        case 4:
                            industryExpertResponse = _a.sent();
                            if (!industryExpertResponse.ok) return [3 /*break*/, 6];
                            return [4 /*yield*/, industryExpertResponse.json()];
                        case 5:
                            industryExpertData = _a.sent();
                            setIndustryExpertProfile({
                                userId: industryExpertData.userId,
                                firstName: industryExpertData.firstName || 'N/A',
                                lastName: industryExpertData.lastName || 'N/A',
                                email: industryExpertData.email || 'N/A',
                                imageData: industryExpertData.imageData || '',
                                companyName: industryExpertData.companyName || 'N/A',
                                contact: industryExpertData.contact || 'N/A',
                                address: industryExpertData.address || 'N/A'
                            });
                            return [3 /*break*/, 7];
                        case 6:
                            console.error('Failed to fetch industry expert profile:', industryExpertResponse.statusText);
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
                            console.error('An error occurred while fetching the industry expert profile:', error_1);
                            router.push('/unauthorized');
                            return [3 /*break*/, 11];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        }
        fetchIndustryExpertProfile();
    }, [router]);
    var goBack = function () {
        router.push('/industry-expert');
    };
    var editProfile = function () {
        router.push('/industry-expert/profile/edit');
    };
    if (!industryExpertProfile) {
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "Loading...");
    }
    return (react_1["default"].createElement("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 p-8" },
        react_1["default"].createElement("h1", { className: "text-5xl font-bold mb-8 text-white" }, "Industry Expert Profile"),
        react_1["default"].createElement("img", { src: "data:image/jpeg;base64," + industryExpertProfile.imageData, alt: industryExpertProfile.firstName + "'s profile picture", className: "w-40 h-40 rounded-full mb-6 shadow-lg border-4 border-gray-700" }),
        react_1["default"].createElement("p", { className: "text-3xl font-semibold mb-2 text-white" },
            industryExpertProfile.firstName,
            " ",
            industryExpertProfile.lastName),
        react_1["default"].createElement("p", { className: "text-lg mb-4 text-gray-400" }, industryExpertProfile.email),
        react_1["default"].createElement("div", { className: "text-lg space-y-2 text-gray-300 mb-8" },
            react_1["default"].createElement("p", null,
                react_1["default"].createElement("strong", null, "Company:"),
                " ",
                industryExpertProfile.companyName),
            react_1["default"].createElement("p", null,
                react_1["default"].createElement("strong", null, "Contact:"),
                " ",
                industryExpertProfile.contact),
            react_1["default"].createElement("p", null,
                react_1["default"].createElement("strong", null, "Address:"),
                " ",
                industryExpertProfile.address)),
        react_1["default"].createElement("div", { className: "flex space-x-6" },
            react_1["default"].createElement("button", { onClick: goBack, className: "py-2 px-8 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition duration-300" }, "Back"))));
};
exports["default"] = IndustryExpertProfilePage;
