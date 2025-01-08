import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Allergie } from '../allergie/allergie';

import { SymptomDescription } from '../Symptom/symptomDescription';
import { RecordLine } from './recordLine';
import { RecordTypeEnum } from './recordTypeEnum';
import { RecordUnit } from './recordUnit';

interface RecordSetProps {
  values: RecordLine[];
}

export class RecordSet extends ValueObject<RecordSetProps> {
  
  includes(allergie: Allergie) {
    return this.props.values.some((recordLine) => recordLine.recordReference.code === allergie.code.value);
  }
  get values(): RecordLine[] {
    return this.props.values;
  }

  private constructor(props: RecordSetProps) {
    super(props);
  }

  public static create(initialValues: RecordLine[] = []): Result<RecordSet> {
    if (!Array.isArray(initialValues) || !initialValues.every((val) => val instanceof RecordLine)) {
      return Result.fail<RecordSet>("Something wrong happened on the record set.");
    }

    const units = initialValues.map(val => RecordLine.create({ recordReference: RecordUnit.create({ code: val.recordReference.code, designation: val.recordReference.designation, description: val.recordReference.description }).getValue(), recordType: val.props.recordType }).getValue());
    return Result.ok<RecordSet>(new RecordSet({ values: units }));
  }


  public addRecord(record: RecordUnit, recordType: RecordTypeEnum): Result<void> {
 
    const recordUnitResult = RecordUnit.create(record);
    if (recordUnitResult.isFailure) {
      console.error(`Failed to create RecordUnit: ${recordUnitResult.error}`);
      return Result.fail<void>(recordUnitResult.error);
    }
  
  
    const recordLineResult = RecordLine.create({ recordReference: record, recordType });
    if (recordLineResult.isFailure) {
      console.error(`Failed to create RecordLine: ${recordLineResult.error}`);
      return Result.fail<void>(recordLineResult.error);
    }
  
  
    this.props.values.push(recordLineResult.getValue());
   
  
    return Result.ok<void>();
  }
  
}