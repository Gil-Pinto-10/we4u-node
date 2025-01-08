import { expect } from "chai";
import sinon from "sinon";
import PatientMedicalRecordService from "../src/services/patientMedicalRecordService";
import IPatientMedicalRecordRepo from "../src/services/IRepos/IPatientMedicalRecordRepo";
import IMedicalConditionRepo from "../src/services/IRepos/IMedicalConditionRepo";
import IAllergieRepo from "../src/services/IRepos/IAllergieRepo";
import { Result } from "../src/core/logic/Result";
import { RecordTypeEnum } from "../src/domain/patientMedicalRecord/recordTypeEnum";
import { describe, beforeEach, it, afterEach } from "mocha";
import axios from 'axios';
import { jest } from '@jest/globals';

jest.mock('axios');

describe("PatientMedicalRecordService", () => {
  let service: PatientMedicalRecordService;
  let patientMedicalRecordRepoStub: sinon.SinonStubbedInstance<IPatientMedicalRecordRepo>;
  let medicalConditionRepoStub: sinon.SinonStubbedInstance<IMedicalConditionRepo>;
  let allergieRepoStub: sinon.SinonStubbedInstance<IAllergieRepo>;

  beforeEach(() => {
    patientMedicalRecordRepoStub = sinon.createStubInstance(require("../src/IRepos/IPatientMedicalRecordRepo").default);
    medicalConditionRepoStub = sinon.createStubInstance(require("../src/IRepos/IMedicalConditionRepo").default);
    allergieRepoStub = sinon.createStubInstance(require("../src/IRepos/IAllergieRepo").default);

    service = new PatientMedicalRecordService(
      patientMedicalRecordRepoStub,
      medicalConditionRepoStub,
      allergieRepoStub
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createPatientMedicalRecord", () => {
    it("should return an error if the patient does not exist", async () => {
      const patientMedicalRecordDTO = { patientMedicalRecordNumber: '12345', records: [] };
      (axios.post as jest.Mock<any>).mockResolvedValue({ data: false });

      const result = await service.createPatientMedicalRecord(patientMedicalRecordDTO);

      expect(result.isFailure).to.be.true;
      expect(result.error).to.equal(`Patient with number ${patientMedicalRecordDTO.patientMedicalRecordNumber} does not exist`);
    });

    it("should create a patient medical record successfully", async () => {
      const patientMedicalRecordDTO = { patientMedicalRecordNumber: '12345', records: [] };
      (axios.post as jest.Mock<any>).mockResolvedValue({ data: true });
      patientMedicalRecordRepoStub.findByMedicalRecordNumber.resolves(null);

      const result = await service.createPatientMedicalRecord(patientMedicalRecordDTO);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal(patientMedicalRecordDTO);
    });
  });

  describe("addRecord", () => {
    it("should add a medical condition record successfully", async () => {
      const patientMedicalRecordNumber = '12345';
      const code = 'MC001';
      const recordType = RecordTypeEnum.MEDICAL_CONDITION;

      patientMedicalRecordRepoStub.findByMedicalRecordNumber.resolves({ /* mock patient medical record */ });
      medicalConditionRepoStub.findByCode.resolves({ code: { value: code }, description: { value: 'Description' }, designation: { value: 'Designation' } });

      const result = await service.addRecord(patientMedicalRecordNumber, code, recordType);

      expect(result.isSuccess).to.be.true;
      expect(patientMedicalRecordRepoStub.save).to.have.been.called;
    });

    it("should fail to add a medical condition record if not found", async () => {
      const patientMedicalRecordNumber = '12345';
      const code = 'MC001';
      const recordType = RecordTypeEnum.MEDICAL_CONDITION;

      patientMedicalRecordRepoStub.findByMedicalRecordNumber.resolves({ /* mock patient medical record */ });
      medicalConditionRepoStub.findByCode.resolves(null);

      const result = await service.addRecord(patientMedicalRecordNumber, code, recordType);

      expect(result.isFailure).to.be.true;
      expect(result.error).to.equal(`Medical condition with code ${code} not found`);
    });

    it("should add an allergie record successfully", async () => {
      const patientMedicalRecordNumber = '12345';
      const code = 'AL001';
      const recordType = RecordTypeEnum.ALLERGIE;

      patientMedicalRecordRepoStub.findByMedicalRecordNumber.resolves({ /* mock patient medical record */ });
      allergieRepoStub.findByCode.resolves({ code: { value: code }, description: { value: 'Description' }, designation: { value: 'Designation' } });

      const result = await service.addRecord(patientMedicalRecordNumber, code, recordType);

      expect(result.isSuccess).to.be.true;
      expect(patientMedicalRecordRepoStub.save).to.have.been.called;
    });

    it("should fail to add an allergie record if not found", async () => {
      const patientMedicalRecordNumber = '12345';
      const code = 'AL001';
      const recordType = RecordTypeEnum.ALLERGIE;

      patientMedicalRecordRepoStub.findByMedicalRecordNumber.resolves({ /* mock patient medical record */ });
      allergieRepoStub.findByCode.resolves(null);

      const result = await service.addRecord(patientMedicalRecordNumber, code, recordType);

      expect(result.isFailure).to.be.true;
      expect(result.error).to.equal(`Allergie with code ${code} not found`);
    });
  });
});