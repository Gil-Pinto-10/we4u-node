
import { Result } from '../../core/logic/Result';
import { IMedicalConditionDTO } from '../../dto/IMedicalConditionDTO';


export default interface IMedicalConditionService {

  createMedicalCondition(MedicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>>;
  findAll(): Promise<IMedicalConditionDTO[]>; 
  findByCode(code: string): Promise<IMedicalConditionDTO | null>;
  getAllMedicalConditions(): Promise<Result<IMedicalConditionDTO[]>>;

}