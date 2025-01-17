import config from '../config';
import cors, { CorsOptions } from 'cors';
import express, { NextFunction, Request, Response, json } from 'express';
import morgan from 'morgan';

import routes from '../api';

type RouteErr = {
  name: string;
  status: number;
  message: string;
};

export default ({ app }: { app: express.Application }) => {
  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(process.env.ENV === 'production' ? morgan('combined') : morgan('dev'));

  // we are using swagger to document our api
 // app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      const isOriginAllowed = !origin || config.cors.indexOf(origin) !== -1;
      callback(isOriginAllowed ? null : new Error('Bad Request'), origin);
    }
  };

  app.use(cors(corsOptions));

  // Middleware that transforms the raw string of req.body into json
  app.use(json());

  // Load API routes
  app.use(config.api.prefix, routes());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('NotFound');
    next({ ...err, status: 404, message: 'Not found' });
  });

  /// error handlers
//  app.use((err: RouteErr, req: Request, res: Response, next: NextFunction) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
 //   if (err.name === 'UnauthorizedError on '+req) {
  //    return res
   //     .status(err.status)
   //     .json({ message: err.message })
   //     .end();
  //  }
  //  return next(err);
//  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: RouteErr, req: Request, res: Response, _: NextFunction) => {
    if (process.env.NODE_ENV === 'development') console.log('FATAL ERROR: ', err);
    res.status(err.status || 500).json({
      errors: err instanceof Object ? err.message : err
    });
  });
};