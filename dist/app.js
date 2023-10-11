"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const Sentry = __importStar(require("@sentry/node"));
const profiling_node_1 = require("@sentry/profiling-node");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path = __importStar(require("path"));
const errorHandler_1 = require("./middlewares/errorHandler");
// Routes
const index_1 = require("./routes/index");
// Create Express server
exports.app = (0, express_1.default)();
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app: exports.app }),
        new profiling_node_1.ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
});
// The request handler must be the first middleware on the app
exports.app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
exports.app.use(Sentry.Handlers.tracingHandler());
// Express configuration
exports.app.set("port", process.env.PORT || 3000);
exports.app.set("views", path.join(__dirname, "../views"));
exports.app.set("view engine", "pug");
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use(express_1.default.static(path.join(__dirname, "../public")));
exports.app.use("/", index_1.index);
exports.app.use(Sentry.Handlers.errorHandler());
exports.app.use(errorHandler_1.errorNotFoundHandler);
exports.app.use(errorHandler_1.errorHandler);
//# sourceMappingURL=app.js.map