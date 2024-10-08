// components/IndustryExpertNavBar.tsx
"use client";
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var fa_1 = require("react-icons/fa");
var react_2 = require("@headlessui/react");
var DropDownExpert_1 = require("./DropDownExpert");
var IndustryExpertNavBar = function (_a) {
    var userProfile = _a.userProfile, onLogout = _a.onLogout;
    var pathname = navigation_1.usePathname();
    var router = navigation_1.useRouter();
    var _b = react_1.useState(""), activePage = _b[0], setActivePage = _b[1];
    var _c = react_1.useState(false), mobileMenuOpen = _c[0], setMobileMenuOpen = _c[1];
    // State for logout confirmation dialog
    var _d = react_1.useState(false), isLogoutDialogOpen = _d[0], setIsLogoutDialogOpen = _d[1];
    // Set active page based on the current route
    react_1.useEffect(function () {
        setActivePage(pathname);
    }, [pathname]);
    var navigationLinks = [
        { name: "Home", href: "/industryexpert" },
        {
            name: "Projects",
            href: "#",
            children: [
                { name: "Create Projects", href: "/industryexpert/projects/create" },
            ]
        },
        {
            name: "Profile",
            href: "#",
            children: [
                { name: "View", href: "/industryexpert/profile" },
            ]
        },
        {
            name: "Update",
            href: "#",
            children: [
                { name: "Password", href: "/industryexpert/profile/manageexpert" },
                { name: "Image", href: "/industryexpert/profile/manageexpert" },
            ]
        },
        {
            name: "Notifications",
            href: "/industryexpert/notifications"
        },
    ];
    var isActiveLink = function (link) {
        if (link.href === "#" && link.children) {
            // Check if any child link is active
            return link.children.some(function (child) { return activePage.startsWith(child.href); });
        }
        else {
            return activePage === link.href || activePage.startsWith(link.href);
        }
    };
    // Function to handle logout click from ProfileDropdown
    var handleLogoutClick = function () {
        setIsLogoutDialogOpen(true);
    };
    // Function to confirm logout
    var handleConfirmLogout = function () {
        setIsLogoutDialogOpen(false);
        onLogout();
    };
    // Function to cancel logout
    var handleCancelLogout = function () {
        setIsLogoutDialogOpen(false);
    };
    return (react_1["default"].createElement("nav", { className: "bg-gray-800 fixed w-full top-0 z-50 shadow-md" },
        react_1["default"].createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
            react_1["default"].createElement("div", { className: "flex justify-between h-16" },
                react_1["default"].createElement("div", { className: "flex items-center" },
                    react_1["default"].createElement(link_1["default"], { href: "/industry-expert", className: "text-blue-500 text-2xl font-bold hover:text-blue-400" }, "BridgeIT")),
                react_1["default"].createElement("div", { className: "hidden md:flex md:ml-10 space-x-4 items-center" }, navigationLinks.map(function (link) { return (react_1["default"].createElement("div", { key: link.name, className: "relative group" }, link.children ? (
                // Render parent link with dropdown
                react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("button", { className: "px-3 py-2 text-sm font-medium transition duration-300 " + (isActiveLink(link)
                            ? "text-blue-500 border-b-2 border-blue-500"
                            : "text-gray-300 hover:text-blue-500") }, link.name),
                    react_1["default"].createElement("div", { className: "absolute left-0 mt-2 w-48 bg-gray-800 shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50" }, link.children.map(function (child) { return (react_1["default"].createElement(link_1["default"], { key: child.name, href: child.href, className: "block px-4 py-2 text-sm hover:bg-gray-700 " + (activePage.startsWith(child.href)
                            ? "text-blue-500 bg-gray-700"
                            : "text-gray-300 hover:text-blue-500") }, child.name)); })))) : (
                // Render normal link
                react_1["default"].createElement(link_1["default"], { href: link.href, className: "relative px-3 py-2 text-sm font-medium transition duration-300 " + (isActiveLink(link)
                        ? "text-blue-500 border-b-2 border-blue-500"
                        : "text-gray-300 hover:text-blue-500") },
                    link.name,
                    isActiveLink(link) && (react_1["default"].createElement("span", { className: "absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 animate-slideIn" })))))); })),
                react_1["default"].createElement("div", { className: "hidden md:flex items-center" },
                    react_1["default"].createElement(DropDownExpert_1["default"], { userProfile: userProfile, onLogoutClick: handleLogoutClick })),
                react_1["default"].createElement("div", { className: "md:hidden flex items-center" },
                    react_1["default"].createElement("button", { onClick: function () { return setMobileMenuOpen(!mobileMenuOpen); }, className: "text-gray-300 hover:text-blue-500 focus:outline-none" },
                        react_1["default"].createElement(fa_1.FaBars, { size: 24 }))))),
        react_1["default"].createElement(react_2.Transition, { show: mobileMenuOpen, enter: "transition ease-out duration-200 transform", enterFrom: "opacity-0 -translate-y-2", enterTo: "opacity-100 translate-y-0", leave: "transition ease-in duration-150 transform", leaveFrom: "opacity-100 translate-y-0", leaveTo: "opacity-0 -translate-y-2" },
            react_1["default"].createElement("div", { className: "md:hidden bg-gray-800 shadow-md" },
                react_1["default"].createElement("div", { className: "px-2 pt-2 pb-3 space-y-1 sm:px-3" },
                    navigationLinks.map(function (link) { return (react_1["default"].createElement("div", { key: link.name }, link.children ? (
                    // Render parent link with collapsible children
                    react_1["default"].createElement("div", { className: "space-y-1" },
                        react_1["default"].createElement("button", { className: "block w-full text-left px-3 py-2 rounded-md text-base font-medium transition duration-300 " + (isActiveLink(link)
                                ? "text-blue-500 bg-gray-700"
                                : "text-gray-300 hover:text-blue-500") }, link.name),
                        react_1["default"].createElement("div", { className: "pl-4" }, link.children.map(function (child) { return (react_1["default"].createElement(link_1["default"], { key: child.name, href: child.href, onClick: function () { return setMobileMenuOpen(false); }, className: "block px-3 py-2 rounded-md text-base font-medium transition duration-300 " + (activePage.startsWith(child.href)
                                ? "text-blue-500 bg-gray-700"
                                : "text-gray-300 hover:text-blue-500") }, child.name)); })))) : (
                    // Render normal link
                    react_1["default"].createElement(link_1["default"], { href: link.href, onClick: function () { return setMobileMenuOpen(false); }, className: "block px-3 py-2 rounded-md text-base font-medium transition duration-300 " + (isActiveLink(link)
                            ? "text-blue-500 bg-gray-700"
                            : "text-gray-300 hover:text-blue-500") }, link.name)))); }),
                    react_1["default"].createElement("div", { className: "border-t border-gray-700" }),
                    react_1["default"].createElement("button", { onClick: function () {
                            router.push("/industry-expert/profile");
                            setMobileMenuOpen(false);
                        }, className: "block w-full text-left px-3 py-2 text-gray-300 hover:text-blue-500 rounded-md text-base font-medium transition duration-300" }, "View Profile"),
                    react_1["default"].createElement("button", { onClick: function () {
                            router.push("/industry-expert/profile/edit");
                            setMobileMenuOpen(false);
                        }, className: "block w-full text-left px-3 py-2 text-gray-300 hover:text-blue-500 rounded-md text-base font-medium transition duration-300" }, "Edit Profile"),
                    react_1["default"].createElement("button", { onClick: function () {
                            setMobileMenuOpen(false);
                            handleLogoutClick();
                        }, className: "block w-full text-left px-3 py-2 text-red-500 hover:text-red-700 rounded-md text-base font-medium transition duration-300" }, "Logout")))),
        react_1["default"].createElement(react_2.Transition, { appear: true, show: isLogoutDialogOpen, as: react_1["default"].Fragment },
            react_1["default"].createElement(react_2.Dialog, { as: "div", className: "relative z-50", onClose: handleCancelLogout },
                react_1["default"].createElement(react_2.Transition.Child, { as: react_1["default"].Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0" },
                    react_1["default"].createElement("div", { className: "fixed inset-0 bg-black bg-opacity-50" })),
                react_1["default"].createElement("div", { className: "fixed inset-0 overflow-y-auto" },
                    react_1["default"].createElement("div", { className: "flex items-center justify-center min-h-full p-4 text-center" },
                        react_1["default"].createElement(react_2.Transition.Child, { as: react_1["default"].Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95" },
                            react_1["default"].createElement(react_2.Dialog.Panel, { className: "max-w-md w-full bg-gray-800 rounded-lg p-6 shadow-lg transform transition-all" },
                                react_1["default"].createElement("div", { className: "flex items-center space-x-4" },
                                    react_1["default"].createElement("div", { className: "bg-red-100 p-3 rounded-full" },
                                        react_1["default"].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 text-red-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                            react_1["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2m4-10V7a2 2 0 00-2-2H9a2 2 0 00-2 2v4m12 5v-5m-4 0a2 2 0 01-2 2h-4a2 2 0 01-2-2v5m2 2H7" }))),
                                    react_1["default"].createElement(react_2.Dialog.Title, { className: "text-xl font-semibold text-gray-100" }, "Confirm Logout")),
                                react_1["default"].createElement("div", { className: "mt-4" },
                                    react_1["default"].createElement("p", { className: "text-sm text-gray-300" }, "Are you sure you want to log out? You will need to log back in to access your account.")),
                                react_1["default"].createElement("div", { className: "mt-6 flex justify-end space-x-4" },
                                    react_1["default"].createElement("button", { onClick: handleCancelLogout, className: "px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition" }, "Cancel"),
                                    react_1["default"].createElement("button", { onClick: handleConfirmLogout, className: "px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition" }, "Logout"))))))))));
};
exports["default"] = IndustryExpertNavBar;
