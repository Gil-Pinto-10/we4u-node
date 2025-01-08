
import mongoose from 'mongoose';
import { IAllergiePersistence } from '../../dataschema/IAllergiePersistence';

const AllergieSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    designation: { type: String, unique: true, required: true },
    description: { type: String, unique: false },
    
}
);

export default mongoose.model<IAllergiePersistence & mongoose.Document>('Allergie', AllergieSchema);
