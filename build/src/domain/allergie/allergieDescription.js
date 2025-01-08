"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllergieDescription = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
class AllergieDescription extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(description) {
        if (description.length > 2048)
            return Result_1.Result.fail('Allergie description must be 255 characters or less');
        return Result_1.Result.ok(new AllergieDescription({ value: description }));
    }
}
exports.AllergieDescription = AllergieDescription;
//# sourceMappingURL=allergieDescription.js.map