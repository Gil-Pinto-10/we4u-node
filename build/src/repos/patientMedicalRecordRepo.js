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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const typedi_1 = require("typedi");
const PatientMedicalRecordMapper_1 = require("../mappers/PatientMedicalRecordMapper");
let PatientMedicalRecordRepo = class PatientMedicalRecordRepo {
    constructor(patientMedicalRecordSchema) {
        this.patientMedicalRecordSchema = patientMedicalRecordSchema;
    }
    async save(patientMedicalRecord) {
        const query = { patientMedicalRecordNumber: patientMedicalRecord.patientId };
        const patientMedicalRecordDocument = await this.patientMedicalRecordSchema.findOne(query);
        try {
            if (patientMedicalRecordDocument === null) {
                const rawMedicalCondition = PatientMedicalRecordMapper_1.PatientMedicalRecordMapper.toPersistence(patientMedicalRecord);
                const medicalConditionCreated = await this.patientMedicalRecordSchema.create(rawMedicalCondition);
                const patientMedicalRecordNew = PatientMedicalRecordMapper_1.PatientMedicalRecordMapper.toDomain(medicalConditionCreated);
                if (patientMedicalRecordNew == null) {
                    throw new Error('Failed to map patient medical record to domain');
                }
                return patientMedicalRecordNew;
            }
            else {
                patientMedicalRecordDocument.patientMedicalRecordNumber = patientMedicalRecord.patientId;
                patientMedicalRecordDocument.records = patientMedicalRecord.records.values.map(recordLine => {
                    return {
                        recordReference: {
                            code: recordLine.recordReference.code,
                            description: recordLine.recordReference.description,
                            designation: recordLine.recordReference.designation
                        },
                        recordType: recordLine.recordType
                    };
                });
                await patientMedicalRecordDocument.save();
                return patientMedicalRecord;
            }
        }
        catch (err) {
            console.error(`Error in save: ${err}`);
            throw err;
        }
    }
    async exists(t) {
        const idX = t.id;
        const query = { domainId: idX };
        const deviceDocument = await this.patientMedicalRecordSchema.findOne(query);
        return !!deviceDocument;
    }
    async findByMedicalRecordNumber(id) {
        try {
            console.log(`Procurando PatientMedicalRecord com o número: ${id}`);
            const query = { patientMedicalRecordNumber: id };
            const patientMedicalRecordDocument = await this.patientMedicalRecordSchema.findOne(query);
            if (patientMedicalRecordDocument) {
                console.log(`PatientMedicalRecord encontrado: ${JSON.stringify(patientMedicalRecordDocument)}`);
                const patientMedicalRecord = PatientMedicalRecordMapper_1.PatientMedicalRecordMapper.toDomain(patientMedicalRecordDocument);
                console.log(`PatientMedicalRecord mapeado para domínio: ${JSON.stringify(patientMedicalRecord)}`);
                return patientMedicalRecord;
            }
            else {
                console.log(`PatientMedicalRecord com o número ${id} não encontrado`);
                return null;
            }
        }
        catch (error) {
            console.error(`Erro ao procurar PatientMedicalRecord com o número ${id}: ${error}`);
            throw error;
        }
    }
    async findUnaddedAllergies(all, medicalRecord) {
        const addedAllergies = [];
        medicalRecord.records.values.forEach(recordLine => {
            if (recordLine.recordType === 'ALLERGIE') {
                addedAllergies.push(recordLine.recordReference);
            }
        });
        const unaddedAllergies = all.filter(allergie => !addedAllergies.some(addedAllergie => addedAllergie.code === allergie.code));
        return unaddedAllergies;
    }
    async findUnaddedMedicalConditions(all, medicalRecord) {
        const addedMedicalConditions = [];
        medicalRecord.records.values.forEach(recordLine => {
            if (recordLine.recordType === 'MEDICAL_CONDITION') {
                addedMedicalConditions.push({
                    code: recordLine.recordReference.code,
                    designation: recordLine.recordReference.designation,
                    description: recordLine.recordReference.description,
                    symptoms: [] // Add appropriate symptoms here if available
                });
            }
        });
        const unaddedMedicalConditions = all.filter(medicalCondition => !addedMedicalConditions.some(addedMedicalCondition => addedMedicalCondition.code === medicalCondition.code));
        return unaddedMedicalConditions;
    }
};
PatientMedicalRecordRepo = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('patientMedicalRecordSchema')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], PatientMedicalRecordRepo);
exports.default = PatientMedicalRecordRepo;
//# sourceMappingURL=patientMedicalRecordRepo.js.map