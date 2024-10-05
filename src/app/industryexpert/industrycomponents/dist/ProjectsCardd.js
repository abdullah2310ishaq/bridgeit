"use strict";
exports.__esModule = true;
var react_1 = require("react");
var ProjectCard = function (_a) {
    var title = _a.title, description = _a.description, endDate = _a.endDate, name = _a.name;
    var gradientStyles = [
        "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
        "bg-gradient-to-r from-green-400 via-blue-500 to-purple-500",
        "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
    ];
    return (react_1["default"].createElement("div", { className: "relative p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all overflow-hidden " + gradientStyles[Math.floor(Math.random() * gradientStyles.length)] },
        react_1["default"].createElement("div", { className: "absolute inset-0 opacity-20 bg-cover bg-center" }),
        react_1["default"].createElement("div", { className: "relative z-10" },
            react_1["default"].createElement("h3", { className: "text-xl font-semibold text-white mb-2" }, title),
            react_1["default"].createElement("p", { className: "text-gray-200 mb-2" }, description),
            react_1["default"].createElement("p", { className: "text-gray-300 mb-1" },
                react_1["default"].createElement("strong", null, "End Date:"),
                " ",
                endDate),
            react_1["default"].createElement("p", { className: "text-gray-300" },
                react_1["default"].createElement("strong", null, "Assigned by:"),
                " ",
                name))));
};
exports["default"] = ProjectCard;
