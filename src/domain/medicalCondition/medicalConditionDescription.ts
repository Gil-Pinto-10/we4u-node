import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';

interface MedicalConditionDescriptionProps {
  [key: string]: string;
  value: string;
}

export class MedicalConditionDescription extends ValueObject<MedicalConditionDescriptionProps> {
  get value(): string {
    return this.props.value;
  }

  public constructor(props: MedicalConditionDescriptionProps) {
    super(props);
  }

  public static create(description: string): Result<MedicalConditionDescription> {
    if (description.length > 2048)
      return Result.fail<MedicalConditionDescription>(
        'Medical Condition description must be 255 characters or less'
      );
    return Result.ok<MedicalConditionDescription>(new MedicalConditionDescription({ value: description }));
  }
}