
import { Result } from '../../core/logic/Result';
import { Allergie } from '../../domain/allergie/allergie';
import { PatientMedicalRecord } from '../../domain/patientMedicalRecord/patientMedicalRecord';
import { RecordTypeEnum } from '../../domain/patientMedicalRecord/recordTypeEnum';
import { IAllergieDTO } from '../../dto/IAllergieDTO';
import { IMedicalConditionDTO } from '../../dto/IMedicalConditionDTO';
import { IPatientMedicalRecordDTO } from '../../dto/IPatientMedicalRecordDTO';


export default interface IPatientMedicalRecordService {

  createPatientMedicalRecord(patientMedicalRecordDTO: IPatientMedicalRecordDTO): Promise<Result<IPatientMedicalRecordDTO>>;
  addRecord(patientMedicalRecordNumber: string, code: string, recordType: string): Promise<Result<PatientMedicalRecord>>;
  findByMedicalRecordNumber(patientMedicalRecordNumber: string): Promise<Result<PatientMedicalRecord>>;
  findUnaddedAllergies(patientMedicalRecordNumber: string): Promise<IAllergieDTO[]>;
  findUnaddedMedicalConditions(patientMedicalRecordNumber: string): Promise<IMedicalConditionDTO[]>;
}