"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const typedi_1 = require("typedi");
let PatientMedicalRecordController = class PatientMedicalRecordController {
    constructor(patientMedicalRecordServiceInstance) {
        this.patientMedicalRecordServiceInstance = patientMedicalRecordServiceInstance;
    }
    async createPatientMedicalRecord(req, res, next) {
        try {
            const pmrOrError = await this.patientMedicalRecordServiceInstance.createPatientMedicalRecord(req.body);
            if (pmrOrError.isFailure) {
                return res.status(400).json({ error: pmrOrError.errorValue() });
            }
            const pmrDTO = pmrOrError.getValue();
            return res.json(pmrDTO).status(201);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    async addRecord(req, res, next) {
        try {
            const { patientMedicalRecordNumber, code, recordType } = req.body;
            const result = await this.patientMedicalRecordServiceInstance.addRecord(patientMedicalRecordNumber, code, recordType);
            if (result.isFailure) {
                return res.status(400).json({ error: result.errorValue() });
            }
            return res.status(200).send(result.getValue());
        }
        catch (error) {
            return next(error);
        }
    }
    async findByMedicalRecordNumber(req, res, next) {
        try {
            const { patientMedicalRecordNumber } = req.params;
            const result = await this.patientMedicalRecordServiceInstance.findByMedicalRecordNumber(patientMedicalRecordNumber);
            if (result.isFailure) {
                return res.status(400).json({ error: result.errorValue() });
            }
            return res.status(200).send(result.getValue());
        }
        catch (error) {
            return next(error);
        }
    }
    async findUnaddedAllergies(req, res, next) {
        try {
            const { patientMedicalRecordNumber } = req.params;
            const result = await this.patientMedicalRecordServiceInstance.findUnaddedAllergies(patientMedicalRecordNumber);
            return res.status(200).send(result);
        }
        catch (error) {
            return next(error);
        }
    }
    async findUnaddedMedicalConditions(req, res, next) {
        try {
            const { patientMedicalRecordNumber } = req.params;
            const result = await this.patientMedicalRecordServiceInstance.findUnaddedMedicalConditions(patientMedicalRecordNumber);
            return res.status(200).send(result);
        }
        catch (error) {
            return next(error);
        }
    }
};
PatientMedicalRecordController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.patientMedicalRecord.name)),
    __metadata("design:paramtypes", [Object])
], PatientMedicalRecordController);
exports.default = PatientMedicalRecordController;
//# sourceMappingURL=patientMedicalRecordController.js.map