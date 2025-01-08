"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalConditionDesignation = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
class MedicalConditionDesignation extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(name) {
        if (name.length > 100)
            return Result_1.Result.fail('Medical Condition designation must be 100 characters or less');
        return Result_1.Result.ok(new MedicalConditionDesignation({ value: name }));
    }
}
exports.MedicalConditionDesignation = MedicalConditionDesignation;
//# sourceMappingURL=medicalConditionDesignation.js.map