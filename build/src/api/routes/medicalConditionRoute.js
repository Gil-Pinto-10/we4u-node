"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const config_1 = __importDefault(require("../../config"));
const typedi_1 = require("typedi");
const route = (0, express_1.Router)();
exports.default = (app) => {
    const ctrl = typedi_1.Container.get(config_1.default.controllers.medicalCondition.name);
    route.get('/all', async (req, res, next) => {
        try {
            await ctrl.getAllMedicalConditions(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
    route.post('', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            code: celebrate_1.Joi.string().required(),
            description: celebrate_1.Joi.string().required(),
            designation: celebrate_1.Joi.string().required(),
            symptoms: celebrate_1.Joi.array().items(celebrate_1.Joi.string().required()).required()
        }),
    }), async (req, res, next) => {
        try {
            await ctrl.createMedicalCondition(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
    route.get('/all', async (req, res, next) => {
        try {
            await ctrl.findAll(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
    route.get('/:code', async (req, res, next) => {
        try {
            await ctrl.findBycode(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
    app.use('/medicalConditions', route);
};
//# sourceMappingURL=medicalConditionRoute.js.map