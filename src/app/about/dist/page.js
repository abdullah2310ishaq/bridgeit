"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var fa_1 = require("react-icons/fa");
var image_1 = require("next/image");
var AboutPage = function () {
    var _a = react_1.useState(null), popupContent = _a[0], setPopupContent = _a[1];
    var _b = react_1.useState(""), result = _b[0], setResult = _b[1];
    var onSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var formData, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    setResult("Sending....");
                    formData = new FormData(event.target);
                    formData.append("access_key", "8b4dd709-b9d0-48ee-8de7-8cd44ea8764d");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("https://api.web3forms.com/submit", {
                            method: "POST",
                            body: formData
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (data.success) {
                        setResult("Form Submitted Successfully");
                        event.target.reset();
                    }
                    else {
                        setResult(data.message);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    setResult("An error occurred while submitting the form.");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var team = [
        {
            name: "Muhammad Faizan Asghar",
            role: "Backend Guy",
            imgSrc: "/faizi.jpg",
            funFact: "I Love Ice Cream Shakes 🥳",
            linkedin: "https://linkedin.com/in/muhammad-faizan-asghar",
            github: "https://github.com/MfaizanA21"
        },
        {
            name: "Warda Butt",
            role: "Mockups and FrontEnd Lady",
            imgSrc: "/warda.png",
            funFact: "",
            linkedin: "https://linkedin.com/warda",
            github: "https://github.com/warda"
        },
        {
            name: "Warda Aslam",
            role: "Project Supervisor",
            imgSrc: "/madam.png",
            funFact: "I am not kharoos as I seem on first interaction",
            linkedin: "https://linkedin.com/warda-aslam",
            github: "https://github.com/warda-aslam"
        },
        {
            name: "Abdullah Ishaq",
            role: "Documentation Guy",
            imgSrc: "/heroimage.png",
            funFact: "I chatgpt everything and I dont know how to code",
            linkedin: "https://linkedin.com/ahmed",
            github: "https://github.com/ahmed"
        },
        {
            name: "Aesyem Ali Fayyaz",
            role: "Co - Supervisor",
            imgSrc: "/aesyem.png",
            funFact: "Need a Sponsor? Aesyem Institute of Research is at your service",
            linkedin: "https://linkedin.com/zain",
            github: "https://github.com/zain"
        },
    ];
    var handlePopupOpen = function (member) {
        setPopupContent(member);
    };
    var handlePopupClose = function () {
        setPopupContent(null);
    };
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gray-900 text-gray-200 flex flex-col" },
        react_1["default"].createElement("section", { className: "relative bg-cover bg-center h-[80vh]", style: { backgroundImage: 'url("/images/hero-bg.jpg")' } },
            react_1["default"].createElement("div", { className: "absolute inset-0 bg-gray-900 opacity-60" }),
            react_1["default"].createElement("div", { className: "relative z-10 flex items-center justify-center h-full px-4" },
                react_1["default"].createElement("div", { className: "max-w-7xl mx-auto flex items-center justify-between w-full" },
                    react_1["default"].createElement(framer_motion_1.motion.div, { animate: { rotate: -360 }, transition: { duration: 20, repeat: Infinity, ease: "linear" }, className: "absolute left-4 lg:left-20 z-0" },
                        react_1["default"].createElement(image_1["default"], { src: "/abouthero.png", alt: "BridgeIT", width: 500, height: 400 })),
                    react_1["default"].createElement("div", { className: "relative z-10 flex flex-col items-center justify-center h-full text-center px-4 space-y-8 w-full" },
                        react_1["default"].createElement(framer_motion_1.motion.h1, { initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 1 }, className: "text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-500" }, "Welcome to BridgeIT"),
                        react_1["default"].createElement(framer_motion_1.motion.p, { initial: { y: 50, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 1, delay: 0.5 }, className: "text-lg md:text-xl max-w-3xl mx-auto text-white" }, "Bridging the gap between academia and students through innovative collaborations and interactive learning environments."),
                        react_1["default"].createElement(framer_motion_1.motion.a, { href: "#contact", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, 
                            // initial={{ y: 50, opacity: 0 }}
                            // animate={{ y: 0, opacity: 1 }}
                            // transition={{ duration: 1 }}
                            className: "bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 text-lg" }, "Get in Touch"))))),
        react_1["default"].createElement("section", { className: "py-12 px-4 bg-gray-900" },
            react_1["default"].createElement("div", { className: "max-w-7xl mx-auto text-center mb-8" },
                react_1["default"].createElement("h2", { className: "text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 mb-4" }, "Meet Our Dynamic Team"),
                react_1["default"].createElement("p", { className: "text-gray-400 max-w-2xl mx-auto" }, "Each of our team members brings a unique flair and a fun personality to BridgeIT!")),
            react_1["default"].createElement("div", { className: "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16" }, team.map(function (member) { return (react_1["default"].createElement(framer_motion_1.motion.div, { key: member.name, className: "relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300" },
                react_1["default"].createElement("div", { className: "relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500 mb-6" },
                    react_1["default"].createElement(image_1["default"], { src: member.imgSrc, alt: member.name, width: 192, height: 192, className: "object-cover w-full h-full" })),
                react_1["default"].createElement("h3", { className: "text-2xl font-bold text-white" }, member.name),
                react_1["default"].createElement("p", { className: "text-gray-400" }, member.role),
                react_1["default"].createElement("button", { onClick: function () { return handlePopupOpen(member); }, className: "mt-4 py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-semibold rounded-full shadow-lg transition-all duration-300" }, "Fun Fact"),
                react_1["default"].createElement("div", { className: "flex space-x-4 mt-6" },
                    react_1["default"].createElement("a", { href: member.linkedin, target: "_blank", rel: "noopener noreferrer", className: "text-gray-400 hover:text-blue-500" },
                        react_1["default"].createElement(fa_1.FaLinkedin, { size: 24 })),
                    react_1["default"].createElement("a", { href: member.github, target: "_blank", rel: "noopener noreferrer", className: "text-gray-400 hover:text-blue-500" },
                        react_1["default"].createElement(fa_1.FaGithub, { size: 24 }))))); }))),
        popupContent && (react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, className: "fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" },
            react_1["default"].createElement(framer_motion_1.motion.div, { initial: { scale: 0.9 }, animate: { scale: 1 }, transition: { duration: 0.5 }, className: "relative bg-gradient-to-br from-purple-800 to-blue-900 p-12 rounded-xl text-center max-w-lg mx-auto shadow-2xl" },
                react_1["default"].createElement("div", { className: "flex justify-center mb-6" },
                    react_1["default"].createElement(image_1["default"], { src: popupContent.imgSrc, alt: popupContent.name, width: 100, height: 100, className: "rounded-full border-4 border-white" })),
                react_1["default"].createElement("h2", { className: "text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 mb-2" }, popupContent.name),
                react_1["default"].createElement("p", { className: "text-lg text-gray-300 mb-2" }, popupContent.role),
                react_1["default"].createElement("p", { className: "text-lg text-gray-400 bold mb-4" },
                    "\"",
                    popupContent.funFact,
                    "\""),
                react_1["default"].createElement("button", { onClick: handlePopupClose, className: "mt-6 py-2 px-6 bg-gradient-to-r from-green-500 to-blue-600 hover:from-blue-600 hover:to-green-500 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out" }, "Close")))),
        react_1["default"].createElement("section", { id: "contact", className: "py-16 px-4 bg-gray-900" },
            react_1["default"].createElement("div", { className: "max-w-7xl mx-auto text-center mb-12" },
                react_1["default"].createElement("h2", { className: "text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 mb-4" }, "Get in Touch"),
                react_1["default"].createElement("p", { className: "text-gray-400 max-w-2xl mx-auto" }, "Whether you have questions, feedback, or partnership inquiries, we'd love to hear from you.")),
            react_1["default"].createElement("div", { className: "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center" },
                react_1["default"].createElement("div", { className: "flex flex-col space-y-4" },
                    react_1["default"].createElement("div", { className: "flex items-center space-x-2" },
                        react_1["default"].createElement(fa_1.FaEnvelope, { className: "text-green-400 text-xl" }),
                        react_1["default"].createElement("a", { href: "mailto:contact@bridgeit.com", className: "text-gray-300 hover:text-green-400 transition-colors duration-300" }, "contact@bridgeit.com")),
                    react_1["default"].createElement("div", { className: "flex items-center space-x-2" },
                        react_1["default"].createElement(fa_1.FaPhone, { className: "text-green-400 text-xl" }),
                        react_1["default"].createElement("a", { href: "tel:+92-346-2207429", className: "text-gray-300 hover:text-green-400 transition-colors duration-300" }, "+92-346-2207429")),
                    react_1["default"].createElement("div", { className: "flex items-center space-x-2" },
                        react_1["default"].createElement(fa_1.FaMapMarkerAlt, { className: "text-green-400 text-xl" }),
                        react_1["default"].createElement("span", { className: "text-gray-300" }, "Air University, Islamabad"))),
                react_1["default"].createElement("form", { onSubmit: onSubmit, className: "flex flex-col space-y-4" },
                    react_1["default"].createElement("input", { type: "text", name: "name", placeholder: "Your Name", className: "p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400", required: true }),
                    react_1["default"].createElement("input", { "type-": "email", name: "email", placeholder: "Your Email", className: "p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400", required: true }),
                    react_1["default"].createElement("textarea", { name: "message", placeholder: "Your Message", className: "p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400", rows: 5, required: true }),
                    react_1["default"].createElement("button", { type: "submit", className: "bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300" }, "Send Message")),
                react_1["default"].createElement("div", { className: "hidden lg:block" },
                    react_1["default"].createElement(image_1["default"], { src: "/getintouch.png", alt: "Get in touch", width: 300, height: 300 })))),
        react_1["default"].createElement("footer", { className: "py-6 px-4 bg-gray-800" },
            react_1["default"].createElement("div", { className: "max-w-7xl mx-auto text-center" },
                react_1["default"].createElement("p", { className: "text-gray-400" }, "\u00A9 2024 BridgeIT. All rights reserved.")))));
};
exports["default"] = AboutPage;
