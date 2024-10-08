"use strict";
exports.__esModule = true;
var react_1 = require("react");
var ResearchWork = function (_a) {
    var papers = _a.papers;
    return (react_1["default"].createElement("div", { className: "p-6 mb-6 max-w-6xl mx-auto" },
        react_1["default"].createElement("h2", { className: "text-2xl font-bold text-green-500 mb-6 text-center" }, "Research Work"),
        react_1["default"].createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6" }, papers.length > 0 ? (papers.map(function (paper) { return (react_1["default"].createElement("div", { key: paper.id, className: "flex items-center bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700" },
            react_1["default"].createElement("div", { className: "flex-1" },
                react_1["default"].createElement("h3", { className: "text-lg font-semibold text-gray-100 mb-2" }, paper.paperName),
                react_1["default"].createElement("p", { className: "text-gray-400 mb-2" }, paper.category),
                react_1["default"].createElement("p", { className: "text-gray-500" },
                    "Publish Channel: ",
                    paper.publishChannel),
                react_1["default"].createElement("p", { className: "text-gray-500" },
                    "Year of Publish: ",
                    paper.yearOfPublish),
                react_1["default"].createElement("p", { className: "text-green-400 mt-2" },
                    react_1["default"].createElement("a", { href: paper.link, target: "_blank", rel: "noopener noreferrer", className: "hover:underline" }, "View Publication")),
                react_1["default"].createElement("p", { className: "text-gray-500 mt-2" },
                    "Other Researchers: ",
                    paper.otherResearchers)),
            paper.imageSrc && (react_1["default"].createElement("div", { className: "ml-4" },
                react_1["default"].createElement("img", { src: paper.imageSrc, alt: paper.paperName, className: "w-32 h-32 object-cover rounded-lg shadow-md" }))))); })) : (react_1["default"].createElement("p", { className: "text-gray-500 text-center" }, "No research papers available.")))));
};
exports["default"] = ResearchWork;
