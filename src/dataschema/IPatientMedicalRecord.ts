export interface IPatientMedicalRecordPersistence {
    domainId: string;
    patientMedicalRecordNumber: string;
    records: {
      recordReference: {
        code: string;
        description: string;
        designation: string;
      };
      recordType: string;
    }[];
  }