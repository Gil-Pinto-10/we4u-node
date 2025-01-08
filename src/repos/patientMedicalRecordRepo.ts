import { Document, FilterQuery, Model } from "mongoose";
import { Service, Inject } from 'typedi';
import { IPatientMedicalRecordPersistence } from "../dataschema/IPatientMedicalRecord";
import { PatientMedicalRecord } from "../domain/patientMedicalRecord/patientMedicalRecord";
import { PatientMedicalRecordMapper } from "../mappers/PatientMedicalRecordMapper";
import IPatientMedicalRecordRepo from "../services/IRepos/IPatientMedicalRecordRepo";
import { Allergie } from "../domain/allergie/allergie";
import { IAllergieDTO } from "../dto/IAllergieDTO";
import { IMedicalConditionDTO } from "../dto/IMedicalConditionDTO";

@Service()
export default class PatientMedicalRecordRepo implements IPatientMedicalRecordRepo {
  private models: any;

  constructor(
    @Inject('patientMedicalRecordSchema') private patientMedicalRecordSchema: Model<IPatientMedicalRecordPersistence & Document>,
  ) {}


  public async save(patientMedicalRecord: PatientMedicalRecord): Promise<PatientMedicalRecord> {
  
 
    const query = { patientMedicalRecordNumber: patientMedicalRecord.patientId } as FilterQuery<IPatientMedicalRecordPersistence & Document>;

    const patientMedicalRecordDocument = await this.patientMedicalRecordSchema.findOne(query);

    try {
      if (patientMedicalRecordDocument === null) {
        const rawMedicalCondition: any = PatientMedicalRecordMapper.toPersistence(patientMedicalRecord);

     

        const medicalConditionCreated = await this.patientMedicalRecordSchema.create(rawMedicalCondition);

        const patientMedicalRecordNew = PatientMedicalRecordMapper.toDomain(medicalConditionCreated);
        if (patientMedicalRecordNew == null) {
          throw new Error('Failed to map patient medical record to domain');
        }

        return patientMedicalRecordNew;
      } else {
        patientMedicalRecordDocument.patientMedicalRecordNumber = patientMedicalRecord.patientId;
        patientMedicalRecordDocument.records = patientMedicalRecord.records.values.map(recordLine => {
      
          return {
            recordReference: {
              code: recordLine.recordReference.code,
              description: recordLine.recordReference.description,
              designation: recordLine.recordReference.designation
            },
            recordType: recordLine.recordType
          };
        });
    
        await patientMedicalRecordDocument.save();
       
        return patientMedicalRecord;
      }
    } catch (err) {
      console.error(`Error in save: ${err}`);
      throw err;
    }
  }

 
  public async exists(t: PatientMedicalRecord): Promise<boolean> {
       const idX = t.id;

    const query = { domainId: idX };
    const deviceDocument = await this.patientMedicalRecordSchema.findOne(
      query as FilterQuery<IPatientMedicalRecordPersistence & Document>
    );

    return !!deviceDocument;
  }

 
public async findByMedicalRecordNumber(id: string): Promise<PatientMedicalRecord | null> {
  try {
    console.log(`Procurando PatientMedicalRecord com o número: ${id}`);
    const query = { patientMedicalRecordNumber: id } as FilterQuery<IPatientMedicalRecordPersistence & Document>;
    const patientMedicalRecordDocument = await this.patientMedicalRecordSchema.findOne(query);

    if (patientMedicalRecordDocument) {
      console.log(`PatientMedicalRecord encontrado: ${JSON.stringify(patientMedicalRecordDocument)}`);
      const patientMedicalRecord = PatientMedicalRecordMapper.toDomain(patientMedicalRecordDocument);
      console.log(`PatientMedicalRecord mapeado para domínio: ${JSON.stringify(patientMedicalRecord)}`);
      return patientMedicalRecord;
    } else {
      console.log(`PatientMedicalRecord com o número ${id} não encontrado`);
      return null;
    }
  } catch (error) {
    console.error(`Erro ao procurar PatientMedicalRecord com o número ${id}: ${error}`);
    throw error;
  }
}

public async findUnaddedAllergies(all: IAllergieDTO[], medicalRecord: PatientMedicalRecord): Promise<IAllergieDTO[]>{
  const addedAllergies: IAllergieDTO[] = [];

  medicalRecord.records.values.forEach(recordLine => {
    if (recordLine.recordType === 'ALLERGIE') {
      addedAllergies.push(recordLine.recordReference);
    }
  });

  const unaddedAllergies = all.filter(allergie => !addedAllergies.some(addedAllergie => addedAllergie.code === allergie.code));
  return unaddedAllergies;
}

public async findUnaddedMedicalConditions(all: IMedicalConditionDTO[], medicalRecord: PatientMedicalRecord): Promise<IMedicalConditionDTO[]> {
  const addedMedicalConditions: IMedicalConditionDTO[] = [];

  medicalRecord.records.values.forEach(recordLine => {
    if (recordLine.recordType === 'MEDICAL_CONDITION') {
      addedMedicalConditions.push({
        code: recordLine.recordReference.code,
        designation: recordLine.recordReference.designation,
        description: recordLine.recordReference.description,
        symptoms: [] // Add appropriate symptoms here if available
      });
    }
  });

  const unaddedMedicalConditions = all.filter(medicalCondition => !addedMedicalConditions.some(addedMedicalCondition => addedMedicalCondition.code === medicalCondition.code));
  return unaddedMedicalConditions

}

}
