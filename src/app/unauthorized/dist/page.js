'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var framer_motion_1 = require("framer-motion");
var image_1 = require("next/image");
var Unauthorized = function () {
    var router = navigation_1.useRouter();
    var handleGoBack = function () {
        router.push('/auth/login-user');
    };
    return (react_1["default"].createElement("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-black text-gray-200 relative" },
        react_1["default"].createElement("div", { className: "absolute inset-0 z-0 overflow-hidden" },
            react_1["default"].createElement(image_1["default"], { src: "/errorbg.png", alt: "Error background", width: 1000, height: 1000, className: "object-cover opacity-30" // Full-screen image with low opacity
             })),
        react_1["default"].createElement("div", { className: "flex flex-col md:flex-row items-center justify-center w-full max-w-6xl z-10" },
            react_1["default"].createElement(framer_motion_1.motion.div, { className: "w-full md:w-1/2 flex justify-center items-center", initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.6, ease: "easeInOut" } },
                react_1["default"].createElement(image_1["default"], { src: "/errorbg.png", alt: "Error background", width: 700, height: 700, className: "object-contain" })),
            react_1["default"].createElement(framer_motion_1.motion.div, { className: "w-full md:w-1/2 text-center p-12", initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.6, ease: "easeInOut" } },
                react_1["default"].createElement(framer_motion_1.motion.h1, { className: "text-6xl font-extrabold text-red-500 mb-4", initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.5, ease: "easeOut" } }, "Access Denied"),
                react_1["default"].createElement(framer_motion_1.motion.p, { className: "text-xl mb-8 text-gray-300", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.5, delay: 0.2, ease: "easeOut" } }, "You need to log in to access this page."),
                react_1["default"].createElement(framer_motion_1.motion.button, { onClick: handleGoBack, className: "py-3 px-8 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-yellow-600 transition duration-300 shadow-lg", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }, "Back to Login")))));
};
exports["default"] = Unauthorized;
