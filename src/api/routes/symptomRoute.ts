import { Router } from 'express';

import { celebrate, Joi } from 'celebrate';
import config from '../../config';
import { Container } from 'typedi';
import ISymptomController from '../../controllers/IControllers/ISymptomController';
    const route = Router();
    export default (app: Router) => {
    
      
        const ctrl = Container.get(config.controllers.symptom.name) as ISymptomController;
      

        route.get(
          '/all',
          async (req, res, next) => {
            try {
              await ctrl.getAllSymptoms(req, res, next);
            } catch (error) {
              next(error);
            }
          }
        );


        route.post(
          '',
          celebrate({
            body: Joi.object({
              description: Joi.string().required(),
            }),
          }),
          async (req, res, next) => {
            try {
              await ctrl.createSymptom(req, res, next);
            } catch (error) {
              next(error); 
            }
          }
        );
      
        app.use('/symptoms', route);
        
      };