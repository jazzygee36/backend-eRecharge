"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const router_1 = __importDefault(require("./modules/userAuth/router"));
const route_1 = __importDefault(require("./modules/payment/route"));
const router_2 = __importDefault(require("./modules/utilities/router"));
const route_2 = __importDefault(require("./modules/profile/route"));
// import morgan from 'morgan';
const Port = process.env.PORT || 4000;
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
// app.use(morgan('dev'));
app.use(express_1.default.json()); // Parse JSON requests
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded requests
//Routers
app.use('/api', router_1.default);
app.use('/api', route_1.default);
app.use('/api', router_2.default);
app.use('/api', route_2.default);
// Database connection check
db_1.default.query('SELECT 1')
    .then(() => {
    console.log('Connected to DB');
    app.listen(Port, () => {
        console.log(`Server is running on port ${Port}`);
    });
})
    .catch((error) => {
    console.error('Failed to connect to the database:', error);
});
