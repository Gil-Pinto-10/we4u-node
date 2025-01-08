import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { AllergieCode } from "./allergieCode";
import { AllergieDescription } from "./allergieDescription";
import { AllergieDesignation } from "./allergieDesignation";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { allergieId } from "./allergieId";


interface AllergieProps {
    code: AllergieCode;
    description: AllergieDescription;
    designation: AllergieDesignation;
  }
  

  export class Allergie extends AggregateRoot<AllergieProps>{

    get id(): UniqueEntityID{
        return this._id;
    }

    get allergieId (): string {
      return this._id.toString();
    }

    get code(): AllergieCode {
        return this.props.code;
      }
    
      get designation(): AllergieDesignation{
        return this.props.designation;
      }
      get description(): AllergieDescription | undefined {
        return this.props.description;
      }
    
    
    private constructor(props: AllergieProps, id?: UniqueEntityID) {
        super(props, id);
      }
    
    
    


      public static create(props: AllergieProps, id?: UniqueEntityID): Result<Allergie> {
   
          const guardedProps = [
            { argument: props.code, argumentName: 'code' },
            { argument: props.description, argumentName: 'description' },
            { argument: props.designation, argumentName: 'designation' }

          ];
      
          const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
      
          if (!guardResult.succeeded) {
            return Result.fail<Allergie>(guardResult.message)
          }     
          else {
            const allergie = new Allergie({
              ...props
            }, id);
      
            return Result.ok<Allergie>(allergie);
    
    
      }

    }
  }