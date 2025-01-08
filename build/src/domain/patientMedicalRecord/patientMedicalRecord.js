"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientMedicalRecord = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
class PatientMedicalRecord extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get patientId() {
        return this.props.patientMedicalRecordNumber;
    }
    get records() {
        return this.props.records;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.patientMedicalRecordNumber, argumentName: 'patientMedicalRecordNumber' },
            { argument: props.records, argumentName: 'records' }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            const medicalCondition = new PatientMedicalRecord(Object.assign({}, props), id);
            return Result_1.Result.ok(medicalCondition);
        }
    }
    addRecordUnit(unit, type) {
        return this.records.addRecord(unit, type);
    }
}
exports.PatientMedicalRecord = PatientMedicalRecord;
//# sourceMappingURL=patientMedicalRecord.js.map