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
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../config"));
const Result_1 = require("../core/logic/Result");
const medicalCondition_1 = require("../domain/medicalCondition/medicalCondition");
const MedicalConditionMapper_1 = require("../mappers/MedicalConditionMapper");
const medicalConditionCode_1 = require("../domain/medicalCondition/medicalConditionCode");
const medicalConditionDesignation_1 = require("../domain/medicalCondition/medicalConditionDesignation");
const medicalConditionDescription_1 = require("../domain/medicalCondition/medicalConditionDescription");
const symptomsSet_1 = require("../domain/medicalCondition/symptomsSet");
const symptomDescription_1 = require("../domain/Symptom/symptomDescription");
let MedicalConditionService = class MedicalConditionService {
    constructor(medicalConditionRepo) {
        this.medicalConditionRepo = medicalConditionRepo;
    }
    findByCode(code) {
        try {
            return this.medicalConditionRepo.findByCode(code).then((medicalCondition) => {
                if (!medicalCondition)
                    return null;
                return MedicalConditionMapper_1.MedicalConditionMapper.toDTO(medicalCondition);
            });
        }
        catch (e) {
            throw e;
        }
    }
    async findAll() {
        try {
            const medicalConditions = await this.medicalConditionRepo.findAll();
            return medicalConditions.map(medicalCondition => MedicalConditionMapper_1.MedicalConditionMapper.toDTO(medicalCondition));
        }
        catch (e) {
            throw e;
        }
    }
    async createMedicalCondition(medicalConditionDTO) {
        try {
            const codeOrError = medicalConditionCode_1.MedicalConditionCode.create(medicalConditionDTO.code);
            if (codeOrError.isFailure) {
                return Result_1.Result.fail(codeOrError.errorValue());
            }
            const code = codeOrError.getValue();
            const designationOrError = medicalConditionDesignation_1.MedicalConditionDesignation.create(medicalConditionDTO.designation);
            if (designationOrError.isFailure) {
                return Result_1.Result.fail(designationOrError.errorValue());
            }
            const designation = designationOrError.getValue();
            const descriptionOrError = medicalConditionDescription_1.MedicalConditionDescription.create(medicalConditionDTO.description);
            if (descriptionOrError.isFailure) {
                return Result_1.Result.fail(descriptionOrError.errorValue());
            }
            const description = descriptionOrError.getValue();
            const symptomsSetResult = symptomsSet_1.SymptomsSet.create(medicalConditionDTO.symptoms.map(symptom => new symptomDescription_1.SymptomDescription({ value: symptom })));
            if (symptomsSetResult.isFailure) {
                return Result_1.Result.fail(symptomsSetResult.errorValue());
            }
            const symptoms = symptomsSetResult.getValue();
            const medicalConditionOrError = medicalCondition_1.MedicalCondition.create({
                code,
                designation,
                description,
                symptoms
            });
            if (medicalConditionOrError.isFailure) {
                return Result_1.Result.fail(medicalConditionOrError.errorValue());
            }
            const medicalCondition = medicalConditionOrError.getValue();
            await this.medicalConditionRepo.save(medicalCondition);
            const medicalConditionDTOResult = MedicalConditionMapper_1.MedicalConditionMapper.toDTO(medicalCondition);
            return Result_1.Result.ok(medicalConditionDTOResult);
        }
        catch (e) {
            throw e;
        }
    }
    async getAllMedicalConditions() {
        try {
            const medicalConditions = await this.medicalConditionRepo.getAllMedicalConditions();
            const medicalConditionDTOs = medicalConditions.map(mc => MedicalConditionMapper_1.MedicalConditionMapper.toDTO(mc));
            return Result_1.Result.ok(medicalConditionDTOs);
        }
        catch (error) {
            return Result_1.Result.fail(error);
        }
    }
};
MedicalConditionService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.repos.medicalCondition.name)),
    __metadata("design:paramtypes", [Object])
], MedicalConditionService);
exports.default = MedicalConditionService;
//# sourceMappingURL=medicalConditionService.js.map