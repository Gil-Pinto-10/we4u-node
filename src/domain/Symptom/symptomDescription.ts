import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';

interface SymptomDescriptionProps {
  [key: string]: string;
  value: string;
}

export class SymptomDescription extends ValueObject<SymptomDescriptionProps> {
  get value(): string {
    return this.props.value;
  }

  public constructor(props: SymptomDescriptionProps) {
    super(props);
  }

  public static create(description: string): Result<SymptomDescription> {
    if (description.length > 2048)
      return Result.fail<SymptomDescription>(
        'Symptom description must be 2048 characters or less'
      );
    return Result.ok<SymptomDescription>(new SymptomDescription({ value: description }));
  }
}