"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const medicalConditionService_1 = __importDefault(require("../src/services/medicalConditionService"));
const mocha_1 = require("mocha");
(0, mocha_1.describe)("MedicalConditionService", () => {
    let service;
    let medicalConditionRepoStub;
    (0, mocha_1.beforeEach)(() => {
        medicalConditionRepoStub = sinon_1.default.createStubInstance(require("../src/IRepos/IMedicalConditionRepo").default);
        service = new medicalConditionService_1.default(medicalConditionRepoStub);
    });
    (0, mocha_1.afterEach)(() => {
        sinon_1.default.restore();
    });
    (0, mocha_1.describe)("createMedicalCondition", () => {
        (0, mocha_1.it)("should create a medical condition successfully", async () => {
            const medicalConditionDTO = {
                code: "MC001",
                designation: "Condition A",
                description: "Description A",
                symptoms: ["Symptom 1", "Symptom 2"]
            };
            medicalConditionRepoStub.save.resolves();
            const result = await service.createMedicalCondition(medicalConditionDTO);
            (0, chai_1.expect)(result.isSuccess).to.be.true;
            (0, chai_1.expect)(result.getValue()).to.deep.equal(medicalConditionDTO);
        });
        (0, mocha_1.it)("should return an error if code creation fails", async () => {
            const medicalConditionDTO = {
                code: "",
                designation: "Condition A",
                description: "Description A",
                symptoms: ["Symptom 1", "Symptom 2"]
            };
            const result = await service.createMedicalCondition(medicalConditionDTO);
            (0, chai_1.expect)(result.isFailure).to.be.true;
            (0, chai_1.expect)(result.error).to.equal("Invalid code");
        });
    });
    (0, mocha_1.describe)("getAllMedicalConditions", () => {
        (0, mocha_1.it)("should return all medical conditions successfully", async () => {
            const medicalConditions = [
                { code: "MC001", designation: "Condition A", description: "Description A", symptoms: ["Symptom 1", "Symptom 2"] },
                { code: "MC002", designation: "Condition B", description: "Description B", symptoms: ["Symptom 3", "Symptom 4"] }
            ];
            medicalConditionRepoStub.getAllMedicalConditions.resolves(medicalConditions);
            const result = await service.getAllMedicalConditions();
            (0, chai_1.expect)(result.isSuccess).to.be.true;
            (0, chai_1.expect)(result.getValue()).to.deep.equal(medicalConditions);
        });
        (0, mocha_1.it)("should return an error if fetching medical conditions fails", async () => {
            medicalConditionRepoStub.getAllMedicalConditions.rejects(new Error("Database error"));
            const result = await service.getAllMedicalConditions();
            (0, chai_1.expect)(result.isFailure).to.be.true;
            (0, chai_1.expect)(result.error).to.equal("Database error");
        });
    });
});
//# sourceMappingURL=medicalConditionService.test.js.map