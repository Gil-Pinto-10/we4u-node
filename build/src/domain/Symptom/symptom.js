"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Symptom = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
const symptomId_1 = require("./symptomId");
class Symptom extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get symptomId() {
        return new symptomId_1.symptomId(this.symptomId.toValue());
    }
    get description() {
        return this.props.description;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.description, argumentName: 'description' }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            const symptom = new Symptom(Object.assign({}, props), id);
            return Result_1.Result.ok(symptom);
        }
    }
}
exports.Symptom = Symptom;
//# sourceMappingURL=symptom.js.map