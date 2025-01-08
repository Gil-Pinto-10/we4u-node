"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../config"));
const Result_1 = require("../core/logic/Result");
const recordUnit_1 = require("../domain/patientMedicalRecord/recordUnit");
const recordLine_1 = require("../domain/patientMedicalRecord/recordLine");
const recordTypeEnum_1 = require("../domain/patientMedicalRecord/recordTypeEnum");
const recordSet_1 = require("../domain/patientMedicalRecord/recordSet");
const patientMedicalRecord_1 = require("../domain/patientMedicalRecord/patientMedicalRecord");
const PatientMedicalRecordMapper_1 = require("../mappers/PatientMedicalRecordMapper");
const axios_1 = __importDefault(require("axios"));
const environment_1 = require("../environment/environment");
let PatientMedicalRecordService = class PatientMedicalRecordService {
    constructor(patientMedicalRecordRepo, medicalConditionRepo, allergieRepo) {
        this.patientMedicalRecordRepo = patientMedicalRecordRepo;
        this.medicalConditionRepo = medicalConditionRepo;
        this.allergieRepo = allergieRepo;
    }
    async findByMedicalRecordNumber(patientMedicalRecordNumber) {
        try {
            const patientMedicalRecord = await this.patientMedicalRecordRepo.findByMedicalRecordNumber(patientMedicalRecordNumber);
            return Result_1.Result.ok(patientMedicalRecord);
        }
        catch (e) {
        }
        ;
    }
    async createPatientMedicalRecord(patientMedicalRecordDTO) {
        var _a, _b;
        try {
            const recordLines = [];
            const response = await axios_1.default.post(`${environment_1.environment.apiUrl}/api/Patient/findPatient`, {
                id: patientMedicalRecordDTO.patientMedicalRecordNumber.toString().trim()
            });
            if (!response.data) {
                return Result_1.Result.fail(`Patient with number ${patientMedicalRecordDTO.patientMedicalRecordNumber} does not exist`);
            }
            const existingRecord = await this.patientMedicalRecordRepo.findByMedicalRecordNumber(patientMedicalRecordDTO.patientMedicalRecordNumber);
            if (existingRecord) {
                return Result_1.Result.fail(`Patient medical record with number ${patientMedicalRecordDTO.patientMedicalRecordNumber} already exists`);
            }
            for (const record of patientMedicalRecordDTO.records) {
                let recordUnitOrError;
                if (record.recordType === recordTypeEnum_1.RecordTypeEnum.MEDICAL_CONDITION) {
                    const medicalCondition = await this.medicalConditionRepo.findByCode(record.recordReference.code);
                    if (!medicalCondition) {
                        console.error(`Medical condition with code ${record.recordReference.code} not found`);
                        return Result_1.Result.fail(`Medical condition with code ${record.recordReference.code} not found`);
                    }
                    if (!medicalCondition.code || !medicalCondition.designation) {
                        console.error(`Medical condition with code ${record.recordReference.code} is missing required properties`);
                        return Result_1.Result.fail(`Medical condition with code ${record.recordReference.code} is missing required properties`);
                    }
                    recordUnitOrError = recordUnit_1.RecordUnit.create({
                        code: medicalCondition.code.value,
                        description: (_a = medicalCondition.description) === null || _a === void 0 ? void 0 : _a.value,
                        designation: medicalCondition.designation.value
                    });
                }
                else if (record.recordType === recordTypeEnum_1.RecordTypeEnum.ALLERGIE) {
                    const allergie = await this.allergieRepo.findByCode(record.recordReference.code);
                    if (!allergie) {
                        console.error(`Allergie with code ${record.recordReference.code} not found`);
                        return Result_1.Result.fail(`Allergie with code ${record.recordReference.code} not found`);
                    }
                    if (!allergie.code || !allergie.description || !allergie.designation) {
                        console.error(`Allergie with code ${record.recordReference.code} is missing required properties`);
                        return Result_1.Result.fail(`Allergie with code ${record.recordReference.code} is missing required properties`);
                    }
                    recordUnitOrError = recordUnit_1.RecordUnit.create({
                        code: allergie.code.value,
                        description: (_b = allergie.description) === null || _b === void 0 ? void 0 : _b.value,
                        designation: allergie.designation.value
                    });
                }
                else {
                    console.error(`Invalid record type ${record.recordType}`);
                    return Result_1.Result.fail(`Invalid record type ${record.recordType}`);
                }
                if (recordUnitOrError.isFailure) {
                    console.error(`Failed to create RecordUnit: ${recordUnitOrError.errorValue()}`);
                    return Result_1.Result.fail(recordUnitOrError.errorValue());
                }
                const recordLineOrError = recordLine_1.RecordLine.create({
                    recordReference: recordUnitOrError.getValue(),
                    recordType: record.recordType
                });
                if (recordLineOrError.isFailure) {
                    console.error(`Failed to create RecordLine: ${recordLineOrError.errorValue()}`);
                    return Result_1.Result.fail(recordLineOrError.errorValue());
                }
                recordLines.push(recordLineOrError.getValue());
            }
            const recordSetOrError = recordSet_1.RecordSet.create(recordLines);
            if (recordSetOrError.isFailure) {
                console.error(`Failed to create RecordSet: ${recordSetOrError.errorValue()}`);
                return Result_1.Result.fail(recordSetOrError.errorValue());
            }
            const patientMedicalRecordOrError = patientMedicalRecord_1.PatientMedicalRecord.create({
                patientMedicalRecordNumber: patientMedicalRecordDTO.patientMedicalRecordNumber,
                records: recordSetOrError.getValue()
            });
            if (patientMedicalRecordOrError.isFailure) {
                console.error(`Failed to create PatientMedicalRecord: ${patientMedicalRecordOrError.errorValue()}`);
                return Result_1.Result.fail(patientMedicalRecordOrError.errorValue());
            }
            const patientMedicalRecord = patientMedicalRecordOrError.getValue();
            await this.patientMedicalRecordRepo.save(patientMedicalRecord);
            const patientMedicalRecordDTOResult = PatientMedicalRecordMapper_1.PatientMedicalRecordMapper.toDTO(patientMedicalRecord);
            return Result_1.Result.ok(patientMedicalRecordDTOResult);
        }
        catch (e) {
            console.error(`Error in createPatientMedicalRecord: ${e}`);
            throw e;
        }
    }
    async addRecord(patientMedicalRecordNumber, code, recordType) {
        var _a, _b;
        try {
            const patientMedicalRecord = await this.patientMedicalRecordRepo.findByMedicalRecordNumber(patientMedicalRecordNumber);
            if (!patientMedicalRecord) {
                console.error(`Patient medical record with number ${patientMedicalRecordNumber} not found`);
                return Result_1.Result.fail(`Patient medical record with number ${patientMedicalRecordNumber} not found`);
            }
            let recordUnitOrError;
            if (recordType === recordTypeEnum_1.RecordTypeEnum.MEDICAL_CONDITION) {
                const medicalCondition = await this.medicalConditionRepo.findByCode(code);
                if (!medicalCondition) {
                    console.error(`Medical condition with code ${code} not found`);
                    return Result_1.Result.fail(`Medical condition with code ${code} not found`);
                }
                recordUnitOrError = recordUnit_1.RecordUnit.create({
                    code: medicalCondition.code.value,
                    description: (_a = medicalCondition.description) === null || _a === void 0 ? void 0 : _a.value,
                    designation: medicalCondition.designation.value
                });
            }
            else if (recordType === recordTypeEnum_1.RecordTypeEnum.ALLERGIE) {
                const allergie = await this.allergieRepo.findByCode(code);
                if (!allergie) {
                    console.error(`Allergie with code ${code} not found`);
                    return Result_1.Result.fail(`Allergie with code ${code} not found`);
                }
                recordUnitOrError = recordUnit_1.RecordUnit.create({
                    code: allergie.code.value,
                    description: (_b = allergie.description) === null || _b === void 0 ? void 0 : _b.value,
                    designation: allergie.designation.value
                });
            }
            else {
                console.error(`Invalid record type ${recordType}`);
                return Result_1.Result.fail(`Invalid record type ${recordType}`);
            }
            if (recordUnitOrError.isFailure) {
                console.error(`Failed to create RecordUnit: ${recordUnitOrError.errorValue()}`);
                return Result_1.Result.fail(recordUnitOrError.errorValue());
            }
            const recordLineOrError = recordLine_1.RecordLine.create({
                recordReference: recordUnitOrError.getValue(),
                recordType: recordType
            });
            if (recordLineOrError.isFailure) {
                console.error(`Failed to create RecordLine: ${recordLineOrError.errorValue()}`);
                return Result_1.Result.fail(recordLineOrError.errorValue());
            }
            patientMedicalRecord.addRecordUnit(recordUnitOrError.getValue(), recordType);
            await this.patientMedicalRecordRepo.save(patientMedicalRecord);
            const patientMedicalRecordDTOResult = PatientMedicalRecordMapper_1.PatientMedicalRecordMapper.toDTO(patientMedicalRecord);
            return Result_1.Result.ok(patientMedicalRecord);
        }
        catch (e) {
            console.error(`Error in addRecord: ${e}`);
            throw e;
        }
    }
    async findUnaddedAllergies(patientMedicalRecordNumber) {
        try {
            const patientMedicalRecord = await this.patientMedicalRecordRepo.findByMedicalRecordNumber(patientMedicalRecordNumber);
            if (!patientMedicalRecord) {
                throw new Error(`Patient medical record with number ${patientMedicalRecordNumber} not found`);
            }
            const allergies = await this.allergieRepo.findAll();
            const allergiesDTO = [];
            allergies.forEach(allergie => {
                var _a;
                allergiesDTO.push({
                    code: allergie.code.value,
                    designation: allergie.designation.value,
                    description: (_a = allergie.description) === null || _a === void 0 ? void 0 : _a.value
                });
            });
            return this.patientMedicalRecordRepo.findUnaddedAllergies(allergiesDTO, patientMedicalRecord);
        }
        catch (e) {
            throw e;
        }
    }
    async findUnaddedMedicalConditions(patientMedicalRecordNumber) {
        try {
            const patientMedicalRecord = await this.patientMedicalRecordRepo.findByMedicalRecordNumber(patientMedicalRecordNumber);
            if (!patientMedicalRecord) {
                throw new Error(`Patient medical record with number ${patientMedicalRecordNumber} not found`);
            }
            const medicalConditions = await this.medicalConditionRepo.findAll();
            const medicalConditionsDTO = [];
            medicalConditions.forEach(medicalCondition => {
                var _a;
                medicalConditionsDTO.push({
                    code: medicalCondition.code.value,
                    designation: medicalCondition.designation.value,
                    description: (_a = medicalCondition.description) === null || _a === void 0 ? void 0 : _a.value,
                    symptoms: medicalCondition.symptoms.values.map(symptom => symptom.value)
                });
            });
            return this.patientMedicalRecordRepo.findUnaddedMedicalConditions(medicalConditionsDTO, patientMedicalRecord);
        }
        catch (e) {
            throw e;
        }
    }
};
PatientMedicalRecordService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.repos.patientMedicalRecord.name)),
    __param(1, (0, typedi_1.Inject)(config_1.default.repos.medicalCondition.name)),
    __param(2, (0, typedi_1.Inject)(config_1.default.repos.allergie.name)),
    __metadata("design:paramtypes", [Object, Object, Object])
], PatientMedicalRecordService);
exports.default = PatientMedicalRecordService;
//# sourceMappingURL=patientMedicalRecordService.js.map