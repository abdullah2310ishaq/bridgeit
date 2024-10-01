"use strict";
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var ProfileCard = function (_a) {
    var imageData = _a.imageData, firstName = _a.firstName, lastName = _a.lastName, role = _a.role;
    var router = navigation_1.useRouter();
    var handleProfileRedirect = function () {
        router.push("/student");
    };
    return (react_1["default"].createElement("div", { className: "bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-lg overflow-hidden w-60 text-center transform hover:scale-105 transition-transform duration-300" },
        react_1["default"].createElement("div", { className: "bg-gradient-to-t from-green-400 to-blue-500 h-20" }),
        react_1["default"].createElement("div", { className: "relative -mt-12" },
            react_1["default"].createElement("img", { src: imageData || "/default-profile.png", alt: "Profile Picture", className: "mx-auto h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg transform hover:scale-110 transition-transform duration-300" })),
        react_1["default"].createElement("div", { className: "p-4" },
            react_1["default"].createElement("h3", { className: "text-lg font-bold text-white" }, firstName + " " + lastName),
            react_1["default"].createElement("p", { className: "text-sm text-gray-200 mb-4" }, role),
            react_1["default"].createElement("button", { onClick: handleProfileRedirect, className: "py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-400 hover:to-purple-500 transition duration-300" }, "View Profile"))));
};
exports["default"] = ProfileCard;
