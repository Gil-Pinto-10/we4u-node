"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const medicalConditionController_1 = __importDefault(require("../src/controllers/medicalConditionController"));
const medicalConditionService_1 = __importDefault(require("../src/services/medicalConditionService"));
const Result_1 = require("../src/core/logic/Result");
const mocha_1 = require("mocha");
(0, mocha_1.describe)("MedicalConditionController", () => {
    let controller;
    let medicalConditionServiceStub;
    let req;
    let res;
    let next;
    (0, mocha_1.beforeEach)(() => {
        medicalConditionServiceStub = sinon_1.default.createStubInstance(medicalConditionService_1.default);
        controller = new medicalConditionController_1.default(medicalConditionServiceStub);
        req = {};
        res = {
            json: sinon_1.default.stub().returnsThis(),
            status: sinon_1.default.stub().returnsThis()
        };
        next = sinon_1.default.stub();
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
            req.body = medicalConditionDTO;
            medicalConditionServiceStub.createMedicalCondition.resolves(Result_1.Result.ok(medicalConditionDTO));
            await controller.createMedicalCondition(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(201);
            (0, chai_1.expect)(res.json).to.have.been.calledWith(medicalConditionDTO);
        });
        (0, mocha_1.it)("should return an error if creation fails", async () => {
            const medicalConditionDTO = {
                code: "MC001",
                designation: "Condition A",
                description: "Description A",
                symptoms: ["Symptom 1", "Symptom 2"]
            };
            req.body = medicalConditionDTO;
            medicalConditionServiceStub.createMedicalCondition.resolves(Result_1.Result.fail("Creation failed"));
            await controller.createMedicalCondition(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(400);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({ error: "Creation failed" });
        });
    });
    (0, mocha_1.describe)("getAllMedicalConditions", () => {
        (0, mocha_1.it)("should return all medical conditions successfully", async () => {
            const medicalConditions = [
                { code: "MC001", designation: "Condition A", description: "Description A", symptoms: ["Symptom 1", "Symptom 2"] },
                { code: "MC002", designation: "Condition B", description: "Description B", symptoms: ["Symptom 3", "Symptom 4"] }
            ];
            medicalConditionServiceStub.getAllMedicalConditions.resolves(Result_1.Result.ok(medicalConditions));
            await controller.getAllMedicalConditions(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(200);
            (0, chai_1.expect)(res.json).to.have.been.calledWith(medicalConditions);
        });
        (0, mocha_1.it)("should return an error if fetching medical conditions fails", async () => {
            medicalConditionServiceStub.getAllMedicalConditions.resolves(Result_1.Result.fail("Fetching failed"));
            await controller.getAllMedicalConditions(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(400);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({ error: "Fetching failed" });
        });
    });
});
//# sourceMappingURL=medicalConditionController.test.js.map