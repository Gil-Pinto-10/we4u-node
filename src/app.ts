import 'reflect-metadata'; // We need this in order to use @Decorators

import config from './config';
import cors from 'cors'; 

import express from 'express';

import Logger from './loaders/logger';

async function startServer() {
  const app = express();

  await require('./loaders').default({ expressApp: app });


  app.use(cors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  }));

  app.use((req, res, next) => {
    console.log('Request Origin:', req.get('Origin'));  // Log the request origin
    next();
  });



  app.listen(config.port, () => {

    console.log("Server listening on port: " + config.port);

    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
    })
    .on('error', (err) => {      
      Logger.error(err);
      process.exit(1);
      return;
  });
}

startServer();
