"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordSet = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
const recordLine_1 = require("./recordLine");
const recordUnit_1 = require("./recordUnit");
class RecordSet extends ValueObject_1.ValueObject {
    includes(allergie) {
        return this.props.values.some((recordLine) => recordLine.recordReference.code === allergie.code.value);
    }
    get values() {
        return this.props.values;
    }
    constructor(props) {
        super(props);
    }
    static create(initialValues = []) {
        if (!Array.isArray(initialValues) || !initialValues.every((val) => val instanceof recordLine_1.RecordLine)) {
            return Result_1.Result.fail("Something wrong happened on the record set.");
        }
        const units = initialValues.map(val => recordLine_1.RecordLine.create({ recordReference: recordUnit_1.RecordUnit.create({ code: val.recordReference.code, designation: val.recordReference.designation, description: val.recordReference.description }).getValue(), recordType: val.props.recordType }).getValue());
        return Result_1.Result.ok(new RecordSet({ values: units }));
    }
    addRecord(record, recordType) {
        const recordUnitResult = recordUnit_1.RecordUnit.create(record);
        if (recordUnitResult.isFailure) {
            console.error(`Failed to create RecordUnit: ${recordUnitResult.error}`);
            return Result_1.Result.fail(recordUnitResult.error);
        }
        const recordLineResult = recordLine_1.RecordLine.create({ recordReference: record, recordType });
        if (recordLineResult.isFailure) {
            console.error(`Failed to create RecordLine: ${recordLineResult.error}`);
            return Result_1.Result.fail(recordLineResult.error);
        }
        this.props.values.push(recordLineResult.getValue());
        return Result_1.Result.ok();
    }
}
exports.RecordSet = RecordSet;
//# sourceMappingURL=recordSet.js.map