
import { Service, Inject } from 'typedi';
import config from "../config";
import { Result } from "../core/logic/Result";
import ISymptomRepo from "./IRepos/ISymptomRepo";
import { ISymptomDTO } from "../dto/ISymptomDTO";
import { Symptom } from '../domain/Symptom/symptom';
import { SymptomMapper } from "../mappers/SymptomMapper";
import ISymptomService from "./IServices/ISymptomService";
import { SymptomDescription } from '../domain/Symptom/symptomDescription';

@Service()
export default class SymptomService implements ISymptomService {
  constructor(
      @Inject(config.repos.symptom.name) private symptomRepo : ISymptomRepo,
  ) {}
  public async createSymptom(SymptomDTO: ISymptomDTO): Promise<Result<ISymptomDTO>> {
    try {
    
      const symptomDescriptionOrError = SymptomDescription.create(SymptomDTO.description);

      if(symptomDescriptionOrError.isFailure)
        return Result.fail<ISymptomDTO>(symptomDescriptionOrError.errorValue());
      const description = symptomDescriptionOrError.getValue();

      const symptomOrError = Symptom.create( {
        description
        
      }
       );

      if (symptomOrError.isFailure) {
        return Result.fail<ISymptomDTO>(symptomOrError.errorValue());
      }

      const symptomResult = symptomOrError.getValue();

      await this.symptomRepo.save(symptomResult);

      const symptomDTOResult = SymptomMapper.toDTO( symptomResult ) as ISymptomDTO;
      return Result.ok<ISymptomDTO>( symptomDTOResult )
    } catch (e) {
      throw e;
    }
  }


  public async getAllSymptoms(): Promise<Result<ISymptomDTO[]>> {
    try {
      const symptoms = await this.symptomRepo.getAllSymptoms();
      const symptomDTOs = symptoms.map(symptom => {
        try {
          return SymptomMapper.toDTO(symptom) as ISymptomDTO;
        } catch (error) {
          throw error;
        }
      });
      return Result.ok<ISymptomDTO[]>(symptomDTOs);
    } catch (error) {
      return Result.fail<ISymptomDTO[]>(error);
    }
  }



  
}
