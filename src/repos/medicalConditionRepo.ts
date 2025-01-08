import { Document, FilterQuery, Model } from "mongoose";
import { Service, Inject } from 'typedi';
import IMedicalConditionRepo from "../services/IRepos/IMedicalConditionRepo";
import { IMedicalConditionPersistence } from "../dataschema/IMedicalConditionPersistence";
import { MedicalCondition } from "../domain/medicalCondition/medicalCondition";
import { MedicalConditionMapper } from "../mappers/MedicalConditionMapper";

@Service()
export default class MedicalConditionRepo implements IMedicalConditionRepo {
  private models: any;

  constructor(
    @Inject('medicalConditionSchema') private medicalConditionSchema: Model<IMedicalConditionPersistence & Document>,
  ) {}
  
  async findAll(): Promise<MedicalCondition[]> {
    try {
      const medicalConditionRecords = await this.medicalConditionSchema.find();
      const medicalConditionPromises = medicalConditionRecords.map(record => MedicalConditionMapper.toDomain(record));
      return Promise.all(medicalConditionPromises);
    } catch (e) {
      throw e;  
  }
}


  public async save(medicalCondition: MedicalCondition): Promise<MedicalCondition>  {
    const query = { domainId: medicalCondition.id.toString()} as FilterQuery<IMedicalConditionPersistence & Document>;

    const medicalConditionDocument = await this.medicalConditionSchema.findOne( query );

    try {
      if (medicalConditionDocument === null ) {
        const rawMedicalCondition: any = MedicalConditionMapper.toPersistence(medicalCondition);

        const medicalConditionCreated = await this.medicalConditionSchema.create(rawMedicalCondition);

        const medicalConditionNew =  MedicalConditionMapper.toDomain(medicalConditionCreated);
        if(medicalConditionNew==null){
          throw new Error('Failed to map medical condition to domain');
        }

        return medicalConditionNew;

      } else {
        medicalConditionDocument.description = medicalCondition.description?.value;
        medicalConditionDocument.code = medicalCondition.code.value;
        medicalConditionDocument.designation = medicalCondition.designation.value;
        medicalConditionDocument.symptoms = medicalCondition.symptoms.values.map(symptom => symptom.value);
        await medicalConditionDocument.save();

        return medicalCondition;
      }
    } catch (err) {
      throw err;
    }
  }

  public async getAllMedicalConditions(): Promise<MedicalCondition[]> {
    const medicalConditionDocuments = await this.medicalConditionSchema.find();
    const medicalConditions = await Promise.all(medicalConditionDocuments.map(doc => MedicalConditionMapper.toDomain(doc)));
    return medicalConditions;
  }



 
  public async exists(t: MedicalCondition): Promise<boolean> {
       const idX = t.id;

    const query = { domainId: idX };
    const deviceDocument = await this.medicalConditionSchema.findOne(
      query as FilterQuery<IMedicalConditionPersistence & Document>
    );

    return !!deviceDocument;
  }

  public async findByCode(code: string): Promise<MedicalCondition | null> {
    const query = { code } as FilterQuery<IMedicalConditionPersistence & Document>;
    const medicalConditionDocument = await this.medicalConditionSchema.findOne(query);

    if (medicalConditionDocument) {
      return MedicalConditionMapper.toDomain(medicalConditionDocument);
    } else {
      return null;
    }
  }

}
