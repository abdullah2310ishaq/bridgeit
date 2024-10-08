"use strict";
exports.__esModule = true;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var CompanyProfile = function (_a) {
    var companyName = _a.companyName, address = _a.address, contact = _a.contact, onEditCompany = _a.onEditCompany;
    return (react_1["default"].createElement("div", { className: "bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl mb-12 mt-16 relative overflow-hidden" },
        react_1["default"].createElement("div", { className: "absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600" }),
        react_1["default"].createElement("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 md:space-x-8" },
            react_1["default"].createElement("div", { className: "flex-1" },
                react_1["default"].createElement("h2", { className: "text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mb-2" }, companyName),
                react_1["default"].createElement("div", { className: "w-20 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full" })),
            react_1["default"].createElement("div", { className: "flex-1 space-y-4" },
                react_1["default"].createElement("p", { className: "flex items-center text-lg text-gray-300" },
                    react_1["default"].createElement(lucide_react_1.MapPin, { className: "w-6 h-6 mr-3 text-green-400" }),
                    react_1["default"].createElement("span", { className: "font-semibold text-gray-200 mr-2" }, "Address:"),
                    " ",
                    address),
                react_1["default"].createElement("p", { className: "flex items-center text-lg text-gray-300" },
                    react_1["default"].createElement(lucide_react_1.Phone, { className: "w-6 h-6 mr-3 text-blue-400" }),
                    react_1["default"].createElement("span", { className: "font-semibold text-gray-200 mr-2" }, "Contact:"),
                    " ",
                    contact))),
        react_1["default"].createElement("div", { className: "absolute bottom-0 right-0 opacity-10" },
            react_1["default"].createElement(lucide_react_1.Building2, { className: "w-48 h-48 text-gray-600" }))));
};
exports["default"] = CompanyProfile;
