import config from "../config";
import { Result } from "../core/logic/Result";
import { IAllergieDTO } from "../dto/IAllergieDTO";
import IAllergieService from "../services/IServices/IAllergieService";
import { Inject, Service } from "typedi";
import { Request, Response, NextFunction } from 'express';
import IAllergieController from "./IControllers/IAllergieController";
import { BaseController } from "../core/infra/BaseController";

@Service()
export default class AllergieController  implements IAllergieController {
  constructor(
      @Inject(config.services.allergie.name) private allergieServiceInstance : IAllergieService
  ) {}


  public async findBycode(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const code = req.params.code;
      const allergieOrError = await this.allergieServiceInstance.findByCode(code);

      if (allergieOrError.equals(null)) {
        return res.status(404).send();
      }

      const allergieDTO = allergieOrError;
      return res.json(allergieDTO).status(200);
    } catch (e) {
      return next(e);
    }
  }

  public async createAllergie(req: Request, res: Response, next: NextFunction) {
    try {
      const allergieOrError = await this.allergieServiceInstance.createAllergie(req.body as IAllergieDTO) as Result<IAllergieDTO>;
        
      if (allergieOrError.isFailure) {
        return res.status(402).send();
      }

      const allergieDTO = allergieOrError.getValue();
      return res.json( allergieDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  public async getAllergies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const allergies = await this.allergieServiceInstance.findAll();

      // Mapear os dados para AllergyDTO
      const allergyDTOs = allergies.map((allergy) => ({
        
        code: allergy.props.code.props.value,
        designation: allergy.props.designation.props.value,
        description: allergy.props.description.props.value,
      }));

      res.status(200).json(allergyDTOs);
    } catch (error) {
      next(error);
    }
  }
  

  public async getAllAllergies(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.allergieServiceInstance.getAllAllergies();
      if (result.isFailure) {
        return res.status(400).json(result.errorValue());
      }
      return res.status(200).json(result.getValue());
    } catch (error) {
      return next(error);
    }
  }


}