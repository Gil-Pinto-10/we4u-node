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
let MedicalConditionController = class MedicalConditionController {
    constructor(medicalConditionServiceInstance) {
        this.medicalConditionServiceInstance = medicalConditionServiceInstance;
    }
    async findBycode(req, res, next) {
        try {
            return this.medicalConditionServiceInstance.findByCode(req.params.code).then(medicalCondition => {
                return res.json(medicalCondition).status(200);
            });
        }
        catch (e) {
            return e;
        }
    }
    findAll(req, res, next) {
        try {
            return this.medicalConditionServiceInstance.findAll().then(medicalConditions => {
                return res.json(medicalConditions).status(200);
            });
        }
        catch (e) {
            return e;
        }
    }
    async createMedicalCondition(req, res, next) {
        try {
            const medicalConditionOrError = await this.medicalConditionServiceInstance.createMedicalCondition(req.body);
            if (medicalConditionOrError.isFailure) {
                return res.status(402).send();
            }
            const medicalConditionDTO = medicalConditionOrError.getValue();
            return res.json(medicalConditionDTO).status(201);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    async getAllMedicalConditions(req, res, next) {
        try {
            const result = await this.medicalConditionServiceInstance.getAllMedicalConditions();
            if (result.isFailure) {
                return res.status(400).json(result.errorValue());
            }
            return res.status(200).json(result.getValue());
        }
        catch (error) {
            return next(error);
        }
    }
};
MedicalConditionController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.medicalCondition.name)),
    __metadata("design:paramtypes", [Object])
], MedicalConditionController);
exports.default = MedicalConditionController;
//# sourceMappingURL=medicalConditionController.js.map