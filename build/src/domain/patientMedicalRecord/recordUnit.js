"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordUnit = void 0;
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
const ValueObject_1 = require("../../core/domain/ValueObject");
class RecordUnit extends ValueObject_1.ValueObject {
    get code() {
        return this.props.code;
    }
    get designation() {
        return this.props.designation;
    }
    get description() {
        return this.props.description;
    }
    constructor(props) {
        super(props);
    }
    static create(props) {
        const guardedProps = [
            { argument: props.code, argumentName: 'code' },
            { argument: props.description, argumentName: 'description' },
            { argument: props.designation, argumentName: 'designation' }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            const recordUnit = new RecordUnit(Object.assign({}, props));
            return Result_1.Result.ok(recordUnit);
        }
    }
}
exports.RecordUnit = RecordUnit;
//# sourceMappingURL=recordUnit.js.map