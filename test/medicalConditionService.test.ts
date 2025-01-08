import { expect } from "chai";
import sinon from "sinon";
import MedicalConditionService from "../src/services/medicalConditionService";
import IMedicalConditionRepo from "../src/services/IRepos/IMedicalConditionRepo";
import { Result } from "../src/core/logic/Result";
import { IMedicalConditionDTO } from "../src/dto/IMedicalConditionDTO";
import { describe, beforeEach, it, afterEach } from "mocha";

describe("MedicalConditionService", () => {
  let service: MedicalConditionService;
  let medicalConditionRepoStub: sinon.SinonStubbedInstance<IMedicalConditionRepo>;

  beforeEach(() => {
    medicalConditionRepoStub = sinon.createStubInstance(require("../src/IRepos/IMedicalConditionRepo").default);
    service = new MedicalConditionService(medicalConditionRepoStub);
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

      medicalConditionRepoStub.save.resolves();

      const result = await service.createMedicalCondition(medicalConditionDTO);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.deep.equal(medicalConditionDTO);
    });

    it("should return an error if code creation fails", async () => {
      const medicalConditionDTO: IMedicalConditionDTO = {
        code: "",
        designation: "Condition A",
        description: "Description A",
        symptoms: ["Symptom 1", "Symptom 2"]
      };

      const result = await service.createMedicalCondition(medicalConditionDTO);

      expect(result.isFailure).to.be.true;
      expect(result.error).to.equal("Invalid code");
    });


  });

  describe("getAllMedicalConditions", () => {
    it("should return all medical conditions successfully", async () => {
      const medicalConditions = [
        { code: "MC001", designation: "Condition A", description: "Description A", symptoms: ["Symptom 1", "Symptom 2"] },
        { code: "MC002", designation: "Condition B", description: "Description B", symptoms: ["Symptom 3", "Symptom 4"] }
      ];

      medicalConditionRepoStub.getAllMedicalConditions.resolves(medicalConditions);

      const result = await service.getAllMedicalConditions();

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.deep.equal(medicalConditions);
    });

    it("should return an error if fetching medical conditions fails", async () => {
      medicalConditionRepoStub.getAllMedicalConditions.rejects(new Error("Database error"));

      const result = await service.getAllMedicalConditions();

      expect(result.isFailure).to.be.true;
      expect(result.error).to.equal("Database error");
    });
  });
});