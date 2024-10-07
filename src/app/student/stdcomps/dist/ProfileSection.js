"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var ProfileSection = function (_a) {
    var userProfile = _a.userProfile, goToEditProfile = _a.goToEditProfile, gotoProfile = _a.gotoProfile;
    return (react_1["default"].createElement("div", { className: "relative flex flex-col md:flex-row items-center p-16 mb-10 rounded-xl shadow-lg", style: {
            backgroundImage: "url('data:image/jpeg;base64," + userProfile.uniImage + "')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        } },
        react_1["default"].createElement("div", { className: "absolute inset-0 bg-gray-900 opacity-70" }),
        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 1 }, className: "relative z-10 md:w-1/3 flex justify-center md:justify-start mb-8 md:mb-0" },
            react_1["default"].createElement("img", { src: "data:image/jpeg;base64," + userProfile.imageData, alt: userProfile.firstName + " " + userProfile.lastName, className: "w-64 h-64 rounded-lg object-cover shadow-2xl border-4 border-green-400 cursor-pointer" })),
        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 1 }, className: "relative z-10 text-white flex-grow text-center md:text-left md:pl-12" },
            react_1["default"].createElement("h2", { className: "text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500" },
                "Welcome, ",
                userProfile.firstName,
                " ",
                userProfile.lastName),
            react_1["default"].createElement("p", { className: "text-lg mt-4 text-gray-200 font-light" },
                "Roll Number: ",
                react_1["default"].createElement("span", { className: "font-bold text-white" }, userProfile.rollNumber)),
            react_1["default"].createElement("div", { className: "mt-6" },
                react_1["default"].createElement("p", { className: "text-gray-200 mt-2 text-lg leading-relaxed" }, userProfile.description)),
            react_1["default"].createElement("div", { className: "w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 my-8" }),
            react_1["default"].createElement("div", { className: "flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6 mt-8" },
                react_1["default"].createElement("button", { onClick: goToEditProfile, className: "group px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" },
                    react_1["default"].createElement("span", { className: "flex items-center justify-center" },
                        react_1["default"].createElement(lucide_react_1.Edit, { className: "w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300" }),
                        "Edit Profile")),
                react_1["default"].createElement("button", { onClick: gotoProfile, className: "group px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" },
                    react_1["default"].createElement("span", { className: "flex items-center justify-center" },
                        react_1["default"].createElement(lucide_react_1.User, { className: "w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" }),
                        "View Profile"))))));
};
exports["default"] = ProfileSection;
