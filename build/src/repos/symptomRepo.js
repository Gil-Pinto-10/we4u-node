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
const SymptomMapper_1 = require("../mappers/SymptomMapper");
let SymptomRepo = class SymptomRepo {
    constructor(symptomSchema) {
        this.symptomSchema = symptomSchema;
    }
    async save(symptom) {
        const query = { domainId: symptom.id.toString() };
        const symptomDocument = await this.symptomSchema.findOne(query);
        try {
            if (symptomDocument === null) {
                const rawSymptom = SymptomMapper_1.SymptomMapper.toPersistence(symptom);
                const symptomCreated = await this.symptomSchema.create(rawSymptom);
                const symptomNew = SymptomMapper_1.SymptomMapper.toDomain(symptomCreated);
                if (symptomNew == null) {
                    throw new Error('Failed to map symptom to domain');
                }
                return symptomNew;
            }
            else {
                symptomDocument.description = symptom.description.value;
                await symptomDocument.save();
                return symptom;
            }
        }
        catch (err) {
            throw err;
        }
    }
    async getAllSymptoms() {
        const symptomDocuments = await this.symptomSchema.find();
        const symptoms = symptomDocuments.map(doc => {
            return SymptomMapper_1.SymptomMapper.toDomain(doc);
        });
        return symptoms;
    }
    async exists(t) {
        const idX = t.id;
        const query = { domainId: idX };
        const deviceDocument = await this.symptomSchema.findOne(query);
        return !!deviceDocument;
    }
};
SymptomRepo = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('symptomSchema')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], SymptomRepo);
exports.default = SymptomRepo;
//# sourceMappingURL=symptomRepo.js.map