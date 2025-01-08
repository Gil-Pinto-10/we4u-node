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
const AllergieMapper_1 = require("../mappers/AllergieMapper");
const allergieSchema_1 = __importDefault(require("../persistence/schemas/allergieSchema"));
const mongoose_1 = require("mongoose");
const typedi_1 = require("typedi");
let AllergieRepo = class AllergieRepo {
    constructor(allergieSchema) {
        this.allergieSchema = allergieSchema;
    }
    async findAll() {
        try {
            const allergieRecords = await this.allergieSchema.find();
            const allergiePromises = allergieRecords.map(record => AllergieMapper_1.AllergieMapper.toDomain(record));
            return Promise.all(allergiePromises);
        }
        catch (e) {
            throw e;
        }
    }
    async getAllAllergies() {
        const allergieDocuments = await this.allergieSchema.find();
        const allergies = await Promise.all(allergieDocuments.map(doc => AllergieMapper_1.AllergieMapper.toDomain(doc)));
        return allergies;
    }
    async findByCode(code) {
        const query = { code };
        const allergieDocument = await this.allergieSchema.findOne(query);
        if (allergieDocument) {
            return AllergieMapper_1.AllergieMapper.toDomain(allergieDocument);
        }
        else {
            return null;
        }
    }
    async save(allergie) {
        var _a;
        const query = { domainId: allergie.id.toString() };
        const allergieDocument = await this.allergieSchema.findOne(query);
        try {
            if (allergieDocument === null) {
                const rawAllergie = AllergieMapper_1.AllergieMapper.toPersistence(allergie);
                const roleCreated = await this.allergieSchema.create(rawAllergie);
                const allergieNew = AllergieMapper_1.AllergieMapper.toDomain(roleCreated);
                if (allergieNew == null) {
                    throw new Error('Failed to map allergie to domain');
                }
                return allergieNew;
            }
            else {
                allergieDocument.description = (_a = allergie.description) === null || _a === void 0 ? void 0 : _a.value;
                allergieDocument.code = allergie.code.value;
                allergieDocument.designation = allergie.designation.value;
                await allergieDocument.save();
                return allergie;
            }
        }
        catch (err) {
            throw err;
        }
    }
    async exists(t) {
        const idX = t.id;
        const query = { domainId: idX };
        const deviceDocument = await allergieSchema_1.default.findOne(query);
        return !!deviceDocument;
    }
};
AllergieRepo = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('allergieSchema')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], AllergieRepo);
exports.default = AllergieRepo;
//# sourceMappingURL=allergieRepo.js.map