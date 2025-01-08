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
    const ctrl = typedi_1.Container.get(config_1.default.controllers.patientMedicalRecord.name);
    route.post('', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            patientMedicalRecordNumber: celebrate_1.Joi.string().required(),
            records: celebrate_1.Joi.array().items(celebrate_1.Joi.object({
                recordReference: celebrate_1.Joi.object({
                    code: celebrate_1.Joi.string().required()
                }).required(),
                recordType: celebrate_1.Joi.string().valid('ALLERGIE', 'MEDICAL_CONDITION').required()
            })).required()
        }),
    }), async (req, res, next) => {
        try {
            await ctrl.createPatientMedicalRecord(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
    app.use('/PatientMedicalRecord', route);
    route.put('/addRecord', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            patientMedicalRecordNumber: celebrate_1.Joi.string().required(),
            code: celebrate_1.Joi.string().required(),
            recordType: celebrate_1.Joi.string().required()
        }),
    }), async (req, res, next) => {
        try {
            await ctrl.addRecord(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
    route.patch('/teste', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            patientMedicalRecordNumber: celebrate_1.Joi.string().required(),
            records: celebrate_1.Joi.array().items(celebrate_1.Joi.object({
                recordReference: celebrate_1.Joi.object({
                    code: celebrate_1.Joi.string().required()
                }).required(),
                recordType: celebrate_1.Joi.string().valid('ALLERGIE', 'MEDICAL_CONDITION').required()
            })).required()
        }),
    }), async (req, res, next) => {
        try {
            await ctrl.createPatientMedicalRecord(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
    route.get('/:patientMedicalRecordNumber', async (req, res, next) => {
        try {
            await ctrl.findByMedicalRecordNumber(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
    route.get('/unaddedAllergies/:patientMedicalRecordNumber', async (req, res, next) => {
        try {
            await ctrl.findUnaddedAllergies(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
    route.get('/unaddedMedicalConditions/:patientMedicalRecordNumber', async (req, res, next) => {
        try {
            await ctrl.findUnaddedMedicalConditions(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
};
//# sourceMappingURL=patientMedicalRecordRoute.js.map