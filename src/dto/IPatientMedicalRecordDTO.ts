export interface IPatientMedicalRecordDTO {

    patientMedicalRecordNumber: string;
    records: {
      recordReference: {
        code: string;
      };
      recordType: string;
    }[];
  }