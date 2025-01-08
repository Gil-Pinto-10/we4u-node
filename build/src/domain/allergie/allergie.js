"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Allergie = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
class Allergie extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get allergieId() {
        return this._id.toString();
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
            { argument: props.designation, argumentName: 'designation' }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        else {
            const allergie = new Allergie(Object.assign({}, props), id);
            return Result_1.Result.ok(allergie);
        }
    }
}
exports.Allergie = Allergie;
//# sourceMappingURL=allergie.js.map