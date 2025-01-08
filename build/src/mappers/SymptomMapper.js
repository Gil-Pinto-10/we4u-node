"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymptomMapper = void 0;
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const Mapper_1 = require("../core/infra/Mapper");
const symptom_1 = require("../domain/Symptom/symptom");
class SymptomMapper extends Mapper_1.Mapper {
    static toDTO(symptom) {
        return {
            description: symptom.description.toString()
        };
    }
    static toDomain(raw) {
        const symptomOrError = symptom_1.Symptom.create({
            description: raw.description
        }, new UniqueEntityID_1.UniqueEntityID(raw._id));
        if (symptomOrError.isFailure) {
            console.error(symptomOrError.error);
            throw new Error(symptomOrError.error.toString());
        }
        return symptomOrError.getValue();
    }
    static toPersistence(symptom) {
        return {
            domainId: symptom.id.toString(),
            description: symptom.description.value.toString()
        };
    }
}
exports.SymptomMapper = SymptomMapper;
//# sourceMappingURL=SymptomMapper.js.map