
import { Repo } from "../../core/infra/Repo";
import { MedicalCondition } from "../../domain/medicalCondition/medicalCondition";


export default interface IMedicalConditionRepo extends Repo<MedicalCondition> {
  save(medicalCondition: MedicalCondition): Promise<MedicalCondition>;

  findByCode(code: string): Promise<MedicalCondition | null>;
  findAll(): Promise<MedicalCondition[]>;
  getAllMedicalConditions(): Promise<MedicalCondition[]>;

}