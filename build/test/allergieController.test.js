"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const allergieController_1 = __importDefault(require("../src/controllers/allergieController"));
const allergieService_1 = __importDefault(require("../src/services/allergieService"));
const Result_1 = require("../src/core/logic/Result");
const mocha_1 = require("mocha");
(0, mocha_1.describe)("AllergieController", () => {
    let controller;
    let allergieServiceStub;
    let req;
    let res;
    let next;
    (0, mocha_1.beforeEach)(() => {
        allergieServiceStub = sinon_1.default.createStubInstance(allergieService_1.default);
        controller = new allergieController_1.default(allergieServiceStub);
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
    (0, mocha_1.describe)("createAllergie", () => {
        (0, mocha_1.it)("should create an allergie successfully", async () => {
            const allergieDTO = {
                code: "AL001",
                designation: "Allergie A",
                description: "Description A"
            };
            req.body = allergieDTO;
            allergieServiceStub.createAllergie.resolves(Result_1.Result.ok(allergieDTO));
            await controller.createAllergie(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(201);
            (0, chai_1.expect)(res.json).to.have.been.calledWith(allergieDTO);
        });
        (0, mocha_1.it)("should return an error if creation fails", async () => {
            const allergieDTO = {
                code: "AL001",
                designation: "Allergie A",
                description: "Description A"
            };
            req.body = allergieDTO;
            allergieServiceStub.createAllergie.resolves(Result_1.Result.fail("Creation failed"));
            await controller.createAllergie(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(400);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({ error: "Creation failed" });
        });
    });
    (0, mocha_1.describe)("getAllAllergies", () => {
        (0, mocha_1.it)("should return all allergies successfully", async () => {
            const allergies = [
                { code: "AL001", designation: "Allergie A", description: "Description A" },
                { code: "AL002", designation: "Allergie B", description: "Description B" }
            ];
            allergieServiceStub.getAllAllergies.resolves(Result_1.Result.ok(allergies));
            await controller.getAllAllergies(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(200);
            (0, chai_1.expect)(res.json).to.have.been.calledWith(allergies);
        });
        (0, mocha_1.it)("should return an error if fetching allergies fails", async () => {
            allergieServiceStub.getAllAllergies.resolves(Result_1.Result.fail("Fetching failed"));
            await controller.getAllAllergies(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(400);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({ error: "Fetching failed" });
        });
    });
});
//# sourceMappingURL=allergieController.test.js.map