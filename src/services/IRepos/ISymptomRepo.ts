
import { Repo } from "../../core/infra/Repo";
import { Symptom } from "../../domain/Symptom/symptom";

export default interface ISymptomRepo extends Repo<Symptom> {
  save(symptom: Symptom): Promise<Symptom>;
  getAllSymptoms(): Promise<Symptom[]>;
}