import mongoose from 'mongoose';
import { IPatientMedicalRecordPersistence } from '../../dataschema/IPatientMedicalRecord';

const PatientMedicalRecordSchema = new mongoose.Schema({
  domainId: { type: String, required: true ,unique: true},
  patientMedicalRecordNumber: { type: String, required: true ,unique: true},
  records: [
    {
      recordReference: {
        code: { type: String, required: true },
        description: { type: String, required: false },
        designation: { type: String, required: true }
      },
      recordType: { type: String, required: true }
    }
  ]
});

export default mongoose.model<IPatientMedicalRecordPersistence & mongoose.Document>('PatientMedicalRecord', PatientMedicalRecordSchema);