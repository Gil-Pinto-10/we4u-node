import { Container} from 'typedi';

import winston from 'winston';

import config from '../../config';

import IAllergieRepo from '../../services/IRepos/IAllergieRepo';

/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req: any, res: any, next: any) => {
  const Logger = Container.get('logger') as winston.Logger;
  try {
    
    const allergieRepo = Container.get(config.repos.allergie.name) as IAllergieRepo

    if( !req.token || req.token == undefined )
      next( new Error("Token inexistente ou inválido ") );

    const id = req.token.id;

    const isFound = await allergieRepo.exists( id );

    if (isFound)
      next();
    else
      next( new Error("Token não corresponde a qualquer utilizador do sistema") );
  } catch (e) {
    Logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachCurrentUser;
