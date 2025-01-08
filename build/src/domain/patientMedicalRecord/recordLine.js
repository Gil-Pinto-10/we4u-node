"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordLine = void 0;
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
const ValueObject_1 = require("../../core/domain/ValueObject");
class RecordLine extends ValueObject_1.ValueObject {
    get recordReference() {
        return this.props.recordReference;
    }
    get recordType() {
        return this.props.recordType;
    }
    constructor(props) {
        super(props);
    }
    static create(props) {
        const guardedProps = [
            { argument: props.recordReference, argumentName: 'recordReference' },
            { argument: props.recordType, argumentName: 'recordType' }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            const recordLine = new RecordLine(Object.assign({}, props));
            return Result_1.Result.ok(recordLine);
        }
    }
}
exports.RecordLine = RecordLine;
//# sourceMappingURL=recordLine.js.map