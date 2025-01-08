
//import { injectable } from "inversify";
import IAllergieService from "./IServices/IAllergieService";
import { Service, Inject } from 'typedi';
import IAllergieRepo from "./IRepos/IAllergieRepo";
import config from "../config";
import { Result } from "../core/logic/Result";
import { IAllergieDTO } from "../dto/IAllergieDTO";
import { Allergie } from "../domain/allergie/allergie";
import { AllergieMapper } from "../mappers/AllergieMapper";
import { AllergieCode } from "../domain/allergie/allergieCode";
import { AllergieDesignation } from "../domain/allergie/allergieDesignation";
import { AllergieDescription } from "../domain/allergie/allergieDescription";

@Service()
export default class AllergieService implements IAllergieService {
  constructor(
    @Inject(config.repos.allergie.name) private allergieRepo: IAllergieRepo
  ) {}

  public async findByCode(code: string): Promise<Allergie | null> {
    try {
      const allergie = await this.allergieRepo.findByCode(code);
      return allergie;
    } catch (error) {
      console.error('Error while fetching allergie by code:', error);
      throw error;
    }
  }


  public async createAllergie(AllergieDTO: IAllergieDTO): Promise<Result<IAllergieDTO>> {
    try {

      const allergieCodeOrError = AllergieCode.create(AllergieDTO.code);

      if(allergieCodeOrError.isFailure)
        return Result.fail<IAllergieDTO>(allergieCodeOrError.errorValue());
      const code = allergieCodeOrError.getValue();

     // DO THIS!!!!
      // const allergieCheckUnique = await this.allergieRepo.findByID();

      const allergieDesignationOrError = AllergieDesignation.create(AllergieDTO.designation);

      if(allergieDesignationOrError.isFailure)
        return Result.fail<IAllergieDTO>(allergieDesignationOrError.errorValue());
      const designation = allergieDesignationOrError.getValue();

      const allergieDescriptionOrError = AllergieDescription.create(AllergieDTO.description);

      if(allergieDescriptionOrError.isFailure)
        return Result.fail<IAllergieDTO>(allergieDescriptionOrError.errorValue());
      const description = allergieDescriptionOrError.getValue();

      const allergieOrError = Allergie.create( {
        code,
        designation,
        description
        
      }
       );

      if (allergieOrError.isFailure) {
        return Result.fail<IAllergieDTO>(allergieOrError.errorValue());
      }

      const allergieResult = allergieOrError.getValue();

      await this.allergieRepo.save(allergieResult);

      const allergieDTOResult = AllergieMapper.toDTO( allergieResult ) as IAllergieDTO;
      return Result.ok<IAllergieDTO>( allergieDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async findAll(): Promise<Allergie[]> {

    try {
    const allergieOrError = await this.allergieRepo.findAll();
    return allergieOrError;
    }catch (error) {
      // Handle any errors, log them, and return a Result indicating failure
      console.error('Error while fetching allergies:', error);
      throw error;
    }
  }


    public async getAllAllergies(): Promise<Result<IAllergieDTO[]>> {
      try {
        const allergies = await this.allergieRepo.getAllAllergies();
        const allergiesDTOs = allergies.map(allergie => AllergieMapper.toDTO(allergie) as IAllergieDTO);
        return Result.ok<IAllergieDTO[]>(allergiesDTOs);
      } catch (error) {
        return Result.fail<IAllergieDTO[]>(error);
      }
    }

}
