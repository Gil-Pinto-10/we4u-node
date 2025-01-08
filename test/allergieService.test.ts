import { expect } from "chai";
import sinon from "sinon";
import AllergieService from "../src/services/allergieService";
import IAllergieRepo from "../src/services/IRepos/IAllergieRepo";
import { Result } from "../src/core/logic/Result";
import { IAllergieDTO } from "../src/dto/IAllergieDTO";
import { describe, beforeEach, it, afterEach } from "mocha";

describe("AllergieService", () => {
  let service: AllergieService;
  let allergieRepoStub: sinon.SinonStubbedInstance<IAllergieRepo>;

  beforeEach(() => {
    allergieRepoStub = sinon.createStubInstance(require("../src/IRepos/IAllergieRepo").default);
    service = new AllergieService(allergieRepoStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createAllergie", () => {
    it("should create an allergie successfully", async () => {
      const allergieDTO: IAllergieDTO = {
        code: "AL001",
        designation: "Allergie A",
        description: "Description A"
      };

      allergieRepoStub.save.resolves();

      const result = await service.createAllergie(allergieDTO);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.deep.equal(allergieDTO);
    });

    it("should return an error if code creation fails", async () => {
      const allergieDTO: IAllergieDTO = {
        code: "",
        designation: "Allergie A",
        description: "Description A"
      };

      const result = await service.createAllergie(allergieDTO);

      expect(result.isFailure).to.be.true;
      expect(result.error).to.equal("Invalid code");
    });


  });

  describe("getAllAllergies", () => {
    it("should return all allergies successfully", async () => {
      const allergies = [
        { code: "AL001", designation: "Allergie A", description: "Description A" },
        { code: "AL002", designation: "Allergie B", description: "Description B" }
      ];

      allergieRepoStub.getAllAllergies.resolves(allergies);

      const result = await service.getAllAllergies();

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.deep.equal(allergies);
    });

    it("should return an error if fetching allergies fails", async () => {
      allergieRepoStub.getAllAllergies.rejects(new Error("Database error"));

      const result = await service.getAllAllergies();

      expect(result.isFailure).to.be.true;
      expect(result.error).to.equal("Database error");
    });
  });
});