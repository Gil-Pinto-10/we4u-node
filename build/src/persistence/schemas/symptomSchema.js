"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SymptomSchema = new mongoose_1.default.Schema({
    description: { type: String, unique: true, required: true },
});
exports.default = mongoose_1.default.model('Symptom', SymptomSchema);
//# sourceMappingURL=symptomSchema.js.map