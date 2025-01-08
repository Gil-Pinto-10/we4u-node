"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guard = void 0;
class Guard {
    static combine(guardResults) {
        for (const result of guardResults) {
            if (result.succeeded === false)
                return result;
        }
        return { succeeded: true };
    }
    static againstNullOrUndefined(argument, argumentName) {
        if (argument === null || argument === undefined) {
            return { succeeded: false, message: `${argumentName} is null or undefined` };
        }
        else {
            return { succeeded: true };
        }
    }
    static againstNullOrUndefinedBulk(args) {
        for (const arg of args) {
            const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
            if (!result.succeeded)
                return result;
        }
        return { succeeded: true };
    }
    static isOneOf(value, validValues, argumentName) {
        let isValid = false;
        for (const validValue of validValues) {
            if (value === validValue) {
                isValid = true;
            }
        }
        if (isValid) {
            return { succeeded: true };
        }
        else {
            return {
                succeeded: false,
                message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`
            };
        }
    }
    static inRange(num, min, max, argumentName) {
        const isInRange = num >= min && num <= max;
        if (!isInRange) {
            return { succeeded: false, message: `${argumentName} is not within range ${min} to ${max}.` };
        }
        else {
            return { succeeded: true };
        }
    }
    static isPositiveNumber(num, argumentName) {
        if (num <= 0) {
            return { succeeded: false, message: `${argumentName} is not greater than 0.` };
        }
        else {
            return { succeeded: true };
        }
    }
    static allInRange(numbers, min, max, argumentName) {
        let failingResult = null;
        for (const num of numbers) {
            const numIsInRangeResult = this.inRange(num, min, max, argumentName);
            if (!numIsInRangeResult.succeeded)
                failingResult = numIsInRangeResult;
        }
        if (failingResult) {
            return { succeeded: false, message: `${argumentName} is not within the range.` };
        }
        else {
            return { succeeded: true };
        }
    }
    static is2DArray(array, argumentName) {
        if (!Array.isArray(array)) {
            return { succeeded: false, message: `${argumentName} is not an array.` };
        }
        if (!array.every(Array.isArray)) {
            return { succeeded: false, message: `${argumentName} is not a 2D array.` };
        }
        return { succeeded: true };
    }
}
exports.Guard = Guard;
//# sourceMappingURL=Guard.js.map