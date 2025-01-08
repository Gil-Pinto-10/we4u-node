import config from "../config";
import { Result } from "../core/logic/Result";
import { Inject, Service } from "typedi";
import { Request, Response, NextFunction } from 'express';
import IMedicalConditionController from "./IControllers/IMedicalConditionController";
import IMedicalConditionService from "../services/IServices/IMedicalConditionService";
import { IMedicalConditionDTO } from "../dto/IMedicalConditionDTO";

@Service()
export default class MedicalConditionController  implements IMedicalConditionController {
  constructor(
      @Inject(config.services.medicalCondition.name) private medicalConditionServiceInstance : IMedicalConditionService
  ) {}

  public async findBycode(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      return this.medicalConditionServiceInstance.findByCode(req.params.code).then(medicalCondition => {
        return res.json(medicalCondition).status(200);
      });
    } catch (e) {
      return e;
    }
  }

  findAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      return this.medicalConditionServiceInstance.findAll().then(medicalConditions => {
        return res.json(medicalConditions).status(200);
      });
    } catch (e) {
      return e;
    }
  }

  public async createMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalConditionOrError = await this.medicalConditionServiceInstance.createMedicalCondition(req.body as IMedicalConditionDTO) as Result<IMedicalConditionDTO>;
        
      if (medicalConditionOrError.isFailure) {
        return res.status(402).send();
      }

      const medicalConditionDTO = medicalConditionOrError.getValue();
      return res.json( medicalConditionDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };



  public async getAllMedicalConditions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.medicalConditionServiceInstance.getAllMedicalConditions();
      if (result.isFailure) {
        return res.status(400).json(result.errorValue());
      }
      return res.status(200).json(result.getValue());
    } catch (error) {
      return next(error);
    }
  }







}