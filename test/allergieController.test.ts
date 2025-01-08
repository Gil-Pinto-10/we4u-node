import { expect } from "chai";
import sinon from "sinon";
import { Request, Response } from "express";
import AllergieController from "../src/controllers/allergieController";
import AllergieService from "../src/services/allergieService";
import { IAllergieDTO } from "../src/dto/IAllergieDTO";
import { Result } from "../src/core/logic/Result";
import { describe, beforeEach, it, afterEach } from "mocha";

describe("AllergieController", () => {
  let controller: AllergieController;
  let allergieServiceStub: sinon.SinonStubbedInstance<AllergieService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: sinon.SinonStub;

  beforeEach(() => {
    allergieServiceStub = sinon.createStubInstance(AllergieService);
    controller = new AllergieController(allergieServiceStub);
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

  describe("createAllergie", () => {
    it("should create an allergie successfully", async () => {
      const allergieDTO: IAllergieDTO = {
        code: "AL001",
        designation: "Allergie A",
        description: "Description A"
      };
      req.body = allergieDTO;
      allergieServiceStub.createAllergie.resolves(Result.ok<IAllergieDTO>(allergieDTO));

      await controller.createAllergie(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(allergieDTO);
    });

    it("should return an error if creation fails", async () => {
      const allergieDTO: IAllergieDTO = {
        code: "AL001",
        designation: "Allergie A",
        description: "Description A"
      };
      req.body = allergieDTO;
      allergieServiceStub.createAllergie.resolves(Result.fail<IAllergieDTO>("Creation failed"));

      await controller.createAllergie(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ error: "Creation failed" });
    });
  });

  describe("getAllAllergies", () => {
    it("should return all allergies successfully", async () => {
      const allergies = [
        { code: "AL001", designation: "Allergie A", description: "Description A" },
        { code: "AL002", designation: "Allergie B", description: "Description B" }
      ];
      allergieServiceStub.getAllAllergies.resolves(Result.ok<IAllergieDTO[]>(allergies));

      await controller.getAllAllergies(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(allergies);
    });

    it("should return an error if fetching allergies fails", async () => {
      allergieServiceStub.getAllAllergies.resolves(Result.fail<IAllergieDTO[]>("Fetching failed"));

      await controller.getAllAllergies(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ error: "Fetching failed" });
    });
  });
});