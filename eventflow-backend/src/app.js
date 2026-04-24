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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const user_model_1 = require("./models/user-model");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const redis_1 = require("./config/redis");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const socket_1 = require("./config/socket");
const errorHandler_1 = require("./middlewares/errorHandler");
const producer_1 = require("./kafka/producer");
const consumer_1 = require("./kafka/consumer");
const admin_1 = require("./kafka/admin");
const PORT = Number(process.env.PORT) || 5001;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // ✅ Redis (safe fallback)
        try {
            yield (0, redis_1.connectRedis)();
            console.log('Redis connected');
        }
        catch (err) {
            console.log('Redis not connected (skipping)');
        }
        // ✅ Database (must work)
        try {
            yield (0, user_model_1.initDB)();
            console.log('Database connected');
        }
        catch (err) {
            console.error('Database connection failed');
            process.exit(1); // stop app if DB fails
        }
        // ✅ Kafka (optional for deployment)
        try {
            yield (0, admin_1.createTopics)();
            yield (0, producer_1.connectProducer)();
            yield (0, consumer_1.startConsumer)();
            console.log('Kafka connected');
        }
        catch (err) {
            console.log('Kafka not connected (skipping)');
        }
        // ✅ Socket
        (0, socket_1.initSocket)(server);
        // ✅ Middlewares
        app.use(express_1.default.json());
        app.use((0, cors_1.default)({
            origin: true, // allow all for now (restrict later)
            credentials: true,
        }));
        // ✅ Health check route (IMPORTANT for Railway)
        app.get('/', (req, res) => {
            res.send('EventFlow API running 🚀');
        });
        // ✅ Swagger Docs
        app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
        // ✅ Routes
        app.use('/users', user_routes_1.default);
        app.use('/api/auth', auth_routes_1.default);
        app.use('/events', (0, rateLimiter_1.createRateLimiter)());
        app.use('/events', event_routes_1.default);
        // ✅ Error handlers (keep last)
        app.use(error_middleware_1.ErrorMiddleware);
        app.use(errorHandler_1.errorHandler);
        // ✅ Start server
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}
startServer();
