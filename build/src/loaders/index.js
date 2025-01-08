"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const dependencyInjector_1 = __importDefault(require("./dependencyInjector"));
const express_1 = __importDefault(require("./express"));
const logger_1 = __importDefault(require("./logger"));
const mongoose_1 = __importDefault(require("./mongoose"));
exports.default = async ({ expressApp }) => {
    const mongoConnection = await (0, mongoose_1.default)();
    logger_1.default.info('✌️ DB loaded and connected!');
    const allergieSchema = {
        // compare with the approach followed in repos and services
        name: 'allergieSchema',
        schema: '../persistence/schemas/allergieSchema',
    };
    const symptomSchema = {
        name: 'symptomSchema',
        schema: '../persistence/schemas/symptomSchema',
    };
    const medicalConditionSchema = {
        name: 'medicalConditionSchema',
        schema: '../persistence/schemas/medicalConditionSchema',
    };
    const patientMedicalRecordSchema = {
        name: 'patientMedicalRecordSchema',
        schema: '../persistence/schemas/patientMedicalRecordSchema',
    };
    const allergieController = {
        name: config_1.default.controllers.allergie.name,
        path: config_1.default.controllers.allergie.path
    };
    const symptomController = {
        name: config_1.default.controllers.symptom.name,
        path: config_1.default.controllers.symptom.path
    };
    const medicalConditionController = {
        name: config_1.default.controllers.medicalCondition.name,
        path: config_1.default.controllers.medicalCondition.path
    };
    const patientMedicalRecordController = {
        name: config_1.default.controllers.patientMedicalRecord.name,
        path: config_1.default.controllers.patientMedicalRecord.path
    };
    const allergieService = {
        name: config_1.default.services.allergie.name,
        path: config_1.default.services.allergie.path
    };
    const symptomService = {
        name: config_1.default.services.symptom.name,
        path: config_1.default.services.symptom.path
    };
    const medicalConditionService = {
        name: config_1.default.services.medicalCondition.name,
        path: config_1.default.services.medicalCondition.path
    };
    const patientMedicalRecordService = {
        name: config_1.default.services.patientMedicalRecord.name,
        path: config_1.default.services.patientMedicalRecord.path
    };
    const allergieRepo = {
        name: config_1.default.repos.allergie.name,
        path: config_1.default.repos.allergie.path
    };
    const symptomRepo = {
        name: config_1.default.repos.symptom.name,
        path: config_1.default.repos.symptom.path
    };
    const medicalConditionRepo = {
        name: config_1.default.repos.medicalCondition.name,
        path: config_1.default.repos.medicalCondition.path
    };
    const patientMedicalRecordRepo = {
        name: config_1.default.repos.patientMedicalRecord.name,
        path: config_1.default.repos.patientMedicalRecord.path
    };
    await (0, dependencyInjector_1.default)({
        mongoConnection,
        schemas: [
            allergieSchema,
            symptomSchema,
            medicalConditionSchema,
            patientMedicalRecordSchema
        ],
        controllers: [
            allergieController,
            symptomController,
            medicalConditionController,
            patientMedicalRecordController
        ],
        repos: [
            allergieRepo,
            symptomRepo,
            medicalConditionRepo,
            patientMedicalRecordRepo
        ],
        services: [
            allergieService,
            symptomService,
            medicalConditionService,
            patientMedicalRecordService
        ]
    });
    logger_1.default.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');
    await (0, express_1.default)({ app: expressApp });
    logger_1.default.info('✌️ Express loaded');
};
//# sourceMappingURL=index.js.map