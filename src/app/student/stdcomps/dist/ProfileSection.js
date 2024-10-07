"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var ProfileSection = function (_a) {
    var userProfile = _a.userProfile, goToEditProfile = _a.goToEditProfile, gotoProfile = _a.gotoProfile;
    return (react_1["default"].createElement("div", { className: "relative flex flex-col md:flex-row items-center p-16 mb-10 rounded-xl shadow-lg", style: {
            backgroundImage: "url('data:image/jpeg;base64," + userProfile.uniImage + "')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        } },
        react_1["default"].createElement("div", { className: "absolute inset-0 bg-black opacity-70" }),
        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 1 }, className: "relative z-10 md:w-1/3 flex justify-center md:justify-start mb-8 md:mb-0" },
            react_1["default"].createElement("img", { src: "data:image/jpeg;base64," + userProfile.imageData, alt: userProfile.firstName + " " + userProfile.lastName, className: "w-64 h-64 rounded-lg object-cover shadow-2xl border-4 border-green-400 cursor-pointer" })),
        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 1 }, className: "relative z-10 text-white flex-grow text-center md:text-left md:pl-12" },
            react_1["default"].createElement("h2", { className: "text-5xl font-bold text-green-300 leading-tight drop-shadow-lg" },
                "Welcome, ",
                userProfile.firstName,
                " ",
                userProfile.lastName),
            react_1["default"].createElement("p", { className: "text-lg mt-4 text-gray-200 font-light" },
                "Roll Number: ",
                react_1["default"].createElement("span", { className: "font-bold text-white" }, userProfile.rollNumber)),
            react_1["default"].createElement("div", { className: "mt-6" },
                react_1["default"].createElement("h3", { className: "text-2xl font-semibold text-white" }, "About Me:"),
                react_1["default"].createElement("p", { className: "text-gray-300 mt-2 text-lg leading-relaxed" }, userProfile.description)),
            react_1["default"].createElement("div", { className: "w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 my-8" }),
            react_1["default"].createElement("div", { className: "flex justify-center md:justify-start space-x-6 mt-4" },
                react_1["default"].createElement("button", { onClick: goToEditProfile, className: "px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105" }, "Edit Profile"),
                react_1["default"].createElement("button", { onClick: gotoProfile, className: "px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-600 transition duration-300 transform hover:scale-105" }, "View Profile")))));
};
exports["default"] = ProfileSection;
