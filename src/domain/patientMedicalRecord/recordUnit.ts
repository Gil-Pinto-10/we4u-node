
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { ValueObject } from "../../core/domain/ValueObject";



interface RecordUnitProps {
    code: string;
    description: string;
    designation: string;
  }
  

  export class RecordUnit extends ValueObject<RecordUnitProps>{

 

    get code(): string {
        return this.props.code;
      }
    
      get designation(): string{
        return this.props.designation;
      }
      get description(): string | undefined {
        return this.props.description;
      }
    
    
    private constructor(props: RecordUnitProps) {
        super(props);
      }
    
    
    


      public static create(props: RecordUnitProps): Result<RecordUnit> {
        const guardedProps = [
          { argument: props.code, argumentName: 'code' },
          { argument: props.description, argumentName: 'description' },
          { argument: props.designation, argumentName: 'designation' }
        ];
    
        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    
        if (!guardResult.succeeded) {
          return Result.fail<RecordUnit>(guardResult.message);
        } else {
          const recordUnit = new RecordUnit({
            ...props
          });
    
          return Result.ok<RecordUnit>(recordUnit);
        }
      }
  }