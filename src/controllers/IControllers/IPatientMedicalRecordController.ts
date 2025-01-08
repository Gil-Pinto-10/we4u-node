import { NextFunction, Request, Response } from 'express';

export default interface IPatientMedicalRecordController {
 
    createPatientMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    addRecord(req: Request, res: Response, next: NextFunction);
    findByMedicalRecordNumber(req: Request, res: Response, next: NextFunction);
    findUnaddedAllergies(req: Request, res: Response, next: NextFunction);
    findUnaddedMedicalConditions(req: Request, res: Response, next: NextFunction);
}