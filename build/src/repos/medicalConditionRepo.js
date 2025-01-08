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
const MedicalConditionMapper_1 = require("../mappers/MedicalConditionMapper");
let MedicalConditionRepo = class MedicalConditionRepo {
    constructor(medicalConditionSchema) {
        this.medicalConditionSchema = medicalConditionSchema;
    }
    async findAll() {
        try {
            const medicalConditionRecords = await this.medicalConditionSchema.find();
            const medicalConditionPromises = medicalConditionRecords.map(record => MedicalConditionMapper_1.MedicalConditionMapper.toDomain(record));
            return Promise.all(medicalConditionPromises);
        }
        catch (e) {
            throw e;
        }
    }
    async save(medicalCondition) {
        var _a;
        const query = { domainId: medicalCondition.id.toString() };
        const medicalConditionDocument = await this.medicalConditionSchema.findOne(query);
        try {
            if (medicalConditionDocument === null) {
                const rawMedicalCondition = MedicalConditionMapper_1.MedicalConditionMapper.toPersistence(medicalCondition);
                const medicalConditionCreated = await this.medicalConditionSchema.create(rawMedicalCondition);
                const medicalConditionNew = MedicalConditionMapper_1.MedicalConditionMapper.toDomain(medicalConditionCreated);
                if (medicalConditionNew == null) {
                    throw new Error('Failed to map medical condition to domain');
                }
                return medicalConditionNew;
            }
            else {
                medicalConditionDocument.description = (_a = medicalCondition.description) === null || _a === void 0 ? void 0 : _a.value;
                medicalConditionDocument.code = medicalCondition.code.value;
                medicalConditionDocument.designation = medicalCondition.designation.value;
                medicalConditionDocument.symptoms = medicalCondition.symptoms.values.map(symptom => symptom.value);
                await medicalConditionDocument.save();
                return medicalCondition;
            }
        }
        catch (err) {
            throw err;
        }
    }
    async getAllMedicalConditions() {
        const medicalConditionDocuments = await this.medicalConditionSchema.find();
        const medicalConditions = await Promise.all(medicalConditionDocuments.map(doc => MedicalConditionMapper_1.MedicalConditionMapper.toDomain(doc)));
        return medicalConditions;
    }
    async exists(t) {
        const idX = t.id;
        const query = { domainId: idX };
        const deviceDocument = await this.medicalConditionSchema.findOne(query);
        return !!deviceDocument;
    }
    async findByCode(code) {
        const query = { code };
        const medicalConditionDocument = await this.medicalConditionSchema.findOne(query);
        if (medicalConditionDocument) {
            return MedicalConditionMapper_1.MedicalConditionMapper.toDomain(medicalConditionDocument);
        }
        else {
            return null;
        }
    }
};
MedicalConditionRepo = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('medicalConditionSchema')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], MedicalConditionRepo);
exports.default = MedicalConditionRepo;
//# sourceMappingURL=medicalConditionRepo.js.map