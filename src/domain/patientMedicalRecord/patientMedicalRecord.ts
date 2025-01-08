import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { RecordSet } from "./recordSet";
import { RecordUnit } from "./recordUnit";
import { RecordTypeEnum } from "./recordTypeEnum";



interface PatientMedicalRecordProps {
    records: RecordSet;
    patientMedicalRecordNumber: string; // needs to hbe valitated in the service with the .net backend
  
  }
  

  export class PatientMedicalRecord extends AggregateRoot<PatientMedicalRecordProps>{

    get id(): UniqueEntityID{
        return this._id;
    }

    get patientId (): string {
      return this.props.patientMedicalRecordNumber;
    }

    get records (): RecordSet {
      return this.props.records;
    }

    
    private constructor(props: PatientMedicalRecordProps, id?: UniqueEntityID) {
        super(props, id);
      }
    
  
      public static create(props: PatientMedicalRecordProps, id?: UniqueEntityID): Result<PatientMedicalRecord> {
   
          const guardedProps = [
            { argument: props.patientMedicalRecordNumber, argumentName: 'patientMedicalRecordNumber' },
            { argument: props.records, argumentName: 'records' }

          ];
      
          const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
      
          if (!guardResult.succeeded) {
            return Result.fail<PatientMedicalRecord>(guardResult.message)
          }     
          else {
            const medicalCondition = new PatientMedicalRecord({
              ...props
            }, id);
      
            return Result.ok<PatientMedicalRecord>(medicalCondition);
    
    
      }
    }
    public addRecordUnit(unit: RecordUnit, type: RecordTypeEnum): Result<void> {
      
      return this.records.addRecord(unit, type);
    }

  }