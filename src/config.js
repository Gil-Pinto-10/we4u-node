import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
  
   */
  port: parseInt(process.env.PORT, 10) || 4000,

  planningApiUrl: process.env.PLANNING_API_URL || 'http://localhost:8080',

  

  databaseURL: process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.cg38r.mongodb.net/lapr5?retryWrites=true&w=majority',

  allowedEmailDomains: process.env.ALLOWED_EMAIL_DOMAINS
    ? (JSON.parse(process.env.ALLOWED_EMAIL_DOMAINS ) )
    : '*',
  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || 'my sakdfho2390asjod$%jl)!sdjas0i secret',

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info'
  },


  controllers: {
    allergie: {
      name: "AllergieController",
      path: "../controllers/allergieController"
    },
    symptom: {
    name: "SymptomController",
    path: "../controllers/symptomController"
  },
  medicalCondition: {
    name: "MedicalConditionController",
    path: "../controllers/medicalConditionController"
  },
  patientMedicalRecord: {
    name: "PatientMedicalRecordController",
    path: "../controllers/patientMedicalRecordController"
  }
},

  repos: {
    allergie: {
      name: "RoleRepo",
      path: "../repos/allergieRepo"
    },
    symptom: {
      name: "SymptomRepo",
      path: "../repos/symptomRepo"
    },
    medicalCondition: {
      name: "MedicalConditionRepo",
      path: "../repos/medicalConditionRepo"
    },
    patientMedicalRecord: {
      name: "PatientMedicalRecordRepo",
      path: "../repos/patientMedicalRecordRepo"
    }
  },

  services: {
    allergie: {
      name: "RoleService",
      path: "../services/allergieService"
    },
    symptom: {
      name: "SymptomService",
      path: "../services/symptomService"
    },
    medicalCondition: {
      name: "MedicalConditionService",
      path: "../services/medicalConditionService"
    },
    patientMedicalRecord: {
      name: "PatientMedicalRecordService",
      path: "../services/patientMedicalRecordService"
    }
  },



  /**
   * API configs
   */
  api: {
    prefix: '/api'
  },

  /**
   * Array of allowed origin domains for any CORS 
   */
  cors: 'http://localhost:4200' || 'http://we4u-9pl3-git-main-gil-pintos-projects.vercel.app',

};