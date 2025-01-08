"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalConditionMapper = void 0;
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const Mapper_1 = require("../core/infra/Mapper");
const medicalCondition_1 = require("../domain/medicalCondition/medicalCondition");
const symptomDescription_1 = require("../domain/Symptom/symptomDescription");
const symptomsSet_1 = require("../domain/medicalCondition/symptomsSet");
const medicalConditionCode_1 = require("../domain/medicalCondition/medicalConditionCode");
const medicalConditionDesignation_1 = require("../domain/medicalCondition/medicalConditionDesignation");
const medicalConditionDescription_1 = require("../domain/medicalCondition/medicalConditionDescription");
class MedicalConditionMapper extends Mapper_1.Mapper {
    static toDTO(medicalCondition) {
        var _a;
        return {
            code: medicalCondition.code.value,
            designation: medicalCondition.designation.value,
            description: (_a = medicalCondition.description) === null || _a === void 0 ? void 0 : _a.value,
            symptoms: medicalCondition.symptoms.values.map(symptom => symptom.value)
        };
    }
    static async toDomain(medicalCondition) {
        const code = medicalConditionCode_1.MedicalConditionCode.create(medicalCondition.code).getValue();
        const designation = medicalConditionDesignation_1.MedicalConditionDesignation.create(medicalCondition.designation).getValue();
        const description = medicalCondition.description
            ? medicalConditionDescription_1.MedicalConditionDescription.create(medicalCondition.description).getValue()
            : undefined;
        const symptomsSetResult = symptomsSet_1.SymptomsSet.create(medicalCondition.symptoms.map((symptom) => new symptomDescription_1.SymptomDescription({ value: symptom })));
        if (symptomsSetResult.isFailure) {
            console.log(symptomsSetResult.error);
            return null;
        }
        const medicalConditionOrError = medicalCondition_1.MedicalCondition.create({
            code,
            designation,
            description,
            symptoms: symptomsSetResult.getValue()
        }, new UniqueEntityID_1.UniqueEntityID(medicalCondition.domainId));
        return medicalConditionOrError.isSuccess ? medicalConditionOrError.getValue() : null;
    }
    static toPersistence(medicalCondition) {
        var _a;
        return {
            domainId: medicalCondition.id.toString(),
            code: medicalCondition.code.value,
            designation: medicalCondition.designation.value,
            description: (_a = medicalCondition.description) === null || _a === void 0 ? void 0 : _a.value,
            symptoms: medicalCondition.symptoms.values.map(symptom => symptom.value)
        };
    }
}
exports.MedicalConditionMapper = MedicalConditionMapper;
//# sourceMappingURL=MedicalConditionMapper.js.map