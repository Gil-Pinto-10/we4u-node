"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymptomsSet = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
const symptomReference_1 = require("./symptomReference");
const symptomDescription_1 = require("../Symptom/symptomDescription");
class SymptomsSet extends ValueObject_1.ValueObject {
    get values() {
        return this.props.values;
    }
    constructor(props) {
        super(props);
    }
    static create(initialValues = []) {
        if (!Array.isArray(initialValues) || !initialValues.every((val) => val instanceof symptomDescription_1.SymptomDescription)) {
            return Result_1.Result.fail("Something wrong happened on the symptoms set.");
        }
        const symptomReferences = initialValues.map(val => symptomReference_1.SymptomReference.create(val).getValue());
        return Result_1.Result.ok(new SymptomsSet({ values: symptomReferences }));
    }
    addSymptom(symptomDescription) {
        if (!(symptomDescription instanceof symptomDescription_1.SymptomDescription)) {
            return Result_1.Result.fail("Invalid symptom description.");
        }
        const symptomReferenceResult = symptomReference_1.SymptomReference.create(symptomDescription);
        if (symptomReferenceResult.isFailure) {
            return Result_1.Result.fail(symptomReferenceResult.error);
        }
        this.props.values.push(symptomReferenceResult.getValue());
        return Result_1.Result.ok();
    }
}
exports.SymptomsSet = SymptomsSet;
//# sourceMappingURL=symptomsSet.js.map