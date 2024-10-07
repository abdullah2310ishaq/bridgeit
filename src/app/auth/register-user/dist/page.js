"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var StudentRegistration_1 = require("./users/StudentRegistration");
var FacultyRegistration_1 = require("./users/FacultyRegistration");
var RegisterExpert_1 = require("./users/RegisterExpert");
var image_1 = require("next/image");
var link_1 = require("next/link");
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
    var roleButtons = [
        { role: 'Student', icon: '🎓', label: 'Student' },
        { role: 'Faculty', icon: '👨‍🏫', label: 'Faculty' },
        { role: 'IndustryExpert', icon: '💼', label: 'Expert' },
    ];
    return (react_1["default"].createElement("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4" },
        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "w-full max-w-4xl p-8 bg-gray-800 rounded-2xl shadow-2xl" },
            react_1["default"].createElement("div", { className: "text-center mb-12" },
                react_1["default"].createElement(image_1["default"], { src: "/logo.jpg", alt: "BridgeIT", width: 80, height: 80, className: "mx-auto mb-6 rounded-full" }),
                react_1["default"].createElement("h2", { className: "text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500" }, "Join BridgeIT"),
                react_1["default"].createElement("p", { className: "text-gray-400 mt-4 text-lg" },
                    "Already have an account?",
                    ' ',
                    react_1["default"].createElement(link_1["default"], { href: "/auth/login-user", className: "text-green-400 font-semibold hover:underline transition duration-300" }, "Login here!"))),
            react_1["default"].createElement("div", { className: "space-y-10" },
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("h3", { className: "text-2xl font-semibold text-center mb-6 text-gray-300" }, "Choose Your Role"),
                    react_1["default"].createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6" }, roleButtons.map(function (button) { return (react_1["default"].createElement(framer_motion_1.motion.button, { key: button.role, type: "button", onClick: function () { return setRole(button.role); }, className: "py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center transition-all duration-300 " + (role === button.role
                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600') + " focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } },
                        react_1["default"].createElement("span", { className: "mr-3 text-2xl" }, button.icon),
                        button.label)); }))),
                react_1["default"].createElement(framer_motion_1.AnimatePresence, { mode: "wait" }, renderRegistrationForm() && (react_1["default"].createElement(framer_motion_1.motion.div, { key: role, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.5 }, className: "p-6 bg-gray-700 rounded-xl shadow-inner" }, renderRegistrationForm()))),
                !renderRegistrationForm() && (react_1["default"].createElement(framer_motion_1.motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-gray-400 text-center text-lg" }, "Please select a role to continue."))))));
};
exports["default"] = RegistrationPage;
