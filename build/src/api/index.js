"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const allergieRoute_1 = __importDefault(require("./routes/allergieRoute"));
const symptomRoute_1 = __importDefault(require("./routes/symptomRoute"));
const medicalConditionRoute_1 = __importDefault(require("./routes/medicalConditionRoute"));
const patientMedicalRecordRoute_1 = __importDefault(require("./routes/patientMedicalRecordRoute"));
exports.default = () => {
    const app = (0, express_1.Router)();
    (0, allergieRoute_1.default)(app);
    (0, symptomRoute_1.default)(app);
    (0, medicalConditionRoute_1.default)(app);
    (0, patientMedicalRecordRoute_1.default)(app);
    return app;
};
//# sourceMappingURL=index.js.map