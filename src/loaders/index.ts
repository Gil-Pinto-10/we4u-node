import { Express } from 'express';
import  config  from '../config';
import dependencyInjectorLoader from './dependencyInjector';
import expressLoader from './express';

import Logger from './logger';
import mongooseLoader from './mongoose';


export default async ({ expressApp }: { expressApp: Express }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');


  const allergieSchema = {
    // compare with the approach followed in repos and services
    name: 'allergieSchema',
    schema: '../persistence/schemas/allergieSchema',
  };

  const symptomSchema = {
    name: 'symptomSchema',
    schema: '../persistence/schemas/symptomSchema',
  };

  const medicalConditionSchema = {
    name: 'medicalConditionSchema',
    schema: '../persistence/schemas/medicalConditionSchema',
  };
  const patientMedicalRecordSchema = {
    name: 'patientMedicalRecordSchema',
    schema: '../persistence/schemas/patientMedicalRecordSchema',
  };

  const allergieController = {
    name: config.controllers.allergie.name,
    path: config.controllers.allergie.path
  }

  const symptomController = {
    name: config.controllers.symptom.name,
    path: config.controllers.symptom.path
  };

  const medicalConditionController = {
    name: config.controllers.medicalCondition.name,
    path: config.controllers.medicalCondition.path
  };

  const patientMedicalRecordController = {
    name: config.controllers.patientMedicalRecord.name,
    path: config.controllers.patientMedicalRecord.path
  };

  const allergieService = {
    name: config.services.allergie.name,
    path: config.services.allergie.path
  }
  const symptomService = {
    name: config.services.symptom.name,
    path: config.services.symptom.path
  };

  const medicalConditionService = {
    name: config.services.medicalCondition.name,
    path: config.services.medicalCondition.path
  };

  const patientMedicalRecordService = {
    name: config.services.patientMedicalRecord.name,
    path: config.services.patientMedicalRecord.path
  };

  const allergieRepo = {
    name: config.repos.allergie.name,
    path: config.repos.allergie.path
  }
  const symptomRepo = {
    name: config.repos.symptom.name,
    path: config.repos.symptom.path
  };


  const medicalConditionRepo = {
    name: config.repos.medicalCondition.name,
    path: config.repos.medicalCondition.path
  };

  const patientMedicalRecordRepo = {
    name: config.repos.patientMedicalRecord.name,
    path: config.repos.patientMedicalRecord.path
  };

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
         allergieSchema,
      symptomSchema,
      medicalConditionSchema,
      patientMedicalRecordSchema
    
    ],
    controllers: [
      allergieController,
      symptomController,
      medicalConditionController,
      patientMedicalRecordController

    ],
    repos: [
      allergieRepo,
      symptomRepo,
      medicalConditionRepo,
      patientMedicalRecordRepo
    
    ],
    services: [
      allergieService,
      symptomService,
      medicalConditionService,
      patientMedicalRecordService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');


  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');


};

