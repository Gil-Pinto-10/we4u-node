import { expect } from "chai";
import sinon from "sinon";
import { Request, Response, NextFunction } from "express";
import PatientMedicalRecordController from "../src/controllers/patientMedicalRecordController";
import PatientMedicalRecordService from "../src/services/patientMedicalRecordService";
import { IPatientMedicalRecordDTO } from "../src/dto/IPatientMedicalRecordDTO";
import { Result } from "../src/core/logic/Result";
import { describe, beforeEach, it, afterEach } from "mocha";

describe("PatientMedicalRecordController", () => {
  let controller: PatientMedicalRecordController;
  let patientMedicalRecordServiceStub: sinon.SinonStubbedInstance<PatientMedicalRecordService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: sinon.SinonStub;

  beforeEach(() => {
    patientMedicalRecordServiceStub = sinon.createStubInstance(PatientMedicalRecordService);
    controller = new PatientMedicalRecordController(patientMedicalRecordServiceStub);
    req = {};
    res = {
      json: sinon.stub().returnsThis(),
      status: sinon.stub().returnsThis()
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createPatientMedicalRecord", () => {
    it("should create a patient medical record successfully", async () => {
      const patientMedicalRecordDTO: IPatientMedicalRecordDTO = {
        patientMedicalRecordNumber: "12345",
        records: []
      };
      req.body = patientMedicalRecordDTO;
      patientMedicalRecordServiceStub.createPatientMedicalRecord.resolves(Result.ok<IPatientMedicalRecordDTO>(patientMedicalRecordDTO));

      await controller.createPatientMedicalRecord(req as Request, res as Response, next as NextFunction);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(patientMedicalRecordDTO);
    });

    it("should return an error if creation fails", async () => {
      const patientMedicalRecordDTO: IPatientMedicalRecordDTO = {
        patientMedicalRecordNumber: "12345",
        records: []
      };
      req.body = patientMedicalRecordDTO;
      patientMedicalRecordServiceStub.createPatientMedicalRecord.resolves(Result.fail<IPatientMedicalRecordDTO>("Creation failed"));

      await controller.createPatientMedicalRecord(req as Request, res as Response, next as NextFunction);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ error: "Creation failed" });
    });
  });


});