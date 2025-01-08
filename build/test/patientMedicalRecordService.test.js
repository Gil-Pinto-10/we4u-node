"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const patientMedicalRecordService_1 = __importDefault(require("../src/services/patientMedicalRecordService"));
const recordTypeEnum_1 = require("../src/domain/patientMedicalRecord/recordTypeEnum");
const mocha_1 = require("mocha");
const axios_1 = __importDefault(require("axios"));
const globals_1 = require("@jest/globals");
globals_1.jest.mock('axios');
(0, mocha_1.describe)("PatientMedicalRecordService", () => {
    let service;
    let patientMedicalRecordRepoStub;
    let medicalConditionRepoStub;
    let allergieRepoStub;
    (0, mocha_1.beforeEach)(() => {
        patientMedicalRecordRepoStub = sinon_1.default.createStubInstance(require("../src/IRepos/IPatientMedicalRecordRepo").default);
        medicalConditionRepoStub = sinon_1.default.createStubInstance(require("../src/IRepos/IMedicalConditionRepo").default);
        allergieRepoStub = sinon_1.default.createStubInstance(require("../src/IRepos/IAllergieRepo").default);
        service = new patientMedicalRecordService_1.default(patientMedicalRecordRepoStub, medicalConditionRepoStub, allergieRepoStub);
    });
    (0, mocha_1.afterEach)(() => {
        sinon_1.default.restore();
    });
    (0, mocha_1.describe)("createPatientMedicalRecord", () => {
        (0, mocha_1.it)("should return an error if the patient does not exist", async () => {
            const patientMedicalRecordDTO = { patientMedicalRecordNumber: '12345', records: [] };
            axios_1.default.post.mockResolvedValue({ data: false });
            const result = await service.createPatientMedicalRecord(patientMedicalRecordDTO);
            (0, chai_1.expect)(result.isFailure).to.be.true;
            (0, chai_1.expect)(result.error).to.equal(`Patient with number ${patientMedicalRecordDTO.patientMedicalRecordNumber} does not exist`);
        });
        (0, mocha_1.it)("should create a patient medical record successfully", async () => {
            const patientMedicalRecordDTO = { patientMedicalRecordNumber: '12345', records: [] };
            axios_1.default.post.mockResolvedValue({ data: true });
            patientMedicalRecordRepoStub.findByMedicalRecordNumber.resolves(null);
            const result = await service.createPatientMedicalRecord(patientMedicalRecordDTO);
            (0, chai_1.expect)(result.isSuccess).to.be.true;
            (0, chai_1.expect)(result.getValue()).to.equal(patientMedicalRecordDTO);
        });
    });
    (0, mocha_1.describe)("addRecord", () => {
        (0, mocha_1.it)("should add a medical condition record successfully", async () => {
            const patientMedicalRecordNumber = '12345';
            const code = 'MC001';
            const recordType = recordTypeEnum_1.RecordTypeEnum.MEDICAL_CONDITION;
            patientMedicalRecordRepoStub.findByMedicalRecordNumber.resolves({ /* mock patient medical record */});
            medicalConditionRepoStub.findByCode.resolves({ code: { value: code }, description: { value: 'Description' }, designation: { value: 'Designation' } });
            const result = await service.addRecord(patientMedicalRecordNumber, code, recordType);
            (0, chai_1.expect)(result.isSuccess).to.be.true;
            (0, chai_1.expect)(patientMedicalRecordRepoStub.save).to.have.been.called;
        });
        (0, mocha_1.it)("should fail to add a medical condition record if not found", async () => {
            const patientMedicalRecordNumber = '12345';
            const code = 'MC001';
            const recordType = recordTypeEnum_1.RecordTypeEnum.MEDICAL_CONDITION;
            patientMedicalRecordRepoStub.findByMedicalRecordNumber.resolves({ /* mock patient medical record */});
            medicalConditionRepoStub.findByCode.resolves(null);
            const result = await service.addRecord(patientMedicalRecordNumber, code, recordType);
            (0, chai_1.expect)(result.isFailure).to.be.true;
            (0, chai_1.expect)(result.error).to.equal(`Medical condition with code ${code} not found`);
        });
        (0, mocha_1.it)("should add an allergie record successfully", async () => {
            const patientMedicalRecordNumber = '12345';
            const code = 'AL001';
            const recordType = recordTypeEnum_1.RecordTypeEnum.ALLERGIE;
            patientMedicalRecordRepoStub.findByMedicalRecordNumber.resolves({ /* mock patient medical record */});
            allergieRepoStub.findByCode.resolves({ code: { value: code }, description: { value: 'Description' }, designation: { value: 'Designation' } });
            const result = await service.addRecord(patientMedicalRecordNumber, code, recordType);
            (0, chai_1.expect)(result.isSuccess).to.be.true;
            (0, chai_1.expect)(patientMedicalRecordRepoStub.save).to.have.been.called;
        });
        (0, mocha_1.it)("should fail to add an allergie record if not found", async () => {
            const patientMedicalRecordNumber = '12345';
            const code = 'AL001';
            const recordType = recordTypeEnum_1.RecordTypeEnum.ALLERGIE;
            patientMedicalRecordRepoStub.findByMedicalRecordNumber.resolves({ /* mock patient medical record */});
            allergieRepoStub.findByCode.resolves(null);
            const result = await service.addRecord(patientMedicalRecordNumber, code, recordType);
            (0, chai_1.expect)(result.isFailure).to.be.true;
            (0, chai_1.expect)(result.error).to.equal(`Allergie with code ${code} not found`);
        });
    });
});
//# sourceMappingURL=patientMedicalRecordService.test.js.map