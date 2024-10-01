"use strict";
exports.__esModule = true;
var react_1 = require("react");
var CompanyProfile = function (_a) {
    var companyName = _a.companyName, address = _a.address, contact = _a.contact, onEditCompany = _a.onEditCompany;
    return (react_1["default"].createElement("div", { className: "flex flex-col md:flex-row justify-between items-center bg-gray-900 p-12 rounded-lg shadow-2xl mb-12 overflow-hidden mt-16 relative" },
        react_1["default"].createElement("h2", { className: "text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500" }, companyName),
        react_1["default"].createElement("p", { className: "text-lg text-gray-400" },
            react_1["default"].createElement("strong", null, "Address:"),
            " ",
            address),
        react_1["default"].createElement("p", { className: "text-lg text-gray-400" },
            react_1["default"].createElement("strong", null, "Contact:"),
            " ",
            contact),
        react_1["default"].createElement("button", { onClick: onEditCompany, className: "px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-blue-600 transition transform hover:scale-105" }, "Edit Company")));
};
exports["default"] = CompanyProfile;
