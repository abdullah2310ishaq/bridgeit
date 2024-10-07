"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var fa_1 = require("react-icons/fa");
var ProfileDropdown = function (_a) {
    var userProfile = _a.userProfile, onLogoutClick = _a.onLogoutClick;
    var _b = react_1.useState(false), dropdownOpen = _b[0], setDropdownOpen = _b[1];
    var router = navigation_1.useRouter();
    var dropdownRef = react_1.useRef(null);
    var toggleDropdown = function () { return setDropdownOpen(!dropdownOpen); };
    var handleEditProfile = function () {
        router.push("/student/profile/edit");
        setDropdownOpen(false);
    };
    var handleViewProfile = function () {
        router.push("/student/profile");
        setDropdownOpen(false);
    };
    var updateImage = function () {
        router.push("/student/profile/management");
        setDropdownOpen(false);
    };
    var updatePassword = function () {
        router.push("student/profile/edit");
        setDropdownOpen(false);
    };
    var handleLogoutClickLocal = function () {
        setDropdownOpen(false);
        onLogoutClick(); // Trigger the dialog in NavBar
    };
    // Close the dropdown when clicking outside
    react_1.useEffect(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (react_1["default"].createElement("div", { className: "relative inline-block text-left", ref: dropdownRef },
        react_1["default"].createElement("button", { onClick: toggleDropdown, className: "flex items-center focus:outline-none" },
            react_1["default"].createElement("img", { src: "data:image/jpeg;base64," + userProfile.imageData, alt: "Profile", className: "w-10 h-10 rounded-full border-2 border-blue-600" }),
            react_1["default"].createElement(fa_1.FaChevronDown, { className: "ml-2 text-gray-600 hover:text-blue-600 transition duration-300" })),
        dropdownOpen && (react_1["default"].createElement("div", { className: "origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50" },
            react_1["default"].createElement("div", { className: "py-1", role: "menu", "aria-orientation": "vertical" },
                react_1["default"].createElement("div", { className: "px-4 py-2 border-b bg-gray-100 rounded-t-md" },
                    react_1["default"].createElement("p", { className: "text-sm font-medium text-gray-700" },
                        userProfile.firstName,
                        " ",
                        userProfile.lastName)),
                react_1["default"].createElement("button", { onClick: handleViewProfile, className: "flex items-center w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition duration-300" },
                    react_1["default"].createElement(fa_1.FaUserEdit, { className: "mr-2" }),
                    " View Profile"),
                react_1["default"].createElement("button", { onClick: handleEditProfile, className: "flex items-center w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition duration-300" },
                    react_1["default"].createElement(fa_1.FaUserEdit, { className: "mr-2" }),
                    " Edit Profile"),
                react_1["default"].createElement("button", { onClick: updateImage, className: "flex items-center w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition duration-300" },
                    react_1["default"].createElement(fa_1.FaImage, { className: "mr-2" }),
                    " Upload Image"),
                react_1["default"].createElement("button", { onClick: updatePassword, className: "flex items-center w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition duration-300" },
                    react_1["default"].createElement(fa_1.FaLock, { className: "mr-2" }),
                    " Update Password"),
                react_1["default"].createElement("div", { className: "border-t my-2" }),
                react_1["default"].createElement("button", { onClick: handleLogoutClickLocal, className: "flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-gray-100 transition duration-300 bg-red-50 rounded-b-md" },
                    react_1["default"].createElement(fa_1.FaSignOutAlt, { className: "mr-2" }),
                    " Logout"))))));
};
exports["default"] = ProfileDropdown;
