"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MedicalConditionSchema = new mongoose_1.default.Schema({
    domainId: { type: String, unique: true, required: true },
    code: { type: String, required: true, unique: true },
    designation: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    symptoms: [{ type: String, required: true }]
});
exports.default = mongoose_1.default.model('MedicalCondition', MedicalConditionSchema);
//# sourceMappingURL=medicalConditionSchema.js.map