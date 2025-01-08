"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalConditionCode = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
class MedicalConditionCode extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(id) {
        if (![8, 9, 11].includes(id.length)) {
            return Result_1.Result.fail('Medical Condition code must be 8, 9, or 11 characters to follow SNOMED CT');
        }
        if (!/^[a-zA-Z0-9]+$/.test(id)) {
            return Result_1.Result.fail('Medical Condition code must be alphanumeric');
        }
        return Result_1.Result.ok(new MedicalConditionCode({ value: id }));
    }
}
exports.MedicalConditionCode = MedicalConditionCode;
//# sourceMappingURL=medicalConditionCode.js.map