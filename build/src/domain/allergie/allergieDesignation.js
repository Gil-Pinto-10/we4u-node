"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllergieDesignation = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
class AllergieDesignation extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(name) {
        if (name.length > 100)
            return Result_1.Result.fail('Allergie designation must be 20 characters or less');
        return Result_1.Result.ok(new AllergieDesignation({ value: name }));
    }
}
exports.AllergieDesignation = AllergieDesignation;
//# sourceMappingURL=allergieDesignation.js.map