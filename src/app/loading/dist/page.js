'use client';
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var Loading = function () {
    return (react_1["default"].createElement("div", { className: "relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-black text-gray-200 overflow-hidden" },
        react_1["default"].createElement(framer_motion_1.motion.div, { className: "absolute w-64 h-64 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-500 rounded-full filter blur-xl opacity-80", style: { top: '3%', left: '3%' }, animate: {
                scale: [1, 1.3, 1],
                rotate: [0, 360, 0],
                borderRadius: ["50%", "60% 40%", "50%"]
            }, transition: {
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut'
            } }),
        react_1["default"].createElement(framer_motion_1.motion.div, { className: "absolute w-80 h-80 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full filter blur-xl opacity-80", style: { bottom: '3%', right: '3%' }, animate: {
                scale: [1, 1.2, 1],
                rotate: [0, 360, 0],
                borderRadius: ["50%", "60% 40%", "50%"]
            }, transition: {
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut'
            } }),
        react_1["default"].createElement(framer_motion_1.motion.h1, { className: "text-2xl font-semibold tracking-widest mb-6 text-grey-300", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1.5, ease: 'easeInOut' } }, "LOADING, PLEASE WAIT!"),
        react_1["default"].createElement("div", { className: "flex space-x-3" }, __spreadArrays(Array(5)).map(function (_, index) {
            var colors = [
                'bg-gradient-to-r from-green-400 to-blue-500',
                'bg-gradient-to-r from-purple-400 to-pink-500',
                'bg-gradient-to-r from-yellow-400 to-red-500',
                'bg-gradient-to-r from-indigo-400 to-purple-600',
                'bg-gradient-to-r from-orange-400 to-pink-500',
            ];
            return (react_1["default"].createElement(framer_motion_1.motion.div, { key: index, className: "w-6 h-6 " + colors[index] + " rounded-full", animate: {
                    y: [0, -15, 0]
                }, transition: {
                    duration: 0.6,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: 'easeInOut'
                } }));
        }))));
};
exports["default"] = Loading;
