"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var EventsSection = function (_a) {
    var events = _a.events, gradientStyles = _a.gradientStyles;
    var _b = react_1.useState(false), showAllEvents = _b[0], setShowAllEvents = _b[1];
    // Toggle the display of all events
    var toggleAllEvents = function () { return setShowAllEvents(!showAllEvents); };
    return (react_1["default"].createElement("section", { className: "py-16 bg-gradient-to-br from-gray-900 to-gray-900" },
        react_1["default"].createElement("div", { className: "max-w-7xl mx-auto mb-16 px-4 md:px-6 lg:px-8" },
            react_1["default"].createElement("h1", { className: "text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-300", style: { padding: "0.6rem 0", marginLeft: "-7rem" } }, "Upcoming University Events")),
        react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12" }, events.slice(0, 3).map(function (event, index) { return (react_1["default"].createElement(framer_motion_1.motion.div, { key: event.id, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.1 }, className: "relative p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden " + gradientStyles[index % gradientStyles.length] },
            react_1["default"].createElement("div", { className: "absolute inset-0 bg-black opacity-10 z-0" }),
            react_1["default"].createElement("div", { className: "relative z-10 flex flex-col h-full" },
                react_1["default"].createElement("h2", { className: "text-2xl font-bold text-white mb-4 tracking-tight" }, event.title),
                react_1["default"].createElement("div", { className: "flex items-center text-white mb-2" },
                    react_1["default"].createElement(lucide_react_1.User, { className: "w-4 h-4 mr-2" }),
                    react_1["default"].createElement("p", { className: "text-sm" },
                        "Speaker: ",
                        event.speakerName)),
                react_1["default"].createElement("div", { className: "flex items-center text-white mb-2" },
                    react_1["default"].createElement(lucide_react_1.Calendar, { className: "w-4 h-4 mr-2" }),
                    react_1["default"].createElement("p", { className: "text-sm" },
                        "Date: ",
                        new Date(event.eventDate).toLocaleDateString())),
                react_1["default"].createElement("div", { className: "flex items-center text-white" },
                    react_1["default"].createElement(lucide_react_1.MapPin, { className: "w-4 h-4 mr-2" }),
                    react_1["default"].createElement("p", { className: "text-sm" },
                        "Venue: ",
                        event.venue))),
            react_1["default"].createElement("div", { className: "absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl" }),
            react_1["default"].createElement("div", { className: "absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl" }))); })),
        showAllEvents && (react_1["default"].createElement("div", { className: "mt-12 px-4 md:px-12" },
            react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }, events.length > 3 ? (events.slice(3).map(function (event, index) { return (react_1["default"].createElement(framer_motion_1.motion.div, { key: event.id, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.1 }, className: "relative p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden " + gradientStyles[(index + 3) % gradientStyles.length] },
                react_1["default"].createElement("div", { className: "absolute inset-0 bg-black opacity-10 z-0" }),
                react_1["default"].createElement("div", { className: "relative z-10 flex flex-col h-full" },
                    react_1["default"].createElement("h2", { className: "text-2xl font-bold text-white mb-4 tracking-tight" }, event.title),
                    react_1["default"].createElement("div", { className: "flex items-center text-white mb-2" },
                        react_1["default"].createElement(lucide_react_1.User, { className: "w-4 h-4 mr-2" }),
                        react_1["default"].createElement("p", { className: "text-sm" },
                            "Speaker: ",
                            event.speakerName)),
                    react_1["default"].createElement("div", { className: "flex items-center text-white mb-2" },
                        react_1["default"].createElement(lucide_react_1.Calendar, { className: "w-4 h-4 mr-2" }),
                        react_1["default"].createElement("p", { className: "text-sm" },
                            "Date: ",
                            new Date(event.eventDate).toLocaleDateString())),
                    react_1["default"].createElement("div", { className: "flex items-center text-white" },
                        react_1["default"].createElement(lucide_react_1.MapPin, { className: "w-4 h-4 mr-2" }),
                        react_1["default"].createElement("p", { className: "text-sm" },
                            "Venue: ",
                            event.venue))),
                react_1["default"].createElement("div", { className: "absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl" }),
                react_1["default"].createElement("div", { className: "absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl" }))); })) : (react_1["default"].createElement("p", { className: "text-gray-500 text-center col-span-full" }, "No more events"))))),
        react_1["default"].createElement("div", { className: "mt-12 flex justify-center space-x-6" },
            react_1["default"].createElement("button", { onClick: toggleAllEvents, className: "group px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-full shadow-lg hover:shadow-gray-600/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" },
                react_1["default"].createElement("span", { className: "flex items-center justify-center" },
                    react_1["default"].createElement(lucide_react_1.Eye, { className: "w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" }),
                    showAllEvents ? "Show Less Events" : "See More Events")))));
};
exports["default"] = EventsSection;
