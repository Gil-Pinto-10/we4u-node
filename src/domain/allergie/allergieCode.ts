import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";



interface AllergieCodeProps {
    [key: string]: string;
    value: string;
  }

  export class AllergieCode extends ValueObject<AllergieCodeProps> {
    get value(): string {
      return this.props.value;
    }
  
    public constructor(props: AllergieCodeProps) {
      super(props);
    }
  
    public static create(id: string): Result<AllergieCode> {
       
        if (![8, 9, 11].includes(id.length)) {
          return Result.fail<AllergieCode>('Allergie code must be 8, 9, or 11 characters to follow SNOMED CT');
        }
      
        if (!/^[a-zA-Z0-9]+$/.test(id)) {
          return Result.fail<AllergieCode>('Allergie code must be alphanumeric');
        }
      
        return Result.ok<AllergieCode>(new AllergieCode({ value: id }));
      }
  }