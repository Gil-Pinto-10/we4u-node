import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';

interface MedicalConditionDesignationProps {
  [key: string]: string;
  value: string;
}

export class MedicalConditionDesignation extends ValueObject<MedicalConditionDesignationProps> {
  get value(): string {
    return this.props.value;
  }

  public constructor(props: MedicalConditionDesignationProps) {
    super(props);
  }

  public static create(name: string): Result<MedicalConditionDesignation> {
    if (name.length > 100)
      return Result.fail<MedicalConditionDesignation>('Medical Condition designation must be 100 characters or less');

    return Result.ok<MedicalConditionDesignation>(new MedicalConditionDesignation({ value: name }));
  }
}