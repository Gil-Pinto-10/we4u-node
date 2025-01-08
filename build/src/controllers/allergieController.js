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
let AllergieController = class AllergieController {
    constructor(allergieServiceInstance) {
        this.allergieServiceInstance = allergieServiceInstance;
    }
    async findBycode(req, res, next) {
        try {
            const code = req.params.code;
            const allergieOrError = await this.allergieServiceInstance.findByCode(code);
            if (allergieOrError.equals(null)) {
                return res.status(404).send();
            }
            const allergieDTO = allergieOrError;
            return res.json(allergieDTO).status(200);
        }
        catch (e) {
            return next(e);
        }
    }
    async createAllergie(req, res, next) {
        try {
            const allergieOrError = await this.allergieServiceInstance.createAllergie(req.body);
            if (allergieOrError.isFailure) {
                return res.status(402).send();
            }
            const allergieDTO = allergieOrError.getValue();
            return res.json(allergieDTO).status(201);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    async getAllergies(req, res, next) {
        try {
            const allergies = await this.allergieServiceInstance.findAll();
            // Mapear os dados para AllergyDTO
            const allergyDTOs = allergies.map((allergy) => ({
                code: allergy.props.code.props.value,
                designation: allergy.props.designation.props.value,
                description: allergy.props.description.props.value,
            }));
            res.status(200).json(allergyDTOs);
        }
        catch (error) {
            next(error);
        }
    }
    async getAllAllergies(req, res, next) {
        try {
            const result = await this.allergieServiceInstance.getAllAllergies();
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
AllergieController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.allergie.name)),
    __metadata("design:paramtypes", [Object])
], AllergieController);
exports.default = AllergieController;
//# sourceMappingURL=allergieController.js.map