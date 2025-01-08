"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllergieMapper = void 0;
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const Mapper_1 = require("../core/infra/Mapper");
const allergie_1 = require("../domain/allergie/allergie");
const allergieCode_1 = require("../domain/allergie/allergieCode");
const allergieDescription_1 = require("../domain/allergie/allergieDescription");
const allergieDesignation_1 = require("../domain/allergie/allergieDesignation");
class AllergieMapper extends Mapper_1.Mapper {
    static toDTO(allergie) {
        var _a;
        return {
            code: allergie.code.value,
            designation: allergie.designation.value,
            description: (_a = allergie.description) === null || _a === void 0 ? void 0 : _a.value
        };
    }
    static async toDomain(allergie) {
        const code = allergieCode_1.AllergieCode.create(allergie.code).getValue();
        const designation = allergieDesignation_1.AllergieDesignation.create(allergie.designation).getValue();
        const description = allergie.description
            ? allergieDescription_1.AllergieDescription.create(allergie.description).getValue()
            : undefined;
        const allergieOrError = allergie_1.Allergie.create({
            code,
            designation,
            description
        }, new UniqueEntityID_1.UniqueEntityID(allergie.domainId));
        allergieOrError.isFailure ? console.log(allergieOrError.error) : '';
        return allergieOrError.isSuccess ? allergieOrError.getValue() : null;
    }
    static toPersistence(allergie) {
        var _a;
        return {
            domainId: allergie.id.toString(),
            code: allergie.code.value,
            designation: allergie.designation.value,
            description: (_a = allergie.description) === null || _a === void 0 ? void 0 : _a.value
        };
    }
}
exports.AllergieMapper = AllergieMapper;
//# sourceMappingURL=AllergieMapper.js.map