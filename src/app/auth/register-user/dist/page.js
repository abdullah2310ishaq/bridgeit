"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var StudentRegistration_1 = require("./users/StudentRegistration");
var FacultyRegistration_1 = require("./users/FacultyRegistration");
var RegisterExpert_1 = require("./users/RegisterExpert");
var RegistrationPage = function () {
    var _a = react_1.useState(''), role = _a[0], setRole = _a[1];
    var renderRegistrationForm = function () {
        switch (role) {
            case 'Student':
                return react_1["default"].createElement(StudentRegistration_1["default"], null);
            case 'Faculty':
                return react_1["default"].createElement(FacultyRegistration_1["default"], null);
            case 'IndustryExpert':
                return react_1["default"].createElement(RegisterExpert_1["default"], null);
            default:
                return null;
        }
    };
    return (react_1["default"].createElement("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 space-y-12" },
        react_1["default"].createElement("div", { className: "flex items-center justify-center mb-8" },
            react_1["default"].createElement("img", { src: "/logo.jpg", alt: "BridgeIT Logo", width: 80, height: 80, className: "mr-4" }),
            react_1["default"].createElement("h1", { className: "text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600" }, "Join BridgeIT")),
        react_1["default"].createElement("div", { className: "text-center" },
            react_1["default"].createElement("p", { className: "text-gray-300" },
                "Already have an account?",
                ' ',
                react_1["default"].createElement("a", { href: "/auth/login-user", className: "text-teal-400 font-semibold hover:underline" }, "Login here!"))),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("label", { className: "block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 mb-6 text-center" }, "Choose Your Role"),
            react_1["default"].createElement("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" },
                react_1["default"].createElement("button", { type: "button", onClick: function () { return setRole('Student'); }, className: "py-4 px-6 rounded-xl font-semibold flex items-center justify-center text-lg transition-colors duration-300 shadow-lg " + (role === 'Student'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-teal-600 hover:text-white') + " focus:outline-none focus:ring-4 focus:ring-teal-400" },
                    react_1["default"].createElement("span", { className: "mr-3" }, "\uD83C\uDF93"),
                    " Student"),
                react_1["default"].createElement("button", { type: "button", onClick: function () { return setRole('Faculty'); }, className: "py-4 px-6 rounded-xl font-semibold flex items-center justify-center text-lg transition-colors duration-300 shadow-lg " + (role === 'Faculty'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-teal-600 hover:text-white') + " focus:outline-none focus:ring-4 focus:ring-teal-400" },
                    react_1["default"].createElement("span", { className: "mr-3" }, "\uD83D\uDC68\u200D\uD83C\uDFEB"),
                    " Faculty"),
                react_1["default"].createElement("button", { type: "button", onClick: function () { return setRole('IndustryExpert'); }, className: "py-4 px-6 rounded-xl font-semibold flex items-center justify-center text-lg transition-colors duration-300 shadow-lg " + (role === 'IndustryExpert'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-teal-600 hover:text-white') + " focus:outline-none focus:ring-4 focus:ring-teal-400" },
                    react_1["default"].createElement("span", { className: "mr-3" }, "\uD83D\uDCBC"),
                    " Expert"),
                react_1["default"].createElement("button", { type: "button", onClick: function () { return setRole('UniversityAdmin'); }, className: "py-4 px-6 rounded-xl font-semibold flex items-center justify-center text-lg transition-colors duration-300 shadow-lg " + (role === 'UniversityAdmin'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-teal-600 hover:text-white') + " focus:outline-none focus:ring-4 focus:ring-teal-400" },
                    react_1["default"].createElement("span", { className: "mr-3" }, "\uD83C\uDFE2"),
                    " Admin"))),
        react_1["default"].createElement("div", { className: "mt-8" }, renderRegistrationForm() ? (react_1["default"].createElement("div", { className: "p-8 bg-gray-800 rounded-lg shadow-inner" }, renderRegistrationForm())) : (react_1["default"].createElement("p", { className: "text-gray-400 text-center text-lg" }, "Please select a role to continue.")))));
};
exports["default"] = RegistrationPage;
