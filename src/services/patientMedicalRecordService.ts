import { Service, Inject } from 'typedi';
import config from '../config';
import { Result } from '../core/logic/Result';
import IPatientMedicalRecordService from './IServices/IPatientMedicalRecordService';
import IPatientMedicalRecordRepo from './IRepos/IPatientMedicalRecordRepo';
import { IPatientMedicalRecordDTO } from '../dto/IPatientMedicalRecordDTO';
import { RecordUnit } from '../domain/patientMedicalRecord/recordUnit';
import { RecordLine } from '../domain/patientMedicalRecord/recordLine';
import { RecordTypeEnum } from '../domain/patientMedicalRecord/recordTypeEnum';
import { RecordSet } from '../domain/patientMedicalRecord/recordSet';
import { PatientMedicalRecord } from '../domain/patientMedicalRecord/patientMedicalRecord';
import { PatientMedicalRecordMapper } from '../mappers/PatientMedicalRecordMapper';
import IMedicalConditionRepo from './IRepos/IMedicalConditionRepo';
import IAllergieRepo from './IRepos/IAllergieRepo';
import axios from 'axios';
import { environment } from '../environment/environment';
import { Allergie } from '../domain/allergie/allergie';
import { IAllergieDTO } from '../dto/IAllergieDTO';
import { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';

@Service()
export default class PatientMedicalRecordService implements IPatientMedicalRecordService {
    constructor(
        @Inject(config.repos.patientMedicalRecord.name) private patientMedicalRecordRepo: IPatientMedicalRecordRepo,
        @Inject(config.repos.medicalCondition.name) private medicalConditionRepo: IMedicalConditionRepo,
        @Inject(config.repos.allergie.name) private allergieRepo: IAllergieRepo,
    ) {}


    public async findByMedicalRecordNumber(patientMedicalRecordNumber: string): Promise<Result<PatientMedicalRecord>> {
      try {
        const patientMedicalRecord = await this.patientMedicalRecordRepo.findByMedicalRecordNumber(patientMedicalRecordNumber);
        return Result.ok<PatientMedicalRecord>(patientMedicalRecord);
      }catch(e){

      };
    }
      

    public async createPatientMedicalRecord(patientMedicalRecordDTO: IPatientMedicalRecordDTO): Promise<Result<IPatientMedicalRecordDTO>> {
        try {
          const recordLines: RecordLine[] = [];
    
          const response = await axios.post(`${environment.apiUrl}/api/Patient/findPatient`, {
            id: patientMedicalRecordDTO.patientMedicalRecordNumber.toString().trim()
        });
          if (!response.data) {
              return Result.fail<IPatientMedicalRecordDTO>(`Patient with number ${patientMedicalRecordDTO.patientMedicalRecordNumber} does not exist`);
          }


          const existingRecord = await this.patientMedicalRecordRepo.findByMedicalRecordNumber(patientMedicalRecordDTO.patientMedicalRecordNumber);
          if (existingRecord) {
              return Result.fail<IPatientMedicalRecordDTO>(`Patient medical record with number ${patientMedicalRecordDTO.patientMedicalRecordNumber} already exists`);
          }

          for (const record of patientMedicalRecordDTO.records) {
            let recordUnitOrError: Result<RecordUnit>;
    
            if (record.recordType === RecordTypeEnum.MEDICAL_CONDITION) {
              const medicalCondition = await this.medicalConditionRepo.findByCode(record.recordReference.code);
              if (!medicalCondition) {
                console.error(`Medical condition with code ${record.recordReference.code} not found`);
                return Result.fail<IPatientMedicalRecordDTO>(`Medical condition with code ${record.recordReference.code} not found`);
              }
    
        
    
              if (!medicalCondition.code || !medicalCondition.designation) {
                console.error(`Medical condition with code ${record.recordReference.code} is missing required properties`);
                return Result.fail<IPatientMedicalRecordDTO>(`Medical condition with code ${record.recordReference.code} is missing required properties`);
              }
    
              recordUnitOrError = RecordUnit.create({
                code: medicalCondition.code.value,
                description: medicalCondition.description?.value,
                designation: medicalCondition.designation.value
              });
            } else if (record.recordType === RecordTypeEnum.ALLERGIE) {
              
              const allergie = await this.allergieRepo.findByCode(record.recordReference.code);
              if (!allergie) {
                console.error(`Allergie with code ${record.recordReference.code} not found`);
                return Result.fail<IPatientMedicalRecordDTO>(`Allergie with code ${record.recordReference.code} not found`);
              }
    
     
    
              if (!allergie.code || !allergie.description || !allergie.designation) {
                console.error(`Allergie with code ${record.recordReference.code} is missing required properties`);
                return Result.fail<IPatientMedicalRecordDTO>(`Allergie with code ${record.recordReference.code} is missing required properties`);
              }
           
              recordUnitOrError = RecordUnit.create({
                code: allergie.code.value,
                description: allergie.description?.value,
                designation: allergie.designation.value
              });
            } else {
              console.error(`Invalid record type ${record.recordType}`);
              return Result.fail<IPatientMedicalRecordDTO>(`Invalid record type ${record.recordType}`);
            }
    
            if (recordUnitOrError.isFailure) {
              console.error(`Failed to create RecordUnit: ${recordUnitOrError.errorValue()}`);
              return Result.fail<IPatientMedicalRecordDTO>(recordUnitOrError.errorValue());
            }
    
            const recordLineOrError = RecordLine.create({
              recordReference: recordUnitOrError.getValue(),
              recordType: record.recordType as RecordTypeEnum
            });
    
            if (recordLineOrError.isFailure) {
              console.error(`Failed to create RecordLine: ${recordLineOrError.errorValue()}`);
              return Result.fail<IPatientMedicalRecordDTO>(recordLineOrError.errorValue());
            }
    
            recordLines.push(recordLineOrError.getValue());
          }
    
          const recordSetOrError = RecordSet.create(recordLines);
    
          if (recordSetOrError.isFailure) {
            console.error(`Failed to create RecordSet: ${recordSetOrError.errorValue()}`);
            return Result.fail<IPatientMedicalRecordDTO>(recordSetOrError.errorValue());
          }
    
          const patientMedicalRecordOrError = PatientMedicalRecord.create({
            patientMedicalRecordNumber: patientMedicalRecordDTO.patientMedicalRecordNumber,
            records: recordSetOrError.getValue()
          });
    
          if (patientMedicalRecordOrError.isFailure) {
            console.error(`Failed to create PatientMedicalRecord: ${patientMedicalRecordOrError.errorValue()}`);
            return Result.fail<IPatientMedicalRecordDTO>(patientMedicalRecordOrError.errorValue());
          }
    
          const patientMedicalRecord = patientMedicalRecordOrError.getValue();
          await this.patientMedicalRecordRepo.save(patientMedicalRecord);
    
          const patientMedicalRecordDTOResult = PatientMedicalRecordMapper.toDTO(patientMedicalRecord) as IPatientMedicalRecordDTO;
          return Result.ok<IPatientMedicalRecordDTO>(patientMedicalRecordDTOResult);
        } catch (e) {
          console.error(`Error in createPatientMedicalRecord: ${e}`);
          throw e;
        }
      }

      public async addRecord(patientMedicalRecordNumber: string, code: string, recordType: string): Promise<Result<PatientMedicalRecord>> {
        try {
          const patientMedicalRecord = await this.patientMedicalRecordRepo.findByMedicalRecordNumber(patientMedicalRecordNumber);
          if (!patientMedicalRecord) {
            console.error(`Patient medical record with number ${patientMedicalRecordNumber} not found`);
            return Result.fail<PatientMedicalRecord>(`Patient medical record with number ${patientMedicalRecordNumber} not found`);
          }
    
          let recordUnitOrError: Result<RecordUnit>;
    
          if (recordType === RecordTypeEnum.MEDICAL_CONDITION) {
            const medicalCondition = await this.medicalConditionRepo.findByCode(code);
            if (!medicalCondition) {
              console.error(`Medical condition with code ${code} not found`);
              return Result.fail<PatientMedicalRecord>(`Medical condition with code ${code} not found`);
            }
    
         
    
            recordUnitOrError = RecordUnit.create({
              code: medicalCondition.code.value,
              description: medicalCondition.description?.value,
              designation: medicalCondition.designation.value
            });
          } else if (recordType === RecordTypeEnum.ALLERGIE) {
            const allergie = await this.allergieRepo.findByCode(code);
            if (!allergie) {
              console.error(`Allergie with code ${code} not found`);
              return Result.fail<PatientMedicalRecord>(`Allergie with code ${code} not found`);
            }
    
          
    
            recordUnitOrError = RecordUnit.create({
              code: allergie.code.value,
              description: allergie.description?.value,
              designation: allergie.designation.value
            });
          } else {
            console.error(`Invalid record type ${recordType}`);
            return Result.fail<PatientMedicalRecord>(`Invalid record type ${recordType}`);
          }
    
          if (recordUnitOrError.isFailure) {
            console.error(`Failed to create RecordUnit: ${recordUnitOrError.errorValue()}`);
            return Result.fail<PatientMedicalRecord>(recordUnitOrError.errorValue());
          }
    
          const recordLineOrError = RecordLine.create({
            recordReference: recordUnitOrError.getValue(),
            recordType: recordType
          });
    
          if (recordLineOrError.isFailure) {
            console.error(`Failed to create RecordLine: ${recordLineOrError.errorValue()}`);
            return Result.fail<PatientMedicalRecord>(recordLineOrError.errorValue());
          }
    
        
          patientMedicalRecord.addRecordUnit(recordUnitOrError.getValue(), recordType);
    
        
          await this.patientMedicalRecordRepo.save(patientMedicalRecord);
    
          const patientMedicalRecordDTOResult = PatientMedicalRecordMapper.toDTO(patientMedicalRecord);
        
          return Result.ok<PatientMedicalRecord>(patientMedicalRecord);
        } catch (e) {
          console.error(`Error in addRecord: ${e}`);
          throw e;
        }
      }

      public async findUnaddedAllergies(patientMedicalRecordNumber: string): Promise<IAllergieDTO[]> {
        try {
          const patientMedicalRecord = await this.patientMedicalRecordRepo.findByMedicalRecordNumber(patientMedicalRecordNumber);
          if (!patientMedicalRecord) {
            throw new Error(`Patient medical record with number ${patientMedicalRecordNumber} not found`);
          }
      
          const allergies = await this.allergieRepo.findAll();
          const allergiesDTO: IAllergieDTO[] = [];
          allergies.forEach(allergie => {
            allergiesDTO.push({
              code: allergie.code.value,
              designation: allergie.designation.value,
              description: allergie.description?.value
            });
          });

          return this.patientMedicalRecordRepo.findUnaddedAllergies(allergiesDTO, patientMedicalRecord);

        }catch(e){
          throw e;
        }
      }

      public async findUnaddedMedicalConditions(patientMedicalRecordNumber: string): Promise<IMedicalConditionDTO[]> {
        try {
          const patientMedicalRecord = await this.patientMedicalRecordRepo.findByMedicalRecordNumber(patientMedicalRecordNumber);
          if (!patientMedicalRecord) {
            throw new Error(`Patient medical record with number ${patientMedicalRecordNumber} not found`);
          }
      
          const medicalConditions = await this.medicalConditionRepo.findAll();
          const medicalConditionsDTO: IMedicalConditionDTO[] = [];
          medicalConditions.forEach(medicalCondition => {
            medicalConditionsDTO.push({
              code: medicalCondition.code.value,
              designation: medicalCondition.designation.value,
              description: medicalCondition.description?.value,
              symptoms: medicalCondition.symptoms.values.map(symptom => symptom.value)
            });
          });

          return this.patientMedicalRecordRepo.findUnaddedMedicalConditions(medicalConditionsDTO, patientMedicalRecord);

        }catch(e){
          throw e;
        }
      }
    

      
}
