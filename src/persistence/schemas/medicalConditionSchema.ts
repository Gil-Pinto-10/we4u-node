import mongoose from 'mongoose';
import { IMedicalConditionPersistence } from '../../dataschema/IMedicalConditionPersistence';

const MedicalConditionSchema = new mongoose.Schema({
  domainId: { type: String, unique: true, required: true },
  code: { type: String, required: true ,unique: true},
  designation: { type: String, required: true ,unique: true},
  description: { type: String, required: false },
  symptoms: [{ type: String, required: true }]
});

export default mongoose.model<IMedicalConditionPersistence & mongoose.Document>('MedicalCondition', MedicalConditionSchema);