"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const cors_1 = __importDefault(require("cors"));
const express_1 = require("express");
const morgan_1 = __importDefault(require("morgan"));
const api_1 = __importDefault(require("../api"));
exports.default = ({ app }) => {
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
    app.use(process.env.ENV === 'production' ? (0, morgan_1.default)('combined') : (0, morgan_1.default)('dev'));
    // we are using swagger to document our api
    // app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy');
    // The magic package that prevents frontend developers going nuts
    const corsOptions = {
        origin: (origin, callback) => {
            const isOriginAllowed = !origin || config_1.default.cors.indexOf(origin) !== -1;
            callback(isOriginAllowed ? null : new Error('Bad Request'), origin);
        }
    };
    app.use((0, cors_1.default)(corsOptions));
    // Middleware that transforms the raw string of req.body into json
    app.use((0, express_1.json)());
    // Load API routes
    app.use(config_1.default.api.prefix, (0, api_1.default)());
    /// catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error('NotFound');
        next(Object.assign(Object.assign({}, err), { status: 404, message: 'Not found' }));
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
    app.use((err, req, res, _) => {
        if (process.env.NODE_ENV === 'development')
            console.log('FATAL ERROR: ', err);
        res.status(err.status || 500).json({
            errors: err instanceof Object ? err.message : err
        });
    });
};
//# sourceMappingURL=express.js.map