"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymptomReference = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
class SymptomReference extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(symp) {
        return Result_1.Result.ok(new SymptomReference({ value: symp.value }));
    }
}
exports.SymptomReference = SymptomReference;
//# sourceMappingURL=symptomReference.js.map