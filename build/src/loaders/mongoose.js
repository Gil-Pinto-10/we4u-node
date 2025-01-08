"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
async function getDatabaseClient() {
    return new Promise((resolve, reject) => {
        mongoose_1.default.set('strictQuery', false);
        mongoose_1.default.connect(config_1.default.databaseURL);
        const db = mongoose_1.default.connection;
        db.on('error', err => {
            logger_1.default.error(err);
            reject(err);
        });
        db.once('open', () => {
            logger_1.default.info('✌️ DB loaded and connected!');
            resolve(mongoose_1.default);
        });
    });
}
exports.default = getDatabaseClient;
//# sourceMappingURL=mongoose.js.map