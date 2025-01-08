
import { ISymptomPersistence } from "../dataschema/ISymptomPersistence";
import { Document, FilterQuery, Model } from "mongoose";
import { Service, Inject } from 'typedi';
import ISymptomRepo from "../services/IRepos/ISymptomRepo";
import { Symptom } from "../domain/Symptom/symptom";
import { SymptomMapper } from "../mappers/SymptomMapper";

@Service()
export default class SymptomRepo implements ISymptomRepo {
  private models: any;

  constructor(
    @Inject('symptomSchema') private symptomSchema : Model<ISymptomPersistence & Document>,
  ) {}

  public async save(symptom: Symptom): Promise<Symptom>  {
    const query = { domainId: symptom.id.toString()} as FilterQuery<ISymptomPersistence & Document>;

    const symptomDocument = await this.symptomSchema.findOne( query );

    try {
      if (symptomDocument === null ) {
        const rawSymptom: any = SymptomMapper.toPersistence(symptom);

        const symptomCreated = await this.symptomSchema.create(rawSymptom);

        const symptomNew =  SymptomMapper.toDomain(symptomCreated);
        if(symptomNew==null){
          throw new Error('Failed to map symptom to domain');
        }

        return symptomNew;

      } else {
        symptomDocument.description = symptom.description.value;
 
        await symptomDocument.save();

        return symptom;
      }
    } catch (err) {
      throw err;
    }
  }

 



  public async getAllSymptoms(): Promise<Symptom[]> {
 
    const symptomDocuments = await this.symptomSchema.find();
    const symptoms = symptomDocuments.map(doc => {
    
      return SymptomMapper.toDomain(doc);
    });
  
    return symptoms;
  }








  public async exists(t: Symptom): Promise<boolean> {
       const idX = t.id;

    const query = { domainId: idX };
    const deviceDocument = await this.symptomSchema.findOne(
      query as FilterQuery<ISymptomPersistence & Document>
    );

    return !!deviceDocument;
  }

 

}
