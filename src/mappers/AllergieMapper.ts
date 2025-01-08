import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Mapper } from "../core/infra/Mapper";
import { IAllergiePersistence } from "../dataschema/IAllergiePersistence";
import { Allergie } from "../domain/allergie/allergie";
import { AllergieCode } from "../domain/allergie/allergieCode";
import { AllergieDescription } from "../domain/allergie/allergieDescription";
import { AllergieDesignation } from "../domain/allergie/allergieDesignation";
import { IAllergieDTO } from "../dto/IAllergieDTO";
import { Document, Model } from "mongoose";

export class AllergieMapper extends Mapper<Allergie> {
    public static toDTO(allergie: Allergie): Omit<IAllergieDTO, 'allergieCode'> {
      return {
        code: allergie.code.value,
        designation: allergie.designation.value,
        description: allergie.description?.value
      };
    }
    public static async toDomain(allergie: IAllergiePersistence): Promise<Allergie | null> {
      const code = AllergieCode.create(allergie.code).getValue();
      const designation = AllergieDesignation.create(allergie.designation).getValue();
      const description = allergie.description
        ? AllergieDescription.create(allergie.description).getValue()
        : undefined;
  
      const allergieOrError = Allergie.create(
        {
          code,
          designation,
          description
        },
        new UniqueEntityID(allergie.domainId)
      );
  
      allergieOrError.isFailure ? console.log(allergieOrError.error) : '';
  
      return allergieOrError.isSuccess ? allergieOrError.getValue() : null;
    }
    
      public static toPersistence (allergie: Allergie): any {
        return {
          domainId: allergie.id.toString(),
          code: allergie.code.value,
          designation: allergie.designation.value,
          description: allergie.description?.value
        };
      }



    }
