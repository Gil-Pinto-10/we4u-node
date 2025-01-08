import { Router } from 'express';

import { celebrate, Joi } from 'celebrate';
import config from '../../config';
import { Container } from 'typedi';
import IAllergieController from '../../controllers/IControllers/IAllergieController';
    const route = Router();
    export default (app: Router) => {
    
      
        const ctrl = Container.get(config.controllers.allergie.name) as IAllergieController;
      

        route.get(
          '/all',
          async (req, res, next) => {
            try {
              await ctrl.getAllAllergies(req, res, next);
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
              designation: Joi.string().required()
            }),
          }),
          async (req, res, next) => {
            try {
              await ctrl.createAllergie(req, res, next);
            } catch (error) {
              next(error); 
            }
          }
        );

        route.get(
          '/',
          (req, res, next) => ctrl.getAllergies(req, res, next)
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
      
        app.use('/allergies', route);
        
      };