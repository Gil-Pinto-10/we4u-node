import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";



interface MedicalConditionCodeProps {
    [key: string]: string;
    value: string;
  }

  export class MedicalConditionCode extends ValueObject<MedicalConditionCodeProps> {
    get value(): string {
      return this.props.value;
    }
  
    public constructor(props: MedicalConditionCodeProps) {
      super(props);
    }
  
    public static create(id: string): Result<MedicalConditionCode> {
       
        if (![8, 9, 11].includes(id.length)) {
          return Result.fail<MedicalConditionCode>('Medical Condition code must be 8, 9, or 11 characters to follow SNOMED CT');
        }
      
        if (!/^[a-zA-Z0-9]+$/.test(id)) {
          return Result.fail<MedicalConditionCode>('Medical Condition code must be alphanumeric');
        }
      
        return Result.ok<MedicalConditionCode>(new MedicalConditionCode({ value: id }));
      }
  }