"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var fa_1 = require("react-icons/fa");
var lucide_react_1 = require("lucide-react");
var ProjectCard = function (_a) {
    var id = _a.id, title = _a.title, description = _a.description, stack = _a.stack, expertName = _a.expertName, studentName = _a.studentName, expertImageData = _a.expertImageData, onClick = _a.onClick;
    return (react_1["default"].createElement(framer_motion_1.motion.div, { className: "bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden relative group", whileHover: { scale: 1.03, y: -5 }, whileTap: { scale: 0.98 }, onClick: onClick },
        react_1["default"].createElement("div", { className: "absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" }),
        react_1["default"].createElement("div", { className: "flex items-center mb-6 relative z-10" },
            react_1["default"].createElement("div", { className: "relative" },
                expertImageData ? (react_1["default"].createElement("img", { src: "data:image/jpeg;base64," + expertImageData, alt: expertName + "'s photo", className: "w-16 h-16 rounded-full border-2 border-green-400 shadow-md" })) : (react_1["default"].createElement("img", { 
                    //src="/default-avatar.png"
                    //alt="Default Avatar"
                    className: "w-16 h-16 rounded-full border-2 border-green-400 shadow-md" })),
                react_1["default"].createElement("div", { className: "absolute bottom-0 right-0 bg-green-400 rounded-full p-1" },
                    react_1["default"].createElement(lucide_react_1.Code2, { className: "w-4 h-4 text-gray-900" }))),
            react_1["default"].createElement("div", { className: "ml-4" },
                react_1["default"].createElement("h3", { className: "text-xl font-bold text-white" }, expertName),
                studentName && (react_1["default"].createElement("div", { className: "flex items-center text-gray-300 mt-1" },
                    react_1["default"].createElement(fa_1.FaUserGraduate, { className: "mr-2 text-blue-400" }),
                    react_1["default"].createElement("span", { className: "text-sm" }, studentName))))),
        react_1["default"].createElement("h2", { className: "text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-3" }, title),
        react_1["default"].createElement("p", { className: "text-gray-300 mb-4 line-clamp-3" }, description),
        stack && (react_1["default"].createElement("div", { className: "flex items-center mt-4 text-sm" },
            react_1["default"].createElement(lucide_react_1.Layers, { className: "w-5 h-5 mr-2 text-blue-400" }),
            react_1["default"].createElement("span", { className: "font-medium text-blue-400 mr-2" }, "Tech Stack:"),
            react_1["default"].createElement("span", { className: "text-gray-300" }, stack))),
        react_1["default"].createElement("div", { className: "absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-green-400 opacity-20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" }),
        react_1["default"].createElement("div", { className: "absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-400 opacity-20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" })));
};
exports["default"] = ProjectCard;
