import { NextFunction, Request, Response } from 'express';

export default interface IMedicalConditionController {
 
    createMedicalCondition(req: Request, res: Response, next: NextFunction): Promise<Response | void>;

    findAll(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    findBycode(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
        getAllMedicalConditions(req: Request, res: Response, next: NextFunction);

}