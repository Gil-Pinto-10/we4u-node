import { expect } from "chai";
import sinon from "sinon";
import { Request, Response, NextFunction } from "express";
import MedicalConditionController from "../src/controllers/medicalConditionController";
import MedicalConditionService from "../src/services/medicalConditionService";
import { IMedicalConditionDTO } from "../src/dto/IMedicalConditionDTO";
import { Result } from "../src/core/logic/Result";
import { describe, beforeEach, it, afterEach } from "mocha";

describe("MedicalConditionController", () => {
  let controller: MedicalConditionController;
  let medicalConditionServiceStub: sinon.SinonStubbedInstance<MedicalConditionService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: sinon.SinonStub;

  beforeEach(() => {
    medicalConditionServiceStub = sinon.createStubInstance(MedicalConditionService);
    controller = new MedicalConditionController(medicalConditionServiceStub);
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

  describe("createMedicalCondition", () => {
    it("should create a medical condition successfully", async () => {
      const medicalConditionDTO: IMedicalConditionDTO = {
        code: "MC001",
        designation: "Condition A",
        description: "Description A",
        symptoms: ["Symptom 1", "Symptom 2"]
      };
      req.body = medicalConditionDTO;
      medicalConditionServiceStub.createMedicalCondition.resolves(Result.ok<IMedicalConditionDTO>(medicalConditionDTO));

      await controller.createMedicalCondition(req as Request, res as Response, next as NextFunction);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(medicalConditionDTO);
    });

    it("should return an error if creation fails", async () => {
      const medicalConditionDTO: IMedicalConditionDTO = {
        code: "MC001",
        designation: "Condition A",
        description: "Description A",
        symptoms: ["Symptom 1", "Symptom 2"]
      };
      req.body = medicalConditionDTO;
      medicalConditionServiceStub.createMedicalCondition.resolves(Result.fail<IMedicalConditionDTO>("Creation failed"));

      await controller.createMedicalCondition(req as Request, res as Response, next as NextFunction);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ error: "Creation failed" });
    });
  });

  describe("getAllMedicalConditions", () => {
    it("should return all medical conditions successfully", async () => {
      const medicalConditions = [
        { code: "MC001", designation: "Condition A", description: "Description A", symptoms: ["Symptom 1", "Symptom 2"] },
        { code: "MC002", designation: "Condition B", description: "Description B", symptoms: ["Symptom 3", "Symptom 4"] }
      ];
      medicalConditionServiceStub.getAllMedicalConditions.resolves(Result.ok<IMedicalConditionDTO[]>(medicalConditions));

      await controller.getAllMedicalConditions(req as Request, res as Response, next as NextFunction);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(medicalConditions);
    });

    it("should return an error if fetching medical conditions fails", async () => {
      medicalConditionServiceStub.getAllMedicalConditions.resolves(Result.fail<IMedicalConditionDTO[]>("Fetching failed"));

      await controller.getAllMedicalConditions(req as Request, res as Response, next as NextFunction);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ error: "Fetching failed" });
    });
  });
});