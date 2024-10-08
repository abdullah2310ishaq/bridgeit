"use client"; // This directive needs to be present when using client-side hooks like useRouter.
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation"); // Import useRouter for navigation
var lucide_react_1 = require("lucide-react");
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
    return (react_1["default"].createElement("section", { className: "py-16 bg-gradient-to-br from-gray-900 to-gray-900" },
        react_1["default"].createElement("div", { className: "max-w-7xl mx-auto mb-16 px-4 md:px-6 lg:px-8" },
            react_1["default"].createElement("h2", { className: "text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-300", style: { padding: '0.6rem 0', marginLeft: '-7rem' } }, "Created Projects")),
        react_1["default"].createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 lg:px-8" }, projects.length > 0 ? (projects.map(function (project) { return (react_1["default"].createElement(framer_motion_1.motion.div, { key: project.id, whileHover: { scale: 1.05 }, className: "bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col" },
            react_1["default"].createElement("h3", { className: "text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300 mb-4" }, project.title),
            react_1["default"].createElement("p", { className: "text-gray-300 mb-4" }, project.description),
            react_1["default"].createElement("div", { className: "text-left mt-4 space-y-2" },
                react_1["default"].createElement("p", { className: "text-sm text-gray-300 flex items-center" },
                    react_1["default"].createElement(lucide_react_1.CheckCircle, { className: "w-4 h-4 mr-2 text-green-400" }),
                    react_1["default"].createElement("span", { className: "font-bold mr-2" }, "Status:"),
                    " Completed"),
                react_1["default"].createElement("p", { className: "text-sm text-gray-300 flex items-center" },
                    react_1["default"].createElement(lucide_react_1.Clock, { className: "w-4 h-4 mr-2 text-blue-400" }),
                    react_1["default"].createElement("span", { className: "font-bold mr-2" }, "Duration:"),
                    " 6 months")),
            react_1["default"].createElement("div", { className: "mt-6 text-right" },
                react_1["default"].createElement("button", { onClick: goToProjectsPage, className: "text-blue-400 hover:text-blue-300 flex items-center justify-end w-full transition-colors duration-300" },
                    react_1["default"].createElement("span", { className: "text-sm font-semibold" }, "Click for More"),
                    react_1["default"].createElement(lucide_react_1.ChevronRight, { className: "ml-1 w-4 h-4" }))))); })) : (react_1["default"].createElement("p", { className: "text-gray-500 text-center col-span-full" }, "No completed projects available."))),
        react_1["default"].createElement("div", { className: "flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-8" },
            react_1["default"].createElement("button", { onClick: goToProjectsPage, className: "group px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-full shadow-lg hover:shadow-gray-600/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" },
                react_1["default"].createElement("span", { className: "flex items-center justify-center" },
                    react_1["default"].createElement(lucide_react_1.Eye, { className: "w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" }),
                    "See More Projects")),
            react_1["default"].createElement("button", { onClick: createProjects, className: "group px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-full shadow-lg hover:shadow-gray-500/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2" },
                react_1["default"].createElement("span", { className: "flex items-center justify-center" },
                    react_1["default"].createElement(lucide_react_1.PlusCircle, { className: "w-5 h-5 mr-2 transform group-hover:rotate-90 transition-transform duration-300" }),
                    "Create Projects")))));
};
exports["default"] = CompletedProjectsSection;
