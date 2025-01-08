"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalCondition = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
const medicalConditionId_1 = require("./medicalConditionId");
class MedicalCondition extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get medicalConditionId() {
        return new medicalConditionId_1.medicalConditionId(this.medicalConditionId.toValue());
    }
    get symptoms() {
        return this.props.symptoms;
    }
    get code() {
        return this.props.code;
    }
    get designation() {
        return this.props.designation;
    }
    get description() {
        return this.props.description;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.code, argumentName: 'code' },
            { argument: props.description, argumentName: 'description' },
            { argument: props.designation, argumentName: 'designation' },
            { argument: props.symptoms, argumentName: 'symptoms' }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            const medicalCondition = new MedicalCondition(Object.assign({}, props), id);
            return Result_1.Result.ok(medicalCondition);
        }
    }
    addSymptom(symptomDescription) {
        return this.props.symptoms.addSymptom(symptomDescription);
    }
}
exports.MedicalCondition = MedicalCondition;
//# sourceMappingURL=medicalCondition.js.map