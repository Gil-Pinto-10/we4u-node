import config from "../config";
import { Result } from "../core/logic/Result";
import { Inject, Service } from "typedi";
import { Request, Response, NextFunction } from 'express';
import ISymptomService from "../services/IServices/ISymptomService";
import { ISymptomDTO } from "../dto/ISymptomDTO";
import ISymptomController from "./IControllers/ISymptomController";

@Service()
export default class SymptomController  implements ISymptomController {
  constructor(
      @Inject(config.services.symptom.name) private symptomServiceInstance : ISymptomService
  ) {}


  public async getAllSymptoms(req: Request, res: Response, next: NextFunction) {
    try {
    
      const result = await this.symptomServiceInstance.getAllSymptoms();
      if (result.isFailure) {
        return res.status(400).json(result.errorValue());
      }
  
      return res.status(200).json(result.getValue());
    } catch (error) {
      return next(error);
    }
  }



  public async createSymptom(req: Request, res: Response, next: NextFunction) {
    try {
      const symptomOrError = await this.symptomServiceInstance.createSymptom(req.body as ISymptomDTO) as Result<ISymptomDTO>;
        
      if (symptomOrError.isFailure) {
        return res.status(402).send();
      }

      const symptomDTO = symptomOrError.getValue();
      return res.json( symptomDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };



}