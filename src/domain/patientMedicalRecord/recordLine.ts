
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { ValueObject } from "../../core/domain/ValueObject";
import { RecordUnit } from "./recordUnit";
import { RecordTypeEnum } from "./recordTypeEnum";




interface RecordLineProps {
    recordReference: RecordUnit;
    recordType: RecordTypeEnum;
  }
  

  export class RecordLine extends ValueObject<RecordLineProps>{

 

    
      get recordReference(): RecordUnit{
        return this.props.recordReference;
      }
      get recordType(): RecordTypeEnum {
        return this.props.recordType;
      }
    
    
    public constructor(props: RecordLineProps) {
        super(props);
      }
    
    
    


      public static create(props: RecordLineProps): Result<RecordLine> {
   
          const guardedProps = [
            { argument: props.recordReference, argumentName: 'recordReference' },
            { argument: props.recordType, argumentName: 'recordType' }

          ];
      
          const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
      
          if (!guardResult.succeeded) {
            return Result.fail<RecordLine>(guardResult.message)
          }     
          else {
            const recordLine = new RecordLine({
              ...props
            });
      
            return Result.ok<RecordLine>(recordLine);
    
    
      }

    }
  }