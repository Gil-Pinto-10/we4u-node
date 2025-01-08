import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Mapper } from "../core/infra/Mapper";
import { Document, Model } from "mongoose";

import { PatientMedicalRecord } from "../domain/patientMedicalRecord/patientMedicalRecord";
import { IPatientMedicalRecordDTO } from "../dto/IPatientMedicalRecordDTO";
import { IPatientMedicalRecordPersistence } from "../dataschema/IPatientMedicalRecord";
import { RecordLine } from "../domain/patientMedicalRecord/recordLine";
import { RecordUnit } from "../domain/patientMedicalRecord/recordUnit";
import { RecordTypeEnum } from "../domain/patientMedicalRecord/recordTypeEnum";
import { RecordSet } from "../domain/patientMedicalRecord/recordSet";

export class PatientMedicalRecordMapper extends Mapper<PatientMedicalRecord> {
    public static toDTO(record: PatientMedicalRecord): IPatientMedicalRecordDTO {
      return {
    
        patientMedicalRecordNumber: record.patientId,
        records: record.records.values.map(recordLine => ({
          recordReference: {
            code: recordLine.recordReference.code,
            description: recordLine.recordReference.description,
            designation: recordLine.recordReference.designation
          },
          recordType: recordLine.recordType
        }))
      };
      }
      public static toDomain(raw: any | Model<IPatientMedicalRecordPersistence> & Document): PatientMedicalRecord {
        const recordLinesOrError = raw.records.map(record => {
          const recordUnitOrError = RecordUnit.create({
            code: record.recordReference.code,
            description: record.recordReference.description,
            designation: record.recordReference.designation
          });
    
          if (recordUnitOrError.isFailure) {
            console.error(`Failed to create RecordUnit: ${recordUnitOrError.errorValue()}`);
            throw new Error(recordUnitOrError.errorValue());
          }
    
          const recordLineOrError = RecordLine.create({
            recordReference: recordUnitOrError.getValue(),
            recordType: RecordTypeEnum[record.recordType as keyof typeof RecordTypeEnum]
          });
    
          if (recordLineOrError.isFailure) {
            console.error(`Failed to create RecordLine: ${recordLineOrError.errorValue()}`);
            throw new Error(recordLineOrError.errorValue());
          }
    
          return recordLineOrError.getValue();
        });
    
        const recordSetOrError = RecordSet.create(recordLinesOrError);
        if (recordSetOrError.isFailure) {
          console.error(`Failed to create RecordSet: ${recordSetOrError.errorValue()}`);
          throw new Error(recordSetOrError.errorValue());
        }
    
        const patientMedicalRecordOrError = PatientMedicalRecord.create({
          patientMedicalRecordNumber: raw.patientMedicalRecordNumber,
          records: recordSetOrError.getValue()
        });
    
        if (patientMedicalRecordOrError.isFailure) {
          console.error(`Failed to create PatientMedicalRecord: ${patientMedicalRecordOrError.errorValue()}`);
          throw new Error(patientMedicalRecordOrError.errorValue());
        }
    
        return patientMedicalRecordOrError.getValue();
      }
    
    
      public static toPersistence(patientMedicalRecord: PatientMedicalRecord): IPatientMedicalRecordPersistence {
        return {
          domainId: patientMedicalRecord.id.toString(),
          patientMedicalRecordNumber: patientMedicalRecord.patientId,
          records: patientMedicalRecord.records.values.map(recordLine => ({
            recordReference: {
              code: recordLine.recordReference.code,
              description: recordLine.recordReference.description,
              designation: recordLine.recordReference.designation
            },
            recordType: recordLine.recordType
          }))
        };
      }


    }
