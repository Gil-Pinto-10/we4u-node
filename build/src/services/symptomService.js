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
const symptom_1 = require("../domain/Symptom/symptom");
const SymptomMapper_1 = require("../mappers/SymptomMapper");
const symptomDescription_1 = require("../domain/Symptom/symptomDescription");
let SymptomService = class SymptomService {
    constructor(symptomRepo) {
        this.symptomRepo = symptomRepo;
    }
    async createSymptom(SymptomDTO) {
        try {
            const symptomDescriptionOrError = symptomDescription_1.SymptomDescription.create(SymptomDTO.description);
            if (symptomDescriptionOrError.isFailure)
                return Result_1.Result.fail(symptomDescriptionOrError.errorValue());
            const description = symptomDescriptionOrError.getValue();
            const symptomOrError = symptom_1.Symptom.create({
                description
            });
            if (symptomOrError.isFailure) {
                return Result_1.Result.fail(symptomOrError.errorValue());
            }
            const symptomResult = symptomOrError.getValue();
            await this.symptomRepo.save(symptomResult);
            const symptomDTOResult = SymptomMapper_1.SymptomMapper.toDTO(symptomResult);
            return Result_1.Result.ok(symptomDTOResult);
        }
        catch (e) {
            throw e;
        }
    }
    async getAllSymptoms() {
        try {
            const symptoms = await this.symptomRepo.getAllSymptoms();
            const symptomDTOs = symptoms.map(symptom => {
                try {
                    return SymptomMapper_1.SymptomMapper.toDTO(symptom);
                }
                catch (error) {
                    throw error;
                }
            });
            return Result_1.Result.ok(symptomDTOs);
        }
        catch (error) {
            return Result_1.Result.fail(error);
        }
    }
};
SymptomService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.repos.symptom.name)),
    __metadata("design:paramtypes", [Object])
], SymptomService);
exports.default = SymptomService;
//# sourceMappingURL=symptomService.js.map