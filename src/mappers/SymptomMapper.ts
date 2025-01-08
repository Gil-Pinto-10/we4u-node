import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Mapper } from "../core/infra/Mapper";
import { Document, Model } from "mongoose";
import { ISymptomDTO } from "../dto/ISymptomDTO";
import { Symptom } from "../domain/Symptom/symptom";
import { ISymptomPersistence } from "../dataschema/ISymptomPersistence";

export class SymptomMapper extends Mapper<Symptom> {
    public static toDTO(symptom: Symptom):ISymptomDTO{
      return {
        description: symptom.description.toString() 
      };
    }

    public static toDomain(raw: any): Symptom {
      const symptomOrError = Symptom.create({
        description: raw.description
      }, new UniqueEntityID(raw._id));
  
      if (symptomOrError.isFailure) {
        console.error(symptomOrError.error);
        throw new Error(symptomOrError.error.toString());
      }
  
      return symptomOrError.getValue();
    }
    
      public static toPersistence (symptom: Symptom): any {
        return {
          domainId: symptom.id.toString(),
          description: symptom.description.value.toString()
        }
      }



    }
