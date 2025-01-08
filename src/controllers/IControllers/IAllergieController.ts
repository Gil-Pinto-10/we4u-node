import { NextFunction, Request, Response } from 'express';

export default interface IAllergieController {
 
    createAllergie(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    getAllergies(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    findBycode(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    getAllAllergies(req: Request, res: Response, next: NextFunction);
}