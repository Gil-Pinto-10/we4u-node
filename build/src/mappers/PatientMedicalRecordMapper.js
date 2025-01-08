"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientMedicalRecordMapper = void 0;
const Mapper_1 = require("../core/infra/Mapper");
const patientMedicalRecord_1 = require("../domain/patientMedicalRecord/patientMedicalRecord");
const recordLine_1 = require("../domain/patientMedicalRecord/recordLine");
const recordUnit_1 = require("../domain/patientMedicalRecord/recordUnit");
const recordTypeEnum_1 = require("../domain/patientMedicalRecord/recordTypeEnum");
const recordSet_1 = require("../domain/patientMedicalRecord/recordSet");
class PatientMedicalRecordMapper extends Mapper_1.Mapper {
    static toDTO(record) {
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
    static toDomain(raw) {
        const recordLinesOrError = raw.records.map(record => {
            const recordUnitOrError = recordUnit_1.RecordUnit.create({
                code: record.recordReference.code,
                description: record.recordReference.description,
                designation: record.recordReference.designation
            });
            if (recordUnitOrError.isFailure) {
                console.error(`Failed to create RecordUnit: ${recordUnitOrError.errorValue()}`);
                throw new Error(recordUnitOrError.errorValue());
            }
            const recordLineOrError = recordLine_1.RecordLine.create({
                recordReference: recordUnitOrError.getValue(),
                recordType: recordTypeEnum_1.RecordTypeEnum[record.recordType]
            });
            if (recordLineOrError.isFailure) {
                console.error(`Failed to create RecordLine: ${recordLineOrError.errorValue()}`);
                throw new Error(recordLineOrError.errorValue());
            }
            return recordLineOrError.getValue();
        });
        const recordSetOrError = recordSet_1.RecordSet.create(recordLinesOrError);
        if (recordSetOrError.isFailure) {
            console.error(`Failed to create RecordSet: ${recordSetOrError.errorValue()}`);
            throw new Error(recordSetOrError.errorValue());
        }
        const patientMedicalRecordOrError = patientMedicalRecord_1.PatientMedicalRecord.create({
            patientMedicalRecordNumber: raw.patientMedicalRecordNumber,
            records: recordSetOrError.getValue()
        });
        if (patientMedicalRecordOrError.isFailure) {
            console.error(`Failed to create PatientMedicalRecord: ${patientMedicalRecordOrError.errorValue()}`);
            throw new Error(patientMedicalRecordOrError.errorValue());
        }
        return patientMedicalRecordOrError.getValue();
    }
    static toPersistence(patientMedicalRecord) {
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
exports.PatientMedicalRecordMapper = PatientMedicalRecordMapper;
//# sourceMappingURL=PatientMedicalRecordMapper.js.map