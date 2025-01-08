 
import mongoose from 'mongoose';
import { ISymptomPersistence } from '../../dataschema/ISymptomPersistence';

const SymptomSchema = new mongoose.Schema({
    description: { type: String, unique: true, required: true },
    
}
);

export default mongoose.model<ISymptomPersistence & mongoose.Document>('Symptom', SymptomSchema);
