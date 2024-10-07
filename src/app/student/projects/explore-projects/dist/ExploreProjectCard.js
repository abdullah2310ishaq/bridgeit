"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var fa_1 = require("react-icons/fa");
var framer_motion_1 = require("framer-motion");
var ProjectCard = function (_a) {
    var id = _a.id, title = _a.title, description = _a.description, stack = _a.stack, expertName = _a.expertName, studentName = _a.studentName, expertImageData = _a.expertImageData, onClick = _a.onClick;
    return (react_1["default"].createElement(framer_motion_1.motion.div, { className: "bg-gray-800 shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer", whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: onClick },
        react_1["default"].createElement("div", { className: "flex items-center mb-4" },
            expertImageData ? (react_1["default"].createElement("img", { src: "data:image/jpeg;base64," + expertImageData, alt: expertName + "'s photo", className: "w-12 h-12 rounded-full mr-4" })) : (react_1["default"].createElement("img", { src: "/default-avatar.png", alt: "Default Avatar", className: "w-12 h-12 rounded-full mr-4" })),
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("h3", { className: "text-xl font-semibold text-gray-200" }, expertName),
                studentName && (react_1["default"].createElement("div", { className: "flex items-center text-gray-400" },
                    react_1["default"].createElement(fa_1.FaUserGraduate, { className: "mr-1" }),
                    react_1["default"].createElement("span", null, studentName))))),
        react_1["default"].createElement("h2", { className: "text-2xl font-bold text-green-400 mb-2" }, title),
        react_1["default"].createElement("p", { className: "text-gray-300 mb-4 line-clamp-3" }, description),
        stack && (react_1["default"].createElement("div", { className: "mb-4" },
            react_1["default"].createElement("span", { className: "font-medium text-blue-400" }, "Tech Stack:"),
            " ",
            react_1["default"].createElement("span", null, stack)))));
};
exports["default"] = ProjectCard;

