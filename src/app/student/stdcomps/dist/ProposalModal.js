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
var navigation_1 = require("next/navigation");
var react_toastify_1 = require("react-toastify");
var fa_1 = require("react-icons/fa");
require("react-toastify/dist/ReactToastify.css");
var ProposalModal = function (_a) {
    var projectId = _a.projectId, studentId = _a.studentId, onClose = _a.onClose;
    var _b = react_1.useState(""), proposal = _b[0], setProposal = _b[1];
    var _c = react_1.useState(false), isSubmitting = _c[0], setIsSubmitting = _c[1];
    var router = navigation_1.useRouter();
    var handleSubmitProposal = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, errorData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!proposal.trim()) {
                        react_toastify_1.toast.error("Please enter your proposal.");
                        return [2 /*return*/];
                    }
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, fetch("https://localhost:7053/api/project-proposals/send-proposal", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                proposal: proposal,
                                studentId: studentId,
                                projectId: projectId
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    react_toastify_1.toast.success("Proposal submitted successfully!");
                    // Close the modal after submission
                    onClose();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    errorData = _a.sent();
                    react_toastify_1.toast.error(errorData.message || "Failed to submit proposal. Please try again.");
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    console.error("Error submitting proposal:", error_1);
                    react_toastify_1.toast.error("An error occurred while submitting the proposal.");
                    return [3 /*break*/, 8];
                case 7:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: "fixed inset-0 bg-gray-900 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50" },
        react_1["default"].createElement("div", { className: "bg-gray-800 text-gray-200 p-8 shadow-2xl w-full max-w-lg relative" },
            react_1["default"].createElement("button", { className: "absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors", onClick: onClose },
                react_1["default"].createElement(fa_1.FaTimes, { size: 24 })),
            react_1["default"].createElement("h2", { className: "text-3xl font-bold text-green-400 mb-6 flex items-center " },
                react_1["default"].createElement(fa_1.FaEdit, { className: "mr-2 text-green-400" }),
                " Submit Your Proposal Here"),
            react_1["default"].createElement("textarea", { value: proposal, onChange: function (e) { return setProposal(e.target.value); }, placeholder: "Write your proposal here...", className: "w-full p-4 rounded-md bg-gray-700 text-gray-200 h-48 border border-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-300" }),
            react_1["default"].createElement("div", { className: "mt-8 flex justify-end space-x-4" },
                react_1["default"].createElement("button", { className: "px-6 py-3 rounded-full font-medium text-white shadow-lg transform transition-all duration-300 " + (isSubmitting
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-500 shadow-lg transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"), onClick: handleSubmitProposal, disabled: isSubmitting }, isSubmitting ? "Submitting..." : "Submit Proposal"),
                react_1["default"].createElement("button", { className: "px-6 py-3 rounded-full bg-red-600 text-white font-medium hover:bg-red-500 shadow-lg transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2", onClick: onClose }, "Cancel"))),
        react_1["default"].createElement(react_toastify_1.ToastContainer, { position: "top-right", autoClose: 3000, hideProgressBar: true })));
};
exports["default"] = ProposalModal;
