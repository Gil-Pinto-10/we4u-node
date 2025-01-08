"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AllergieSchema = new mongoose_1.default.Schema({
    code: { type: String, unique: true, required: true },
    designation: { type: String, unique: true, required: true },
    description: { type: String, unique: false },
});
exports.default = mongoose_1.default.model('Allergie', AllergieSchema);
//# sourceMappingURL=allergieSchema.js.map