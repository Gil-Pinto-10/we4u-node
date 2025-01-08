"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PatientMedicalRecordSchema = new mongoose_1.default.Schema({
    domainId: { type: String, required: true, unique: true },
    patientMedicalRecordNumber: { type: String, required: true, unique: true },
    records: [
        {
            recordReference: {
                code: { type: String, required: true },
                description: { type: String, required: false },
                designation: { type: String, required: true }
            },
            recordType: { type: String, required: true }
        }
    ]
});
exports.default = mongoose_1.default.model('PatientMedicalRecord', PatientMedicalRecordSchema);
//# sourceMappingURL=patientMedicalRecordSchema.js.map