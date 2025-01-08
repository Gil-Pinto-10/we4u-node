import { Router } from 'express';

import { celebrate, Joi } from 'celebrate';
import config from '../../config';
import { Container } from 'typedi';
import IPatientMedicalRecordController from '../../controllers/IControllers/IPatientMedicalRecordController';

    const route = Router();
    export default (app: Router) => {
    
      
        const ctrl = Container.get(config.controllers.patientMedicalRecord.name) as IPatientMedicalRecordController;
      
        route.post(
          '',
          celebrate({
            body: Joi.object({
              patientMedicalRecordNumber: Joi.string().required(),
              records: Joi.array().items(
                Joi.object({
                  recordReference: Joi.object({
                    code: Joi.string().required()
                  }).required(),
                  recordType: Joi.string().valid('ALLERGIE', 'MEDICAL_CONDITION').required()
                })
              ).required()
            }),
          }),
          async (req, res, next) => {
            try {
              await ctrl.createPatientMedicalRecord(req, res, next);
            } catch (error) {
              next(error); 
            }
          }
        );
      
        app.use('/PatientMedicalRecord', route);
        
        route.put(
          '/addRecord',
          celebrate({
            body: Joi.object({
              patientMedicalRecordNumber: Joi.string().required(),
              code: Joi.string().required(),
              recordType: Joi.string().required()
            }),
          }),
          async (req, res, next) => {
            try {
              await ctrl.addRecord(req, res, next);
            } catch (error) {
              next(error);
            }
          }
        );
        route.patch(
          '/teste',
          celebrate({
            body: Joi.object({
              patientMedicalRecordNumber: Joi.string().required(),
              records: Joi.array().items(
                Joi.object({
                  recordReference: Joi.object({
                    code: Joi.string().required()
                  }).required(),
                  recordType: Joi.string().valid('ALLERGIE', 'MEDICAL_CONDITION').required()
                })
              ).required()
            }),
          }),
          async (req, res, next) => {
            try {
              await ctrl.createPatientMedicalRecord(req, res, next);
            } catch (error) {
              next(error); 
            }
          }
        );

        route.get(
          '/:patientMedicalRecordNumber',
          async (req, res, next) => {
            try {
              await ctrl.findByMedicalRecordNumber(req, res, next);
            } catch (error) {
              next(error);
            }
          }
        );

        route.get(
          '/unaddedAllergies/:patientMedicalRecordNumber',
          async (req, res, next) => {
            try {
              await ctrl.findUnaddedAllergies(req, res, next);
            } catch (error) {
              next(error);
            }
          }
        );

        route.get(
          '/unaddedMedicalConditions/:patientMedicalRecordNumber',
          async (req, res, next) => {
            try {
              await ctrl.findUnaddedMedicalConditions(req, res, next);
            } catch (error) {
              next(error);
            }
          }
        );

      
      };