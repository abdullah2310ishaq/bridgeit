"use strict";
exports.__esModule = true;
var react_1 = require("react");
var IndustryProfile = function (_a) {
    var companyLogo = _a.companyLogo, companyName = _a.companyName, firstName = _a.firstName, lastName = _a.lastName, indExptId = _a.indExptId, email = _a.email, address = _a.address, contact = _a.contact, onViewProjects = _a.onViewProjects, onEditProfile = _a.onEditProfile, onAddProjects = _a.onAddProjects;
    return (react_1["default"].createElement("div", { className: "relative flex flex-col md:flex-row justify-between items-center bg-gray-800 bg-opacity-80 p-12 rounded-2xl shadow-2xl mb-8 overflow-hidden", style: { backgroundImage: "url('/Air_University_BCKG.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '600px' } },
        react_1["default"].createElement("div", { className: "absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" }),
        react_1["default"].createElement("div", { className: "relative z-10 md:w-1/2 flex flex-col space-y-8 text-left text-white" },
            react_1["default"].createElement("h1", { className: "text-6xl font-bold text-green-400 leading-tight drop-shadow-2xl" }, companyName),
            react_1["default"].createElement("p", { className: "text-lg text-gray-300 tracking-wide italic" },
                "By ",
                firstName,
                " ",
                lastName),
            react_1["default"].createElement("p", { className: "text-sm text-gray-500" },
                "Email: ",
                email),
            react_1["default"].createElement("p", { className: "text-sm text-gray-500" },
                "Address: ",
                address),
            react_1["default"].createElement("p", { className: "text-sm text-gray-500" },
                "Contact: ",
                contact),
            react_1["default"].createElement("p", { className: "text-sm text-gray-500" },
                "Expert ID: ",
                indExptId),
            react_1["default"].createElement("div", { className: "flex space-x-6 mt-10" },
                react_1["default"].createElement("button", { onClick: onViewProjects, className: "px-10 py-4 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:scale-105" }, "View Projects"),
                react_1["default"].createElement("button", { onClick: onEditProfile, className: "px-10 py-4 bg-purple-500 text-white font-bold rounded-full shadow-lg hover:shadow-purple-500/50 transition duration-300 transform hover:scale-105" }, "Edit Profile"),
                react_1["default"].createElement("button", { onClick: onAddProjects, className: "px-10 py-4 bg-green-600 text-white font-bold rounded-full shadow-lg hover:shadow-green-500/50 transition duration-300 transform hover:scale-105" }, "Add Projects"))),
        react_1["default"].createElement("div", { className: "relative z-10 mt-6 md:mt-0 md:w-1/2 flex justify-center" },
            react_1["default"].createElement("img", { src: "data:image/jpeg;base64," + companyLogo, alt: companyName, className: "w-80 h-80 rounded-full border-4 border-green-300 object-cover shadow-2xl transform hover:scale-110 transition duration-300" }))));
};
exports["default"] = IndustryProfile;
