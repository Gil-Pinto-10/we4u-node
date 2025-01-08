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
const allergie_1 = require("../domain/allergie/allergie");
const AllergieMapper_1 = require("../mappers/AllergieMapper");
const allergieCode_1 = require("../domain/allergie/allergieCode");
const allergieDesignation_1 = require("../domain/allergie/allergieDesignation");
const allergieDescription_1 = require("../domain/allergie/allergieDescription");
let AllergieService = class AllergieService {
    constructor(allergieRepo) {
        this.allergieRepo = allergieRepo;
    }
    async findByCode(code) {
        try {
            const allergie = await this.allergieRepo.findByCode(code);
            return allergie;
        }
        catch (error) {
            console.error('Error while fetching allergie by code:', error);
            throw error;
        }
    }
    async createAllergie(AllergieDTO) {
        try {
            const allergieCodeOrError = allergieCode_1.AllergieCode.create(AllergieDTO.code);
            if (allergieCodeOrError.isFailure)
                return Result_1.Result.fail(allergieCodeOrError.errorValue());
            const code = allergieCodeOrError.getValue();
            // DO THIS!!!!
            // const allergieCheckUnique = await this.allergieRepo.findByID();
            const allergieDesignationOrError = allergieDesignation_1.AllergieDesignation.create(AllergieDTO.designation);
            if (allergieDesignationOrError.isFailure)
                return Result_1.Result.fail(allergieDesignationOrError.errorValue());
            const designation = allergieDesignationOrError.getValue();
            const allergieDescriptionOrError = allergieDescription_1.AllergieDescription.create(AllergieDTO.description);
            if (allergieDescriptionOrError.isFailure)
                return Result_1.Result.fail(allergieDescriptionOrError.errorValue());
            const description = allergieDescriptionOrError.getValue();
            const allergieOrError = allergie_1.Allergie.create({
                code,
                designation,
                description
            });
            if (allergieOrError.isFailure) {
                return Result_1.Result.fail(allergieOrError.errorValue());
            }
            const allergieResult = allergieOrError.getValue();
            await this.allergieRepo.save(allergieResult);
            const allergieDTOResult = AllergieMapper_1.AllergieMapper.toDTO(allergieResult);
            return Result_1.Result.ok(allergieDTOResult);
        }
        catch (e) {
            throw e;
        }
    }
    async findAll() {
        try {
            const allergieOrError = await this.allergieRepo.findAll();
            return allergieOrError;
        }
        catch (error) {
            // Handle any errors, log them, and return a Result indicating failure
            console.error('Error while fetching allergies:', error);
            throw error;
        }
    }
    async getAllAllergies() {
        try {
            const allergies = await this.allergieRepo.getAllAllergies();
            const allergiesDTOs = allergies.map(allergie => AllergieMapper_1.AllergieMapper.toDTO(allergie));
            return Result_1.Result.ok(allergiesDTOs);
        }
        catch (error) {
            return Result_1.Result.fail(error);
        }
    }
};
AllergieService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.repos.allergie.name)),
    __metadata("design:paramtypes", [Object])
], AllergieService);
exports.default = AllergieService;
//# sourceMappingURL=allergieService.js.map