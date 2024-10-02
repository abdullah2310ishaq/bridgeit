// "use strict";
// exports.__esModule = true;
// var react_1 = require("react");
// var navigation_1 = require("next/navigation");
// var fa_1 = require("react-icons/fa");
// var framer_motion_1 = require("framer-motion");
// var ProjectCard = function (_a) {
//     var id = _a.id, title = _a.title, description = _a.description, stack = _a.stack, status = _a.status, expertName = _a.expertName, studentName = _a.studentName, expertImageData = _a.expertImageData;
//     var router = navigation_1.useRouter();
//     var handleViewDetails = function () {
//         router.push("/student/projects/" + id);
//     };
//     var renderStatusBadge = function (status) {
//         if (!status)
//             return null;
//         var statusClass = status.toLowerCase() === "completed"
//             ? "bg-green-500 text-white"
//             : status.toLowerCase() === "pending"
//                 ? "bg-yellow-500 text-white"
//                 : "bg-red-500 text-white";
//         var statusIcon = status.toLowerCase() === "completed" ? (react_1["default"].createElement(fa_1.FaCheckCircle, { className: "mr-1" })) : status.toLowerCase() === "pending" ? (react_1["default"].createElement(fa_1.FaExclamationCircle, { className: "mr-1" })) : null;
//         return (react_1["default"].createElement("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold " + statusClass },
//             statusIcon,
//             " ",
//             status));
//     };
//     return (react_1["default"].createElement(framer_motion_1.motion.div, { className: "bg-gray-900 text-gray-200 shadow-xl rounded-2xl p-6 flex items-start space-x-6 hover:shadow-2xl transition-shadow duration-300 max-w-3xl transform hover:scale-105", whileHover: { scale: 1.05 }, whileTap: { scale: 0.98 } },
//         react_1["default"].createElement("div", { className: "flex-shrink-0" }, expertImageData ? (react_1["default"].createElement("img", { src: "data:image/jpeg;base64," + expertImageData, alt: expertName + "'s photo", className: "w-20 h-20 rounded-full object-cover border-4 border-gray-800 shadow-lg" })) : (react_1["default"].createElement("img", { src: "/heroimage.png" // Placeholder image if no imageData is available
//             , alt: "Default Avatar", className: "w-20 h-20 rounded-full object-cover border-4 border-gray-800 shadow-lg" }))),
//         react_1["default"].createElement("div", { className: "flex-1" },
//             react_1["default"].createElement("div", { className: "flex justify-between items-start" },
//                 react_1["default"].createElement("h3", { className: "text-xl font-bold text-blue-400" }, title),
//                 react_1["default"].createElement("button", { className: "text-gray-400 hover:text-gray-600" }, "\u00D7")),
//             expertName && (react_1["default"].createElement("div", { className: "flex items-center mt-2 text-sm text-gray-300" },
//                 react_1["default"].createElement(fa_1.FaUserTie, { className: "text-blue-500 mr-2" }),
//                 react_1["default"].createElement("span", null,
//                     "Expert: ",
//                     expertName))),
//             studentName && (react_1["default"].createElement("div", { className: "flex items-center mt-2 text-sm text-gray-300" },
//                 react_1["default"].createElement(fa_1.FaUserGraduate, { className: "text-green-400 mr-2" }),
//                 react_1["default"].createElement("span", null,
//                     "Company: ",
//                     studentName))),
//             react_1["default"].createElement("p", { className: "text-sm text-gray-400 mt-4 line-clamp-2" }, description),
//             stack && (react_1["default"].createElement("div", { className: "mt-4" },
//                 react_1["default"].createElement("span", { className: "font-medium text-blue-400" }, "Tech Stack:"),
//                 " ",
//                 react_1["default"].createElement("span", null, stack))),
//             status && react_1["default"].createElement("div", { className: "mt-4" }, renderStatusBadge(status)),
//             react_1["default"].createElement("button", { className: "mt-6 py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-400 hover:to-purple-500 transition-all duration-300 shadow-lg transform hover:scale-105", onClick: handleViewDetails }, "View Details"))));
// };
// exports["default"] = ProjectCard;
"use strict";