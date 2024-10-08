"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation"); // Import useRouter for navigation
var framer_motion_1 = require("framer-motion");
var OngoingProjectsSection = function (_a) {
    var ongoingProjects = _a.ongoingProjects;
    var router = navigation_1.useRouter(); // Initialize the useRouter hook
    return (react_1["default"].createElement("section", { className: "py-16 bg-gradient-to-br from-gray-100 to-gray-300" },
        react_1["default"].createElement("div", { className: "max-w-7xl mx-auto mb-16 px-4 md:px-6 lg:px-8" },
            react_1["default"].createElement("h2", { className: "text-4xl md:text-5xl font-extrabold text-gray-700" }, "Ongoing Projects")),
        react_1["default"].createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 lg:px-8" }, ongoingProjects.length > 0 ? (ongoingProjects.map(function (project) { return (react_1["default"].createElement(framer_motion_1.motion.div, { key: project.id, whileHover: { scale: 1.05 }, className: "bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform" },
            react_1["default"].createElement("h3", { className: "text-2xl font-bold text-green-300 mb-4" }, project.title),
            react_1["default"].createElement("p", { className: "text-gray-400 mb-4" }, project.description),
            react_1["default"].createElement("p", { className: "text-sm text-gray-400" },
                react_1["default"].createElement("span", { className: "font-bold" }, "Expert:"),
                " ",
                project.expertName),
            react_1["default"].createElement("p", { className: "text-sm text-gray-400" },
                react_1["default"].createElement("span", { className: "font-bold" }, "Status:"),
                " ",
                project.status),
            react_1["default"].createElement("p", { className: "text-sm text-gray-400" },
                react_1["default"].createElement("span", { className: "font-bold" }, "End Date:"),
                " ",
                project.endDate))); })) : (react_1["default"].createElement("p", { className: "text-gray-500 text-center col-span-full" }, "No ongoing projects available.")))));
};
exports["default"] = OngoingProjectsSection;
