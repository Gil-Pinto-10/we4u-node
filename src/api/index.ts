import { Router } from 'express';

import allergieRoute from './routes/allergieRoute';
import symptomRoute from './routes/symptomRoute';
import medicalConditionRoute from './routes/medicalConditionRoute';
import patientMedicalRecordRoute from './routes/patientMedicalRecordRoute';
export default () => {
    const app = Router();
  
    allergieRoute(app);
    symptomRoute(app);
    medicalConditionRoute(app);
    patientMedicalRecordRoute(app);
    return app;
  };