import { AggregateRoot } from "../../core/domain/AggregateRoot";

import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

import { SymptomDescription } from "./symptomDescription";
import { symptomId } from "./symptomId";



interface SymptomProps {
  
    description: SymptomDescription;

  }
  

  export class Symptom extends AggregateRoot<SymptomProps>{

    get id(): UniqueEntityID{
        return this._id;
    }

    get symptomId (): symptomId {
      return new symptomId(this.symptomId.toValue());
    }

      get description(): SymptomDescription {
        return this.props.description;
      }
    
    
    private constructor(props: SymptomProps, id?: UniqueEntityID) {
        super(props, id);
      }
    
    
    


      public static create(props: SymptomProps, id?: UniqueEntityID): Result<Symptom> {
   
          const guardedProps = [
       
            { argument: props.description, argumentName: 'description' }
           

          ];
      
          const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
      
          if (!guardResult.succeeded) {
            return Result.fail<Symptom>(guardResult.message)
          }     
          else {
            const symptom = new Symptom({
              ...props
            }, id);
      
            return Result.ok<Symptom>(symptom);
    
    
      }

    }
  }