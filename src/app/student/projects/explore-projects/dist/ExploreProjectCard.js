"use strict";
exports.__esModule = true;
var react_1 = require("react");
var fa_1 = require("react-icons/fa");
var framer_motion_1 = require("framer-motion");
var ProjectCard = function (_a) {
    var id = _a.id, title = _a.title, description = _a.description, stack = _a.stack, status = _a.status, expertName = _a.expertName, studentName = _a.studentName, expertImageData = _a.expertImageData, onSelectProject = _a.onSelectProject;
    var renderStatusBadge = function (status) {
        if (!status)
            return null;
        var statusClass = status.toLowerCase()
            === "completed"
            ? "bg-green-500 text-white"
            : status.toLowerCase() === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-red-500 text-white";
        var statusIcon = status.toLowerCase() === "completed" ? (react_1["default"].createElement(fa_1.FaCheckCircle, { className: "mr-1" })) : status.toLowerCase() === "pending" ? (react_1["default"].createElement(fa_1.FaExclamationCircle, { className: "mr-1" })) : null;
        return (react_1["default"].createElement("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold " + statusClass },
            statusIcon,
            " ",
            status));
    };
    return (react_1["default"].createElement("div", { className: "flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4" },
        react_1["default"].createElement(framer_motion_1.motion.div, { className: "bg-gray-900 text-gray-200 shadow-xl rounded-2xl p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300 w-full lg:w-[550px] h-[220px]", whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: onSelectProject },
            react_1["default"].createElement("div", { className: "flex items-start space-x-4" },
                react_1["default"].createElement("div", { className: "flex-shrink-0" }, expertImageData ? (react_1["default"].createElement("img", { src: "data:image/jpeg;base64," + expertImageData, alt: expertName + "'s photo", className: "w-16 h-16 rounded-full object-cover border-2 border-gray-800 shadow-lg" })) : (react_1["default"].createElement("img", { src: "/heroimage.png", alt: "Default Avatar", className: "w-16 h-16 rounded-full object-cover border-2 border-gray-800 shadow-lg" }))),
                react_1["default"].createElement("div", { className: "flex-1" },
                    react_1["default"].createElement("h3", { className: "text-xl font-bold text-blue-400" }, title),
                    expertName && (react_1["default"].createElement("div", { className: "flex items-center mt-2 text-sm text-gray-300" },
                        react_1["default"].createElement(fa_1.FaUserTie, { className: "text-blue-500 mr-2" }),
                        react_1["default"].createElement("span", null,
                            "Expert: ",
                            expertName))),
                    studentName && (react_1["default"].createElement("div", { className: "flex items-center mt-2 text-sm text-gray-300" },
                        react_1["default"].createElement(fa_1.FaUserGraduate, { className: "text-green-400 mr-2" }),
                        react_1["default"].createElement("span", null,
                            "Company: ",
                            studentName))))),
            react_1["default"].createElement("p", { className: "text-sm text-gray-400 mt-4 line-clamp-2" }, description),
            stack && (react_1["default"].createElement("div", { className: "mt-4" },
                react_1["default"].createElement("span", { className: "font-medium text-blue-400" }, "Tech Stack:"),
                " ",
                react_1["default"].createElement("span", null, stack))),
            status && react_1["default"].createElement("div", { className: "mt-4" }, renderStatusBadge(status)))));
};
exports["default"] = ProjectCard;
