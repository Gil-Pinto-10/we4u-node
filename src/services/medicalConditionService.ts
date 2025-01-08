import { Service, Inject } from 'typedi';
import config from '../config';
import { Result } from '../core/logic/Result';
import { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';
import IMedicalConditionRepo from './IRepos/IMedicalConditionRepo';
import { MedicalCondition } from '../domain/medicalCondition/medicalCondition';
import { MedicalConditionMapper } from '../mappers/MedicalConditionMapper';
import { MedicalConditionCode } from '../domain/medicalCondition/medicalConditionCode';
import { MedicalConditionDesignation } from '../domain/medicalCondition/medicalConditionDesignation';
import { MedicalConditionDescription } from '../domain/medicalCondition/medicalConditionDescription';
import { SymptomsSet } from '../domain/medicalCondition/symptomsSet';
import { SymptomDescription } from '../domain/Symptom/symptomDescription';
import IMedicalConditionService from './IServices/IMedicalConditionService';

@Service()
export default class MedicalConditionService implements IMedicalConditionService {
  constructor(
    @Inject(config.repos.medicalCondition.name) private medicalConditionRepo: IMedicalConditionRepo,
  ) {}
  
  findByCode(code: string): Promise<IMedicalConditionDTO | null> {
    try {
      return this.medicalConditionRepo.findByCode(code).then((medicalCondition) => {
        if (!medicalCondition) return null;
        return MedicalConditionMapper.toDTO(medicalCondition) as IMedicalConditionDTO;
      });
    } catch (e) {
      throw e;  
  }
}
  
  async findAll(): Promise<IMedicalConditionDTO[]> {
    try {
      const medicalConditions = await this.medicalConditionRepo.findAll();
      return medicalConditions.map(medicalCondition => MedicalConditionMapper.toDTO(medicalCondition) as IMedicalConditionDTO);
    } catch (e) { throw e; }

  }

  public async createMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>> {
    try {
      const codeOrError = MedicalConditionCode.create(medicalConditionDTO.code);
      if (codeOrError.isFailure) {
        return Result.fail<IMedicalConditionDTO>(codeOrError.errorValue());
      }
      const code = codeOrError.getValue();

      const designationOrError = MedicalConditionDesignation.create(medicalConditionDTO.designation);
      if (designationOrError.isFailure) {
        return Result.fail<IMedicalConditionDTO>(designationOrError.errorValue());
      }
      const designation = designationOrError.getValue();

      const descriptionOrError = MedicalConditionDescription.create(medicalConditionDTO.description);
      if (descriptionOrError.isFailure) {
        return Result.fail<IMedicalConditionDTO>(descriptionOrError.errorValue());
      }
      const description = descriptionOrError.getValue();

      const symptomsSetResult = SymptomsSet.create(
        medicalConditionDTO.symptoms.map(symptom => new SymptomDescription({ value: symptom }))
      );
      if (symptomsSetResult.isFailure) {
        return Result.fail<IMedicalConditionDTO>(symptomsSetResult.errorValue());
      }
      const symptoms = symptomsSetResult.getValue();

      const medicalConditionOrError = MedicalCondition.create({
        code,
        designation,
        description,
        symptoms
      });

      if (medicalConditionOrError.isFailure) {
        return Result.fail<IMedicalConditionDTO>(medicalConditionOrError.errorValue());
      }

      const medicalCondition = medicalConditionOrError.getValue();
      await this.medicalConditionRepo.save(medicalCondition);

      const medicalConditionDTOResult = MedicalConditionMapper.toDTO(medicalCondition) as IMedicalConditionDTO;
      return Result.ok<IMedicalConditionDTO>(medicalConditionDTOResult);
    } catch (e) {
      throw e;
    }
  }

  public async getAllMedicalConditions(): Promise<Result<IMedicalConditionDTO[]>> {
    try {
      const medicalConditions = await this.medicalConditionRepo.getAllMedicalConditions();
      const medicalConditionDTOs = medicalConditions.map(mc => MedicalConditionMapper.toDTO(mc) as IMedicalConditionDTO);
      return Result.ok<IMedicalConditionDTO[]>(medicalConditionDTOs);
    } catch (error) {
      return Result.fail<IMedicalConditionDTO[]>(error);
    }
  }


}