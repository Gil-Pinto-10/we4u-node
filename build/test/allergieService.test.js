"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const allergieService_1 = __importDefault(require("../src/services/allergieService"));
const mocha_1 = require("mocha");
(0, mocha_1.describe)("AllergieService", () => {
    let service;
    let allergieRepoStub;
    (0, mocha_1.beforeEach)(() => {
        allergieRepoStub = sinon_1.default.createStubInstance(require("../src/IRepos/IAllergieRepo").default);
        service = new allergieService_1.default(allergieRepoStub);
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
            allergieRepoStub.save.resolves();
            const result = await service.createAllergie(allergieDTO);
            (0, chai_1.expect)(result.isSuccess).to.be.true;
            (0, chai_1.expect)(result.getValue()).to.deep.equal(allergieDTO);
        });
        (0, mocha_1.it)("should return an error if code creation fails", async () => {
            const allergieDTO = {
                code: "",
                designation: "Allergie A",
                description: "Description A"
            };
            const result = await service.createAllergie(allergieDTO);
            (0, chai_1.expect)(result.isFailure).to.be.true;
            (0, chai_1.expect)(result.error).to.equal("Invalid code");
        });
    });
    (0, mocha_1.describe)("getAllAllergies", () => {
        (0, mocha_1.it)("should return all allergies successfully", async () => {
            const allergies = [
                { code: "AL001", designation: "Allergie A", description: "Description A" },
                { code: "AL002", designation: "Allergie B", description: "Description B" }
            ];
            allergieRepoStub.getAllAllergies.resolves(allergies);
            const result = await service.getAllAllergies();
            (0, chai_1.expect)(result.isSuccess).to.be.true;
            (0, chai_1.expect)(result.getValue()).to.deep.equal(allergies);
        });
        (0, mocha_1.it)("should return an error if fetching allergies fails", async () => {
            allergieRepoStub.getAllAllergies.rejects(new Error("Database error"));
            const result = await service.getAllAllergies();
            (0, chai_1.expect)(result.isFailure).to.be.true;
            (0, chai_1.expect)(result.error).to.equal("Database error");
        });
    });
});
//# sourceMappingURL=allergieService.test.js.map