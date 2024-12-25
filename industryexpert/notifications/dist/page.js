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
require("react-toastify/dist/ReactToastify.css");
var PropossalDetails_1 = require("../industrycomponents/PropossalDetails");
var NotificationsPage = function () {
    var _a = react_1.useState([]), proposals = _a[0], setProposals = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState(null), selectedProposal = _d[0], setSelectedProposal = _d[1]; // State for selected proposal
    var _e = react_1.useState(false), showModal = _e[0], setShowModal = _e[1]; // State to toggle modal
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        var fetchProposals = function () { return __awaiter(void 0, void 0, void 0, function () {
            var token, profileResponse, profileData, userId, expertResponse, expertData, expertId, proposalsResponse, proposalsData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = localStorage.getItem("jwtToken");
                        if (!token) {
                            router.push("/auth/login-user");
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, 11, 12]);
                        return [4 /*yield*/, fetch("https://localhost:7053/api/auth/authorized-user-info", {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 2:
                        profileResponse = _a.sent();
                        if (!profileResponse.ok)
                            throw new Error("Failed to fetch profile");
                        return [4 /*yield*/, profileResponse.json()];
                    case 3:
                        profileData = _a.sent();
                        userId = profileData.userId;
                        return [4 /*yield*/, fetch("https://localhost:7053/api/get-industry-expert/industry-expert-by-id/" + userId, {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 4:
                        expertResponse = _a.sent();
                        if (!expertResponse.ok)
                            throw new Error("Failed to fetch expert profile");
                        return [4 /*yield*/, expertResponse.json()];
                    case 5:
                        expertData = _a.sent();
                        expertId = expertData.indExptId;
                        return [4 /*yield*/, fetch("https://localhost:7053/api/project-proposals/get-proposal-for-expert/" + expertId, {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 6:
                        proposalsResponse = _a.sent();
                        if (!proposalsResponse.ok) return [3 /*break*/, 8];
                        return [4 /*yield*/, proposalsResponse.json()];
                    case 7:
                        proposalsData = _a.sent();
                        setProposals(proposalsData);
                        return [3 /*break*/, 9];
                    case 8:
                        setProposals([]);
                        _a.label = 9;
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        error_1 = _a.sent();
                        setError("Failed to fetch proposals");
                        console.error(error_1);
                        return [3 /*break*/, 12];
                    case 11:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        }); };
        fetchProposals();
    }, [router]);
    if (loading) {
        return react_1["default"].createElement("div", { className: "text-center text-gray-400" }, "Loading...");
    }
    if (error) {
        return;
        react_1["default"].createElement("div", { className: "text-center text-red-500" }, error);
    }
    if (proposals.length === 0) {
        react_1["default"].createElement("div", { className: "text-center text-white font-semibold text-lg mt-10" }, "No new notifications. All notifications have been read.");
    }
    var handleSeeDetails = function (proposal) {
        setSelectedProposal(proposal);
        setShowModal(true);
    };
    var handleSeeProfile = function (studentUserId) {
        if (studentUserId) {
            router.push("/industryexpert/student-profile/" + studentUserId);
        }
        else {
            react_toastify_1.toast.error("Student ID not available");
        }
    };
    var handleAcceptProposal = function (proposalId) { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    token = localStorage.getItem("jwtToken");
                    return [4 /*yield*/, fetch("https://localhost:7053/api/project-proposals/accept-proposal/" + proposalId, {
                            method: "PUT",
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (response.ok) {
                        react_toastify_1.toast.success("Proposal accepted successfully!");
                        setProposals(function (prev) {
                            return prev.filter(function (proposal) { return proposal.id !== proposalId; });
                        } // Remove proposal after accepting
                        );
                        setShowModal(false); // Close the modal
                    }
                    else {
                        react_toastify_1.toast.error("Failed to accept proposal.");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    react_toastify_1.toast.error("Error accepting proposal.");
                    console.error("Error accepting proposal:", error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleRejectProposal = function (proposalId) { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    token = localStorage.getItem("jwtToken");
                    return [4 /*yield*/, fetch("https://localhost:7053/api/project-proposals/reject-proposal/" + proposalId, {
                            method: "PUT",
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (response.ok) {
                        react_toastify_1.toast.success("Proposal rejected successfully!");
                        setProposals(function (prev) {
                            return prev.filter(function (proposal) { return proposal.id !== proposalId; });
                        });
                        setShowModal(false); // Close the modal
                    }
                    else {
                        react_toastify_1.toast.error("Failed to reject proposal.");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    react_toastify_1.toast.error("Error rejecting proposal.");
                    console.error("Error rejecting proposal:", error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gray-900 text-gray-300 p-4" },
        react_1["default"].createElement("div", { className: "max-w-5xl mx-auto" },
            react_1["default"].createElement("h1", { className: "text-3xl font-bold text-green-500 mb-6" }, "Notifications"),
            react_1["default"].createElement("div", { className: "space-y-4" }, proposals.map(function (proposal) { return (react_1["default"].createElement("div", { key: proposal.id, className: "bg-gray-800 rounded-lg p-4 shadow-md" },
                react_1["default"].createElement("h2", { className: "text-lg font-semibold text-white mb-2" }, proposal.projectTitle),
                react_1["default"].createElement("p", { className: "text-gray-400" },
                    "From: ",
                    proposal.studentName),
                react_1["default"].createElement("p", { className: "text-gray-300 mb-2" }, proposal.proposal),
                react_1["default"].createElement("p", { className: "text-gray-400" },
                    "Status: ",
                    proposal.status),
                react_1["default"].createElement("button", { className: "mt-4 text-gray-900 bg-green-400 rounded py-2 px-4 hover:bg-green-500 transition duration-200", onClick: function () { return handleSeeDetails(proposal); } }, "See Details"))); }))),
        showModal && selectedProposal && (react_1["default"].createElement(PropossalDetails_1["default"], { proposal: selectedProposal, onAccept: function () { return handleAcceptProposal(selectedProposal.id); }, onReject: function () { return handleRejectProposal(selectedProposal.id); }, onClose: function () { return setShowModal(false); } })),
        react_1["default"].createElement(react_toastify_1.ToastContainer, { position: "top-right", autoClose: 3000, hideProgressBar: true })));
};
exports["default"] = NotificationsPage;
