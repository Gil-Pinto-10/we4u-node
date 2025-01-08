import 'reflect-metadata'; // We need this in order to use @Decorators

import config from './config';
import cors from 'cors'; 

import express from 'express';

import Logger from './loaders/logger';

async function startServer() {
  
  const app = express();

  app.options('*', cors()); // Handle all OPTIONS requests for preflight



  app.use(cors({
    origin: ['https://www.we4u.pt', 'https://we4u-node.onrender.com', 'https://we4u-api.onrender.com'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  }));

  app.use((req, res, next) => {
    console.log('Request Origin:', req.get('Origin'));  // Log the request origin
    next();
  });

  app.use((err, req, res, next) => {
    Logger.error('Error caught in middleware:', err);  // Log any caught errors
    res.status(500).send({ error: 'Internal Server Error' });  // Send 500 status with an error message
  });
  

  await require('./loaders').default({ expressApp: app });


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
