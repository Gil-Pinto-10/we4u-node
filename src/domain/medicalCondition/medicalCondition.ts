import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { MedicalConditionCode } from "./medicalConditionCode";
import { MedicalConditionDescription } from "./medicalConditionDescription";
import { MedicalConditionDesignation } from "./medicalConditionDesignation";
import { medicalConditionId } from "./medicalConditionId";
import { SymptomsSet } from "./symptomsSet";
import { SymptomDescription } from "../Symptom/symptomDescription";



interface MedicalConditionProps {
    code: MedicalConditionCode;
    description: MedicalConditionDescription;
    designation: MedicalConditionDesignation;
    symptoms: SymptomsSet;
  }
  

  export class MedicalCondition extends AggregateRoot<MedicalConditionProps>{

    get id(): UniqueEntityID{
        return this._id;
    }

    get medicalConditionId (): medicalConditionId {
      return new medicalConditionId(this.medicalConditionId.toValue());
    }

    get symptoms (): SymptomsSet {
      return this.props.symptoms;
    }

    get code(): MedicalConditionCode {
        return this.props.code;
      }
    
      get designation(): MedicalConditionDesignation{
        return this.props.designation;
      }
      get description(): MedicalConditionDescription | undefined {
        return this.props.description;
      }
    
    
    private constructor(props: MedicalConditionProps, id?: UniqueEntityID) {
        super(props, id);
      }
    
  
      public static create(props: MedicalConditionProps, id?: UniqueEntityID): Result<MedicalCondition> {
   
          const guardedProps = [
            { argument: props.code, argumentName: 'code' },
            { argument: props.description, argumentName: 'description' },
            { argument: props.designation, argumentName: 'designation' },
            { argument: props.symptoms, argumentName: 'symptoms' }

          ];
      
          const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
      
          if (!guardResult.succeeded) {
            return Result.fail<MedicalCondition>(guardResult.message)
          }     
          else {
            const medicalCondition = new MedicalCondition({
              ...props
            }, id);
      
            return Result.ok<MedicalCondition>(medicalCondition);
    
    
      }
    }
    public addSymptom(symptomDescription: SymptomDescription): Result<void> {
      return this.props.symptoms.addSymptom(symptomDescription);
    }

  }