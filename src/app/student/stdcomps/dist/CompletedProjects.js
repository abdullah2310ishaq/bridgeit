"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation"); // Import useRouter for navigation
var framer_motion_1 = require("framer-motion");
var CompletedProjectsSection = function (_a) {
    var projects = _a.projects;
    var router = navigation_1.useRouter(); // Initialize the router
    // Navigation handlers directly inside the component
    var goToProjectsPage = function () {
        router.push("/student/projects"); // Navigate to the 'view projects' page
    };
    var createProjects = function () {
        router.push("/student/projects/create"); // Navigate to the 'create projects' page
    };
    return (react_1["default"].createElement("section", { className: "py-16 bg-gradient-to-br from-gray-100 to-gray-300" },
        react_1["default"].createElement("div", { className: "max-w-7xl mx-auto mb-16 px-4 md:px-6 lg:px-8" },
            react_1["default"].createElement("h2", { className: "text-4xl md:text-5xl font-extrabold text-gray-700" }, "Completed Projects")),
        react_1["default"].createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 lg:px-8" }, projects.length > 0 ? (projects.map(function (project) { return (react_1["default"].createElement(framer_motion_1.motion.div, { key: project.id, whileHover: { scale: 1.05 }, className: "bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform" },
            react_1["default"].createElement("h3", { className: "text-2xl font-bold text-green-300 mb-4" }, project.title),
            react_1["default"].createElement("p", { className: "text-gray-400 mb-4" }, project.description),
            react_1["default"].createElement("div", { className: "text-left mt-4" },
                react_1["default"].createElement("p", { className: "text-sm text-gray-400" },
                    react_1["default"].createElement("span", { className: "font-bold" }, "Status:"),
                    " Completed"),
                react_1["default"].createElement("p", { className: "text-sm text-gray-400" },
                    react_1["default"].createElement("span", { className: "font-bold" }, "Duration:"),
                    " 6 months")),
            react_1["default"].createElement("div", { className: "mt-6 text-right" },
                react_1["default"].createElement("button", { onClick: goToProjectsPage, className: "text-blue-400 hover:text-blue-600 underline text-sm font-semibold transition-colors" }, "Click for More")))); })) : (react_1["default"].createElement("p", { className: "text-gray-500 text-center col-span-full" }, "No completed projects available."))),
        react_1["default"].createElement("div", { className: "mt-12 flex justify-center space-x-4" },
            react_1["default"].createElement("button", { onClick: goToProjectsPage, className: "px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-full shadow-md hover:from-gray-700 hover:to-gray-800 transition-transform" }, "See More Projects"),
            react_1["default"].createElement("button", { onClick: createProjects, className: "px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-full shadow-md hover:from-gray-600 hover:to-gray-700 transition-transform" }, "Create Projects"))));
};
exports["default"] = CompletedProjectsSection;
