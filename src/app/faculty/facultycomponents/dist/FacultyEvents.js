"use strict";
exports.__esModule = true;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var UpcomingEventsSection = function (_a) {
    var events = _a.events, onSeeMoreEvents = _a.onSeeMoreEvents, onCreateEvent = _a.onCreateEvent;
    var gradientStyles = [
        'bg-gradient-to-r from-green-400 to-blue-500',
        'bg-gradient-to-r from-purple-400 to-pink-500',
        'bg-gradient-to-r from-yellow-400 to-red-500',
        'bg-gradient-to-r from-indigo-400 to-purple-600',
        'bg-gradient-to-r from-orange-400 to-pink-500',
    ];
    return (react_1["default"].createElement("div", { className: "mt-16 bg-gray-900 p-12 rounded-lg shadow-2xl" },
        react_1["default"].createElement("div", { className: "flex flex-col md:flex-row items-center justify-between mb-12" },
            react_1["default"].createElement("div", { className: "relative w-full md:w-1/2 flex justify-center mb-8 md:mb-0" },
                react_1["default"].createElement("img", { src: "/calender.png", alt: "Calendar", className: "w-64 h-auto transform rotate-6 opacity-90" })),
            react_1["default"].createElement("div", { className: "w-full md:w-1/2 text-left" },
                react_1["default"].createElement("h1", { className: "text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500" }, "Upcoming University Events"),
                react_1["default"].createElement("p", { className: "text-lg text-gray-300 mb-8" }, "Stay up to date with the latest events happening at the university. Don\u2019t miss out on seminars, workshops, and more!"))),
        react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }, events.map(function (event, index) { return (react_1["default"].createElement(framer_motion_1.motion.div, { key: event.id, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.1 }, className: "relative p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden " + gradientStyles[index % gradientStyles.length] },
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
        react_1["default"].createElement("div", { className: "flex justify-center space-x-6 mt-8" },
            react_1["default"].createElement("button", { onClick: onSeeMoreEvents, className: "group px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-full shadow-lg hover:shadow-gray-600/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" },
                react_1["default"].createElement("span", { className: "flex items-center justify-center" },
                    react_1["default"].createElement(lucide_react_1.Edit, { className: "w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" }),
                    "Create Events")),
            react_1["default"].createElement("button", { onClick: onCreateEvent, className: "group px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-full shadow-lg hover:shadow-gray-600/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" },
                react_1["default"].createElement("span", { className: "flex items-center justify-center" },
                    react_1["default"].createElement(lucide_react_1.Eye, { className: "w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" }),
                    "See More Events")))));
};
exports["default"] = UpcomingEventsSection;
