import { Router } from 'express';

import { celebrate, Joi } from 'celebrate';
import config from '../../config';
import { Container } from 'typedi';

import IMedicalConditionController from '../../controllers/IControllers/IMedicalConditionController';
    const route = Router();
    export default (app: Router) => {
    
      
        const ctrl = Container.get(config.controllers.medicalCondition.name) as IMedicalConditionController;
      

        route.get(
          '/all',
          async (req, res, next) => {
            try {
              await ctrl.getAllMedicalConditions(req, res, next);
            } catch (error) {
              next(error);
            }
          }
        );


        route.post(
          '',
          celebrate({
            body: Joi.object({
              code: Joi.string().required(),
              description: Joi.string().required(),
              designation: Joi.string().required(),
              symptoms: Joi.array().items(Joi.string().required()).required()
            }),
          }),
          async (req, res, next) => {
            try {
              await ctrl.createMedicalCondition(req, res, next);
            } catch (error) {
              next(error); 
            }
          }
        );

        route.get(
          '/all',
          async (req, res, next) => {
            try {
              await ctrl.findAll(req, res, next);
            } catch (error) {
              next(error); 
            }
          }
        );

        route.get(
          '/:code',
          async (req, res, next) => {
            try {
              await ctrl.findBycode(req, res, next);
            } catch (error) {
              next(error); 
            }
          }
        );
      
        app.use('/medicalConditions', route);
        
      };