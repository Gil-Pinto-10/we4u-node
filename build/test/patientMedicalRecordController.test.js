"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const patientMedicalRecordController_1 = __importDefault(require("../src/controllers/patientMedicalRecordController"));
const patientMedicalRecordService_1 = __importDefault(require("../src/services/patientMedicalRecordService"));
const Result_1 = require("../src/core/logic/Result");
const mocha_1 = require("mocha");
(0, mocha_1.describe)("PatientMedicalRecordController", () => {
    let controller;
    let patientMedicalRecordServiceStub;
    let req;
    let res;
    let next;
    (0, mocha_1.beforeEach)(() => {
        patientMedicalRecordServiceStub = sinon_1.default.createStubInstance(patientMedicalRecordService_1.default);
        controller = new patientMedicalRecordController_1.default(patientMedicalRecordServiceStub);
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
    (0, mocha_1.describe)("createPatientMedicalRecord", () => {
        (0, mocha_1.it)("should create a patient medical record successfully", async () => {
            const patientMedicalRecordDTO = {
                patientMedicalRecordNumber: "12345",
                records: []
            };
            req.body = patientMedicalRecordDTO;
            patientMedicalRecordServiceStub.createPatientMedicalRecord.resolves(Result_1.Result.ok(patientMedicalRecordDTO));
            await controller.createPatientMedicalRecord(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(201);
            (0, chai_1.expect)(res.json).to.have.been.calledWith(patientMedicalRecordDTO);
        });
        (0, mocha_1.it)("should return an error if creation fails", async () => {
            const patientMedicalRecordDTO = {
                patientMedicalRecordNumber: "12345",
                records: []
            };
            req.body = patientMedicalRecordDTO;
            patientMedicalRecordServiceStub.createPatientMedicalRecord.resolves(Result_1.Result.fail("Creation failed"));
            await controller.createPatientMedicalRecord(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(400);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({ error: "Creation failed" });
        });
    });
});
//# sourceMappingURL=patientMedicalRecordController.test.js.map