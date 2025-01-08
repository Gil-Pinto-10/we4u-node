
import { Repo } from "../../core/infra/Repo";
import { Allergie } from "../../domain/allergie/allergie";
import { PatientMedicalRecord } from "../../domain/patientMedicalRecord/patientMedicalRecord";
import { IAllergieDTO } from "../../dto/IAllergieDTO";
import { IMedicalConditionDTO } from "../../dto/IMedicalConditionDTO";


export default interface IPatientMedicalRecordRepo extends Repo<PatientMedicalRecord> {
  save(patientMedicalRecord: PatientMedicalRecord): Promise<PatientMedicalRecord>;
  findByMedicalRecordNumber(id: string): Promise<PatientMedicalRecord | null>;
  findUnaddedAllergies(all: IAllergieDTO[], medicalRecord: PatientMedicalRecord): Promise<IAllergieDTO[]>;
  findUnaddedMedicalConditions(all: IAllergieDTO[], medicalRecord: PatientMedicalRecord): Promise<IMedicalConditionDTO[]>;
}