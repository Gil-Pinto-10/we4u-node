import config from "../config";
import { Result } from "../core/logic/Result";
import { Inject, Service } from "typedi";
import { Request, Response, NextFunction } from 'express';
import IPatientMedicalRecordController from "./IControllers/IPatientMedicalRecordController";
import IPatientMedicalRecordService from "../services/IServices/IPatientMedicalRecordService";
import { IPatientMedicalRecordDTO } from "../dto/IPatientMedicalRecordDTO";


@Service()
export default class PatientMedicalRecordController  implements IPatientMedicalRecordController {
  constructor(
      @Inject(config.services.patientMedicalRecord.name) private patientMedicalRecordServiceInstance : IPatientMedicalRecordService
  ) {}

  public async createPatientMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const pmrOrError = await this.patientMedicalRecordServiceInstance.createPatientMedicalRecord(req.body as IPatientMedicalRecordDTO) as Result<IPatientMedicalRecordDTO>;
        
      if (pmrOrError.isFailure) {
        return res.status(400).json({ error: pmrOrError.errorValue() });
      }

      const pmrDTO = pmrOrError.getValue();
      return res.json( pmrDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  public async addRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientMedicalRecordNumber, code, recordType } = req.body;

      const result = await this.patientMedicalRecordServiceInstance.addRecord(patientMedicalRecordNumber, code, recordType);

      if (result.isFailure) {
        return res.status(400).json({ error: result.errorValue() });
      }

      return res.status(200).send(result.getValue());
    } catch (error) {
      return next(error);
    }
  }

  public async findByMedicalRecordNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientMedicalRecordNumber } = req.params;

      const result = await this.patientMedicalRecordServiceInstance.findByMedicalRecordNumber(patientMedicalRecordNumber);

      if (result.isFailure) {
        return res.status(400).json({ error: result.errorValue() });
      }

      return res.status(200).send(result.getValue());
    } catch (error) {
      return next(error);
    }
  }

  public async findUnaddedAllergies(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientMedicalRecordNumber } = req.params;

      const result = await this.patientMedicalRecordServiceInstance.findUnaddedAllergies(patientMedicalRecordNumber);

      return res.status(200).send(result);
    } catch (error) {
      return next(error);
    }
  }

  public async findUnaddedMedicalConditions(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientMedicalRecordNumber } = req.params;

      const result = await this.patientMedicalRecordServiceInstance.findUnaddedMedicalConditions(patientMedicalRecordNumber);

      return res.status(200).send(result);
    } catch (error) {
      return next(error);
    }
  }


}