"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymptomDescription = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
class SymptomDescription extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(description) {
        if (description.length > 2048)
            return Result_1.Result.fail('Symptom description must be 2048 characters or less');
        return Result_1.Result.ok(new SymptomDescription({ value: description }));
    }
}
exports.SymptomDescription = SymptomDescription;
//# sourceMappingURL=symptomDescription.js.map