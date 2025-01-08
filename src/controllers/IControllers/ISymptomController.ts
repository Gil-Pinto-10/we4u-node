import { NextFunction, Request, Response } from 'express';

export default interface ISymptomController {
 
    createSymptom(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    getAllSymptoms(req: Request, res: Response, next: NextFunction);
}